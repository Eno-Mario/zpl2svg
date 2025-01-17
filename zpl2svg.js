
/* This is a very simple ZPL to SVG converter written in pure JavaScript. */
// @ts-check
"use strict";
(function (root, factory) { // @ts-ignore
    if (typeof module === 'object' && module.exports) {
        let bwipjs
        let canvas
        let imageLoader
        let pako
        const getBwipJs = () => {
            if (bwipjs) return bwipjs
            try {
                bwipjs = require('bwip-js') // @ts-ignore
            } catch (e) {
                console.error('zpl2svg error: bwip-js is required for barcode generation')
                throw e
            }
            return bwipjs
        }
        const getCanvas = () => {
            if (canvas) return canvas
            try { // @ts-ignore
                const { createCanvas, loadImage } = require('canvas')
                canvas = createCanvas(1024, 800); // Create canvas
                imageLoader = loadImage
            } catch (e) {
                console.error('zpl2svg error: canvas is required for image generation')
                throw e
            }
            return canvas
        }
        const getPako = () => {
            if (pako) return pako
            try {
                pako = require('pako')
            } catch (e) {
                console.error('zpl2svg error: pako is required for Z64 graphic encoding and decoding')
                throw e
            }
        }
        const getImageLoader = () => {
            if (imageLoader) return imageLoader
            getCanvas()
            return imageLoader
        }
        module.exports = factory(getBwipJs, getCanvas, getImageLoader, getPako);
    } else {
        const canvas = document.createElement('canvas') // @ts-ignore
        const getBwipJs = () => bwipjs
        const getCanvas = () => canvas // @ts-ignore
        const getPako = () => pako
        const imageLoader = src => new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                resolve(img)
                URL.revokeObjectURL(img.src)
            }
            img.onerror = reject
            img.src = src
        })
        const getImageLoader = () => imageLoader
        const methods = factory(getBwipJs, getCanvas, getImageLoader, getPako);
        const keys = Object.keys(methods)
        for (let i = 0; i < keys.length; i++) {
            root[keys[i]] = methods[keys[i]] // Inject methods into global scope
        }
    }
}(typeof self !== 'undefined' ? self : this, function (getBwipjs, getCanvas, getImageLoader, getPako) {

    /** @type { (input: string[], configuration: { family: string, size: number, style: string, weight: string }) => void } */
    const parseFont = (input, configuration) => {
        const [font, height, width] = input
        const scale = 6 // Magic number to scale the font size to kinda match the real ZPL output
        switch (font) {
            case 'A': configuration.family = "OCR-A"; configuration.size = 5 * scale; break
            case 'B': configuration.family = "OCR-A"; configuration.size = 7 * scale; break
            case 'C': configuration.family = "OCR-A"; configuration.size = 10 * scale; break
            case 'D': configuration.family = "OCR-A"; configuration.size = 10 * scale; break
            case 'E': configuration.family = "OCR-B"; configuration.size = 15 * scale; break
            case 'F': configuration.family = "OCR-B"; configuration.size = 13 * scale; break
            case 'G': configuration.family = "OCR-B"; configuration.size = 40 * scale; break
            case 'H': configuration.family = "OCR-A"; configuration.size = 13 * scale; break
            case 'GS': configuration.family = "SYMBOL PROPORTIONAL"; break
            case 'O':
            // case '0': configuration.family = "Helvetica"; configuration.size = (+height * 0.5 * (scale || 1)) || configuration.size; break
            case '0': configuration.family = "ms-gothic, sans-serif"; configuration.size = +height || configuration.size; break
            case 'P': configuration.family = "Helvetica"; configuration.size = 18 * scale; break
            case 'Q': configuration.family = "Helvetica"; configuration.size = 24 * scale; break
            case 'R': configuration.family = "Helvetica"; configuration.size = 31 * scale; break
            case 'S': configuration.family = "Helvetica"; configuration.size = 35 * scale; break
            case 'T': configuration.family = "Helvetica"; configuration.size = 42 * scale; break
            case 'U': configuration.family = "Helvetica"; configuration.size = 53 * scale; break
            case 'V': configuration.family = "Helvetica"; configuration.size = 71 * scale; break
            default:
                console.log(`Unknown font: ${font}`)
                break
        }
    }


    /** @type { (input: string) => (number | ',' | '!' | ':')[] } */
    const decodeRLE = input => {
        /** @type { string[] } */
        const half_bytes = []

        input = input.replace(/[ \t\n]/g, '')
        const char_array = input.split('');

        const push = (n, c) => {
            for (let i = 0; i < n; i++) {
                half_bytes.push(c);
            }
        }

        const cc = c => c.charCodeAt(0)

        const G = cc('G')
        const Z = cc('Z')
        const g = cc('g')
        const z = cc('z')

        const seperators = [',', '!', ':']

        const getRepeat = character => {
            if (!character) return 0
            const c = cc(character)
            if (c >= G && c < Z) return c - G + 1
            if (c >= g && c <= z) return (c - g + 1) * 20
            if (c >= G) return 1
            return 0
        }

        while (char_array.length) {
            const c0 = char_array.shift() || '';
            const c1 = char_array[0] || '';
            if (seperators.includes(c0)) {
                push(1, c0)
                continue;
            }

            if (getRepeat(c0)) {
                let repeat = getRepeat(c0)
                let next = char_array.shift();
                while (getRepeat(next)) {
                    repeat += getRepeat(next)
                    next = char_array.shift();
                }
                push(repeat, next);
                continue;
            }
            if (getRepeat(c1)) {
                push(1, c0);
                continue;
            }
            push(1, c0);
        }
        return half_bytes.map(c => {
            if (c === ',') return ','
            if (c === '!') return '!'
            if (c === ':') return ':'
            const hex = parseInt(c, 16)
            if (isNaN(hex)) return 0
            return hex
        });
    }


    /** @type { (options: { bitmap: (0 | 1)[], width: number, height: number, inverted?: boolean }) => string } */
    const generateImageBase64 = ({ bitmap, width, height, inverted }) => {
        const canvas = getCanvas()
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get 2d context')
        const imageData = ctx.createImageData(width, height);
        for (let i = 0; i < bitmap.length; i++) {
            const on = bitmap[i] === 1;
            const value = inverted ? (on ? 255 : 0) : (on ? 0 : 255);
            imageData.data[i * 4 + 0] = value; // Red channel
            imageData.data[i * 4 + 1] = value; // Green channel
            imageData.data[i * 4 + 2] = value; // Blue channel
            imageData.data[i * 4 + 3] = on ? 255 : 0; // Alpha channel
        }
        ctx.putImageData(imageData, 0, 0);
        const path = canvas.toDataURL(); // Generate base64 image
        return path;
    }

    let img_id = 0
    /** @type { { id: number, parameters: string, data: string }[] }  */
    const image_cache = []

    /** @type { (bitmap: (0 | 1)[], width: number, height: number, inverted: boolean, parameters: string) => string } */
    const drawGF = (bitmap, width, height, inverted, parameters) => {
        img_id++
        for (const img of image_cache) {
            if (img.parameters === parameters) {
                img.id = img_id
                return img.data
            }
        }
        const base64 = generateImageBase64({ bitmap, width, height, inverted })
        const data = `<image x="0" y="0" width="${width}" height="${height}" size="${bitmap.length}" xlink:href="${base64}" ${inverted ? 'class="zpl-inverted"' : ''} />`
        image_cache.push({
            id: img_id,
            parameters,
            data
        })
        // Remove least used image if there are more than 10 images in the cache
        if (image_cache.length > 10) {
            image_cache.sort((a, b) => a.id - b.id)
            image_cache.shift()
        }
        return data
    }

    /** @type { (value: number, min: number, max: number) => number } */
    const constrain = (value, min, max) => Math.min(Math.max(value, min), max)

    /** @type { (z64: string, width: number, height: number) => (1|0)[] } */
    const z64_to_bitmap = (z64, width, height) => {
        if (!z64.startsWith(':Z64:')) throw new Error('Invalid Z64 format');

        // Extract Base64-encoded compressed data
        const last_colon = z64.lastIndexOf(':');
        const base64Data = z64.substring(5, last_colon);

        // Base64 decode
        const compressedData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        const pako = getPako();

        if (typeof pako === 'undefined' || !pako) throw new Error('pako library is required');

        // Decompress using zlib or pako
        const decompressedData = pako.inflate(compressedData); // uint8_t array, each byte represents 8 pixels

        // Calculate row length (bytes per row)
        const rowlen = Math.ceil(width / 8);

        // Validate decompressed data length
        const expectedLength = rowlen * height;
        if (decompressedData.length !== expectedLength) {
            throw new Error(`Decompressed data length ${decompressedData.length} does not match expected ${expectedLength}`);
        }

        // Create the bitmap
        const bitmap = new Array(width * height).fill(0);

        // Map decompressed data to bitmap
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const byteIndex = y * rowlen + Math.floor(x / 8);
                if (byteIndex >= decompressedData.length) {
                    console.error(`Byte index out of bounds: ${byteIndex}`);
                    continue;
                }
                const byte = decompressedData[byteIndex];
                const bit = (byte >> (7 - (x % 8))) & 1;
                bitmap[y * width + x] = bit ? 1 : 0;
            }
        }

        return bitmap;
    };

    /** @type { (rle: string, width: number, height: number) => (1|0)[] } */
    const rle_to_bitmap = (rle, width, height) => {
        // Decompress the ZPL ASCII bitmap data
        const decompressedDataHalfBytes = decodeRLE(rle);
        let idx = 0
        const bitmap = new Array(width * height).fill(0)

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const bitIndex = 3 - (x % 4)
                if (!(x === 0 && y === 0) && x % 4 === 0) idx++
                const byte = decompressedDataHalfBytes[idx]
                if (typeof byte === 'undefined') break
                if (byte === ',') break
                if (byte === '!') {
                    for (let i = x; i < width; i++) {
                        bitmap[y * width + i] = 1
                    }
                    break
                }
                if (byte === ':') {
                    if (y === 0) {
                        for (let i = 0; i < width; i++) {
                            bitmap[y * width + i] = 0
                        }
                    } else {
                        for (let i = 0; i < width; i++) {
                            bitmap[y * width + i] = bitmap[(y - 1) * width + i]
                        }
                    }
                    break
                }
                if (typeof byte === 'number') {
                    const bit = (byte >> bitIndex) & 1
                    bitmap[y * width + x] = bit ? 1 : 0
                }
            }
        }
        return bitmap
    }


    /** @type { (zpl: string, options?: { width?: number, height?: number, scale?: number, x_offset?: number, y_offset?: number, custom_class?: string, debug?: boolean, dynamic_size?: boolean }) => string } */
    const zpl2svg = (zpl, options) => {
        options = options || {}
        const lines = zpl.split("\n").map(line => line.trim()).filter(line => line.length > 0).join('').split('^').map(line => line.trim()).filter(line => line.length > 0)
        const svg = []
        const scale = options.scale || 1
        const x_offset = options.x_offset || 0
        const y_offset = options.y_offset || 0
        const custom_class = options.custom_class || ''
        const debug = options.debug || false
        const dynamic_size = typeof options.dynamic_size != 'undefined' ? !!options.dynamic_size : true
        const state = {
            scanning: false,
            font: {
                family: "Arial",
                size: 10,
                style: "normal",
                weight: "normal"
            },
            next_font: {
                family: "",
                size: 0,
                style: "",
                weight: ""
            },
            position: {
                x: 0,
                y: 0,
            },
            label_home_x: 0,
            label_home_y: 0,
            label_width: 0,
            label_height: 0,
            stroke: "#000",
            fill: "#000",
            inverted: false,
            alignment: "left",
            barcode: {
                type: '',
                width: 3, // in dots
                ratio: 3, // wide bar to narrow bar ratio
                barscale: 1, // width of narrow bar in dots
                orientation: 'N', // N, R, I, B
                check: false,
                height: 10, // in dots
                default_height: 10, // in dots
                print_human_readable: true,
                print_above: false,
            }
        }

        const main_classes = [
            custom_class
        ].filter(Boolean).join(' ')

        // YYYY-MM-DD HH:MM:SS
        const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

        // Head will be added to the SVG at the end when the dynamic size is read out if enabled

        svg.push(`  <!-- ######################################################### -->`)
        svg.push(`  <!-- ########## SVG Generated from ZPL using zpl2svg ######### -->`)
        svg.push(`  <!-- ######################################################### -->`)
        svg.push(`  <!--     Author:         Jozo132                               -->`)
        svg.push(`  <!--     Email:          jozo132@gmail.com                     -->`)
        svg.push(`  <!--     Source:         https://github.com/Jozo132/zpl2svg    -->`)
        svg.push(`  <!-- ######################################################### -->`)
        svg.push(`  <!--     Timestamp:      ${timestamp}                   -->`)
        svg.push(`  <!-- ######################################################### -->`)

        svg.push(`  <g transform="scale(${scale}) translate(${x_offset}, ${y_offset})">`)


        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].replace(/[\t\r\n]/g, '')
            const command = line.substring(0, 2).toUpperCase()
            line = line.substring(2)
            // console.log(`Command: ${command} with line: ${line}`)


            const inverted_body = state.inverted ? 'style="mix-blend-mode: difference;"' : ''

            const color = state.inverted ? '#FFF' : '#000'

            state.stroke = color
            state.fill = color

            // Match command with 'A' and any number or character
            const nf = state.scanning && command[0] === 'A' && command.match(/^A(\d|\w)/)
            if (nf) { // Format ^Af,o,h,w
                /* 
                    - f: font name (0-9, A-Z)
                    - o: orientation (N, R, I, B)
                    - h: height (1-32000)
                    - w: width (1-32000)
                */
                const args = line.split(',')
                const font = command[1]
                const [orientation, height, width] = args
                parseFont([font, height, width], state.next_font)
                continue
            }

            if (!state.scanning && command !== 'XA') { // Skip all commands until ^XA is found
                continue
            }

            switch (command) {
                case 'XA': // Start of label
                    state.scanning = true
                    break

                case 'PR': break // Print Rate


                case 'FX': svg.push(`    <!-- ${line} -->`); break // Comment

                case 'FS':
                    state.inverted = false
                    break // End of field

                case 'A@': { // Use font name to call font
                    /*
                        Format ^A@o,h,w,d:o.x
                        - o: orientation (N, R, I, B)
                        - h: height (1-32000)
                        - w: width (1-32000)
                        - d: drive location (R:, E:, B:, A:)
                        - o: font name
                        - x: extension (FNT, TTF)
                    */
                    const args = line.split(',')
                    const [orientation, height, width, drive, font, extension] = args
                    parseFont([font, height, width], state.next_font)

                    break
                }
                case 'CF': parseFont(line.split(','), state.font); break

                case 'PW': { // Print Width
                    const args = line.split(',')
                    state.label_width = args[0] ? parseInt(args[0]) || 0 : state.label_width
                    break
                }
                case 'LL': { // Label Length
                    const args = line.split(',')
                    state.label_height = args[0] ? parseInt(args[0]) || 0 : state.label_height
                    break
                }
                case 'LH': { // Label Home
                    const args = line.split(',')
                    state.label_home_x = args[0] ? parseInt(args[0]) || 0 : state.label_home_x
                    state.label_home_y = args[1] ? parseInt(args[1]) || 0 : state.label_home_y
                    break
                }

                case 'F0':
                case 'FO': { // Field Origin
                    const args = line.split(',')
                    state.position.x = parseInt(args[0]);
                    state.position.y = parseInt(args[1]);
                    break
                }
                // Graphic Box
                case 'GB': { // Format:  ^GBw,h,t,c,r   Example: '^GB200,200,10,B,1^FS'
                    const args = line.split(',')
                    const width = parseInt(args[0])
                    const height = parseInt(args[1])
                    const min = Math.min(width, height)
                    const inset = parseInt(args[2]) || 0
                    const color = ['B', 'W'].includes(args[3]) ? args[3] === 'B' ? '#000' : '#FFF' : null // B: Black, W: White
                    const radius = min > 0 ? constrain(parseInt(args[4]) || 0, 0, 8) / 16 * min : 0 // From 0 to 8 where the value is multiplied by 1/8 and multiplied by the shortest side of the box
                    // Draw shape with inset except when inset > width/2 or height/2 then just draw a rectangle with fill

                    if (inset == 0) break

                    const full = width / 2 <= inset || height / 2 <= inset

                    const w = width
                    const h = height
                    const i = inset
                    const r = radius

                    // Outline
                    const x = state.position.x + state.label_home_x
                    const y = state.position.y + state.label_home_y
                    const fill = color || state.fill
                    const stroke = color || state.stroke

                    let rect
                    if (full) {
                        rect = `    <rect type="rect" x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${r > 0 ? `rx="${r}px" ry="${r}px"` : ''} ${inverted_body}/>`
                    } else {
                        if (r > 0) {
                            const path = [
                                // Outer rectangle with rounded corners
                                `M ${x + r} ${y}`,
                                `h ${w - 2 * r}`,
                                `a ${r} ${r} 0 0 1 ${r} ${r}`,
                                `v ${h - 2 * r}`,
                                `a ${r} ${r} 0 0 1 -${r} ${r}`,
                                `h ${-w + 2 * r}`,
                                `a ${r} ${r} 0 0 1 -${r} -${r}`,
                                `v ${-h + 2 * r}`,
                                `a ${r} ${r} 0 0 1 ${r} -${r}`,
                                `z`
                            ]

                            const xi = x + i
                            const yi = y + i
                            const wi = w - 2 * i
                            const hi = h - 2 * i
                            const ri = r - i

                            if (ri <= 0) {
                                // Inner rectangle without rounded corners
                                path.push(...[
                                    `M ${xi} ${yi}`,
                                    `h ${wi}`,
                                    `v ${hi}`,
                                    `h ${-wi}`,
                                    `v ${-hi}`,
                                    `z`
                                ])
                            } else {
                                // Inner rectangle with rounded corners
                                path.push(...[
                                    `M ${xi + ri} ${yi}`,
                                    `h ${wi - 2 * ri}`,
                                    `a ${ri} ${ri} 0 0 1 ${ri} ${ri}`,
                                    `v ${hi - 2 * ri}`,
                                    `a ${ri} ${ri} 0 0 1 -${ri} ${ri}`,
                                    `h ${-wi + 2 * ri}`,
                                    `a ${ri} ${ri} 0 0 1 -${ri} -${ri}`,
                                    `v ${-hi + 2 * ri}`,
                                    `a ${ri} ${ri} 0 0 1 ${ri} -${ri}`,
                                    `z`
                                ])
                            }
                            rect = `    <path type="rect" d="${path.join(' ')}" fill="${stroke}" stroke="none" fill-rule="evenodd" ${inverted_body}/>`
                        } else {
                            rect = `    <rect type="rect" x="${x + i / 2}" y="${y + i / 2}" width="${w - i}" height="${h - i}" fill="none" stroke="${stroke}" stroke-width="${i}" ${inverted_body}/>`
                        }
                    }

                    svg.push(rect)
                    state.inverted = false
                    break
                }

                case 'FR': // Field Reverse Print
                    state.inverted = true;
                    break

                case 'FD': { // Field Data (Text or Barcode)

                    const args = line.split(',')
                    state.inverted = false
                    let value = args.join(',')
                    if (state.barcode.type) {
                        let bcid = ''
                        const scale = state.barcode.barscale
                        let alttext = ''
                        switch (state.barcode.type) {
                            case 'B0': bcid = 'azteccode'; break // TODO: Finish azteccode, partial implementation
                            case 'B1': bcid = 'code11'; break // Works
                            case 'B2': bcid = 'interleaved2of5'; break // Works
                            case 'B3': bcid = 'code39'; value = value.toLocaleUpperCase(); break // Works
                            case 'B4': bcid = 'code49'; break // Works
                            case 'B5': bcid = 'planet'; break // Works
                            case 'B7': bcid = 'pdf417'; break // Works
                            case 'B8': bcid = 'ean8'; break // Works
                            case 'B9': bcid = 'upce'; break // Works
                            case 'BA': bcid = 'code93'; break // Works
                            case 'BB': bcid = 'codablockf'; break // Works
                            // case 'BC': bcid = 'code128'; break // Not exactly the same
                            case 'BC': bcid = 'hibccode128'; alttext = value; break // Works
                            default: break
                        }
                        if (!bcid) {
                            console.log(`Unknown barcode type: ${state.barcode.type}`)
                            break
                        }


                        // bwip-js is imported in index.html
                        // bwip-js.d.ts exists in the same folder as this file
                        const barcode_options = {
                            bcid,
                            text: value,
                            height: state.barcode.height * (1 / scale / 3),
                            paddingtop: 0,
                            paddingbottom: 0,
                            paddingleft: 0,
                            paddingright: 0,
                            includetext: state.barcode.print_human_readable,
                            textxalign: 'center',
                            textcolor: state.stroke,
                            barcolor: state.stroke,
                            scale: scale,
                            rotate: state.barcode.orientation === 'B' ? 'L' : state.barcode.orientation,
                        }
                        if (alttext && state.barcode.print_human_readable) barcode_options.alttext = alttext
                        if (bcid === 'azteccode') { // @ts-ignore
                            delete barcode_options.height
                            barcode_options.scale *= state.barcode.magnification / 4
                            barcode_options.format = 'full'
                            if (state.barcode.error_control >= 1 && state.barcode.error_control <= 99) {
                                barcode_options.eclevel = state.barcode.error_control
                            }
                            if (state.barcode.error_control >= 101 && state.barcode.error_control <= 199) barcode_options.format = 'compact'
                            if (state.barcode.error_control >= 201 && state.barcode.error_control <= 232) barcode_options.format = 'fullrange'
                            if (state.barcode.error_control === 300) barcode_options.format = 'rune'

                            if (state.barcode.extended_channel) barcode_options.parse = true
                            if (state.barcode.menu_symbol) barcode_options.menu = true
                            if (state.barcode.number_of_symbols > 1) barcode_options.ecaddchars = state.barcode.number_of_symbols
                            if (state.barcode.optional_id) barcode_options.id = state.barcode.optional_id
                        }

                        // @ts-ignore
                        let barcode = ''
                        try {
                            const bwipjs = getBwipjs()
                            barcode = bwipjs.toSVG(barcode_options)
                        } catch (e) {
                            console.log(`Failed to generate barcode: ${state.barcode.type} with value: ${value}`)
                            console.log(e)
                            state.barcode.type = '' // Reset barcode type to prevent drawing barcode on next text field
                            break
                        }

                        // <svg viewBox="0 0 WIDTH HEIGHT" ...
                        // Extract the width and height from the viewBox attribute
                        const viewBox = barcode.match(/viewBox="0 0 (\d+) (\d+)"/)
                        if (viewBox) {
                            const [, width, height] = viewBox
                            const x = state.position.x + state.label_home_x
                            const y = state.position.y + state.label_home_y
                            //// const barcode_svg = barcode.replace(/<svg/, `<svg x="${x}" y="${y}" width="${width}"`)
                            //// replace svg with viewbox
                            // const params = encodeURI(JSON.stringify(Object.assign(
                            //     {
                            //         x: state.position.x + state.label_home_x,
                            //         y: state.position.y + state.label_home_y,
                            //     },
                            //     state.barcode
                            // )))
                            const barcode_svg = barcode.replace(/<svg viewBox="0 0 (\d+) (\d+)"/, `<g x="${x}" y="${y}" width="${width}" transform="translate(${x}, ${y})" fill="${state.fill}"`)
                                .replace(/<\/svg>/, '</g>')
                                .replace(' xmlns="http://www.w3.org/2000/svg"', '')
                            svg.push([
                                `    <g type="barcode" fill="${state.fill}" ${inverted_body}>`,
                                barcode_svg.split('\n').map(line => {
                                    line = line.trim()
                                    if (state.inverted) {
                                        line = line.replaceAll(`stroke="#000000"`, `stroke="#FFF" ${inverted_body}`)
                                    }
                                    if (!line) return ''
                                    return '      ' + line
                                }).filter(Boolean).join('\n'),
                                '    </g>'

                            ].join('\n'))
                        }
                        state.next_font.size = 0
                        state.next_font.family = ''
                        state.next_font.style = ''
                        state.next_font.weight = ''
                        state.barcode.type = ''
                    } else {
                        const size = state.next_font.size || state.font.size
                        const family = state.next_font.family || state.font.family
                        const style = state.next_font.style || state.font.style
                        const weight = state.next_font.weight || state.font.weight
                        state.next_font.size = 0
                        state.next_font.family = ''
                        state.next_font.style = ''
                        state.next_font.weight = ''
                        const x = state.position.x + state.label_home_x
                        const y = state.position.y + state.label_home_y
                        const text = `    <text x="${x}" y="${y}" dy="0.75em" font-size="${size}" font-family="${family}" font-style="${style}" font-weight="${weight}" fill="${state.fill}" ${inverted_body}>${value}</text>`
                        svg.push(text)
                    }
                    state.inverted = false
                    break
                }


                case 'BY': { // Barcode Field Default Parameters
                    const args = line.split(',')
                    state.barcode.barscale = parseInt(args[0]) || state.barcode.barscale
                    // state.barcode.ratio = parseInt(args[1]) || state.barcode.ratio
                    state.barcode.width = parseInt(args[1]) || state.barcode.width
                    state.barcode.default_height = parseInt(args[2]) || state.barcode.default_height
                    break
                }



                // Aztec Code
                case 'B0':
                case 'BO': { // Format: ^B0a,b,c,d,e,f,g        Example: '^B0R,7,N,0,N,1,0^FDYourTextHere^FS'
                    /*
                        - a: orientation (N, R, I, B)
                        - b: magnification factor (1-10) default:  1 on 150 DPI, 2 on 200 DPI, 3 on 300 DPI and 6 on 600 DPI
                        - c: extended channel interpretation (N, Y) default: N
                        - d: error control and symbol size/type identification default: 0
                                - 0: default
                                - 01 to 99: error control percentage (minimum)
                                - 101 to 199: 1 to 4 layer compact symbol
                                - 201 to 232: 1 to 32 layer full-range symbol
                                - 300: a simple Aztec Rune symbol
                        - e: menu symbol (N, Y) default: N
                        - f: number of symbols (0-26) default: 1
                        - g: optional ID field (24 characters max) default: <empty>  
                    */
                    const args = line.split(',')
                    state.barcode.type = command
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.magnification = parseInt(args[1]) || 1
                    state.barcode.extended_channel = args[2] ? args[2] === 'Y' : false
                    state.barcode.error_control = parseInt(args[3]) || 0
                    state.barcode.menu_symbol = args[4] ? args[4] === 'Y' : false
                    state.barcode.number_of_symbols = parseInt(args[5]) || 1
                    state.barcode.optional_id = args[6] || ''
                    break
                }

                // Code 11 Barcode
                case 'B1': { // Format: ^B1o,e,h,f,g     Example: '^B1N,N,150,Y,N^FD1234567890^FS'
                    state.barcode.type = command
                    /*
                        Parameters:
                            - orientation: N, R, I, B
                            - check digit: N, Y
                            - height: 10
                            - print human readable: Y, N
                            - print above: Y, N
                    */
                    const args = line.split(',')
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.check = args[1] ? args[1] === 'Y' : false
                    state.barcode.height = parseInt(args[2]) || state.barcode.default_height
                    state.barcode.print_human_readable = args[3] ? args[3] === 'Y' : true
                    state.barcode.print_above = args[4] ? args[4] === 'Y' : false
                    break
                }

                // Interleaved 2 of 5 Barcode
                case 'B2': { // Format:  ^B2o,h,f,g,e,j    Example: '^B2N,100,Y,N,Y^FD1234567890^FS'
                    state.barcode.type = command
                    /*
                        Parameters:
                            - orientation: N, R, I, B
                            - height: 10
                            - print human readable: Y, N
                            - print above: Y, N
                            - check digit: Y, N
                            - narrow bar width: 2, 3, 4, 5, 6, 7, 8, 9
                    */
                    const args = line.split(',')
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.height = parseInt(args[1]) || state.barcode.default_height
                    state.barcode.print_human_readable = args[2] ? args[2] === 'Y' : true
                    state.barcode.print_above = args[3] ? args[3] === 'Y' : false
                    state.barcode.check = args[4] ? args[4] === 'Y' : false
                    state.barcode.barscale = parseInt(args[5]) || state.barcode.barscale
                    break
                }

                // Barcode 39
                case 'B3': { // Format: ^B3o,e,h,f,g,j,m,n    Example: '^B3N,N,80,N,N^FD2581752^FS'
                    state.barcode.type = command
                    /*
                      Parameters: 
                        - orientation: N, R, I, B
                        - check digit: N, Y
                        - height: 10
                        - print human readable: Y, N
                        - print above: Y, N
                    */
                    const args = line.split(',')
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.check = args[1] ? args[1] === 'Y' : false
                    state.barcode.height = parseInt(args[2]) || state.barcode.default_height
                    state.barcode.print_human_readable = args[3] ? args[3] === 'Y' : true
                    state.barcode.print_above = args[4] ? args[4] === 'Y' : false
                    break
                }

                // Barcode 49
                case 'B4': { // Format: ^B4o,h,f,m      Example: '^B4N,100,Y,0^FD1234567890^FS'
                    state.barcode.type = command
                    /*
                      Parameters: 
                        - orientation: N, R, I, B
                        - height: 10
                        - print human readable: Y, N
                        - mode: 0, 1, 2, 3, 4, 5, A    default: A
                    */
                    const args = line.split(',')
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.height = parseInt(args[1]) || state.barcode.default_height
                    state.barcode.print_human_readable = args[2] ? args[2] === 'Y' : true
                    state.barcode.mode = parseInt(args[3]) || 0
                    break
                }

                // Planet Code Barcode
                case 'B5': { // Format: ^B5o,h,f,g    Example: '^B5N,100,Y,N^FD1234567890^FS'
                    state.barcode.type = command
                    /*
                      Parameters: 
                        - orientation: N, R, I, B
                        - height: 10
                        - print human readable: Y, N
                        - print above: Y, N
                    */
                    const args = line.split(',')
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.height = parseInt(args[1]) || state.barcode.default_height
                    state.barcode.print_human_readable = args[2] ? args[2] === 'Y' : false
                    state.barcode.print_above = args[3] ? args[3] === 'Y' : false
                    break
                }

                // PDF417 Barcode
                case 'B7': { // Format: ^B7o,h,s,c,r,t    Example: '^B7N,100,Y,N,N^FDYourTextHere^FS'
                    state.barcode.type = command
                    /*
                      Parameters: 
                        - orientation: N, R, I, B
                        - height: 10
                        - security level: 0-8
                        - columns: 0-30
                        - rows: 3-90
                        - truncated: Y, N
                    */
                    const args = line.split(',')
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.height = parseInt(args[1]) || state.barcode.default_height
                    state.barcode.security_level = parseInt(args[2]) || 0
                    state.barcode.columns = parseInt(args[3]) || 0
                    state.barcode.rows = parseInt(args[4]) || 3
                    state.barcode.truncated = args[5] ? args[5] === 'Y' : false
                    break
                }

                // EAN-8 Barcode
                case 'B8': { // Format: ^B8o,h,f,g    Example: '^B8N,100,Y,N^FD12345678^FS'
                    state.barcode.type = command
                    /*
                      Parameters: 
                        - orientation: N, R, I, B
                        - height: 10
                        - print human readable: Y, N
                        - print above: Y, N
                    */
                    const args = line.split(',')
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.height = parseInt(args[1]) || state.barcode.default_height
                    state.barcode.print_human_readable = args[2] ? args[2] === 'Y' : true
                    state.barcode.print_above = args[3] ? args[3] === 'Y' : false
                    break
                }

                // UPC-E Barcode
                case 'B9': { // Format: ^B9o,h,f,g,e    Example:  '^B9N,100,Y,N,N^FD12345678^FS'
                    state.barcode.type = command
                    /*
                      Parameters: 
                        - orientation: N, R, I, B
                        - height: 10
                        - print human readable: Y, N
                        - print above: Y, N
                        - check digit: Y, N
                    */
                    const args = line.split(',')
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.height = parseInt(args[1]) || state.barcode.default_height
                    state.barcode.print_human_readable = args[2] ? args[2] === 'Y' : true
                    state.barcode.print_above = args[3] ? args[3] === 'Y' : false
                    state.barcode.check = args[4] ? args[4] === 'Y' : false
                    break
                }

                // Code 93 Barcode
                case 'BA': { // Format: ^BAo,h,f,g,e   Example: '^BAN,100,Y,N,N^FD1234567890^FS'
                    state.barcode.type = command
                    /*
                      Parameters: 
                        - orientation: N, R, I, B
                        - height: 10
                        - print human readable: Y, N
                        - print above: Y, N
                        - check digit: Y, N
                    */
                    const args = line.split(',')
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.height = parseInt(args[1]) || state.barcode.default_height
                    state.barcode.print_human_readable = args[2] ? args[2] === 'Y' : true
                    state.barcode.print_above = args[3] ? args[3] === 'Y' : false
                    state.barcode.check = args[4] ? args[4] === 'Y' : false
                    break
                }

                // CODABLOCK Barcode
                case 'BB': { // Format: ^BBo,h,s,c,r,m     Example: '^BBN,100,Y,N,N^FDYourTextHere^FS'
                    state.barcode.type = command
                    /*
                      Parameters: 
                        - orientation: N, R, I, B
                        - height: 10
                        - security level: 0-8
                        - columns: 0-30
                        - rows: 3-90
                        - mode: N, R, I, B
                    */
                    const args = line.split(',')
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.height = parseInt(args[1]) || state.barcode.default_height
                    state.barcode.security_level = parseInt(args[2]) || 0
                    state.barcode.columns = parseInt(args[3]) || 0
                    state.barcode.rows = parseInt(args[4]) || 3
                    state.barcode.mode = args[5] || 'N'
                    break
                }

                // Barcode 128
                case 'BC': { // Format: ^BCo,h,f,g,e,m    Example: '^BCN,100,Y,N,N^FD1234567890^FS'
                    state.barcode.type = command
                    /*
                      Parameters: 
                        - orientation: N, R, I, B
                        - height: 10
                        - print human readable: Y, N
                        - print above: Y, N
                        - check digit: Y, N
                        - mode:
                            - N: no selected mode
                            - U: UCC case mode
                            - A: Auto mode
                            - D: UCC/EAN Application Identifier mode
                    */
                    const args = line.split(',')
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.height = parseInt(args[1]) || state.barcode.default_height
                    state.barcode.print_human_readable = args[2] ? args[2] === 'Y' : true
                    state.barcode.print_above = args[3] ? args[3] === 'Y' : false
                    state.barcode.check = args[4] ? args[4] === 'Y' : false
                    state.barcode.mode = args[5] || state.barcode.mode

                    break
                }

                // Graphic Field
                case 'GF': { // Format: ^GFa,b,c,d,DATA   Example: '^FO50,50^GFA,128,128,4,C,4J0FF84I03CCE401C73F24073CDBE60C1F21E3F804EFCJ0730400FFCF0403B3360407JC0C0JFC080JF81,07IF03,03FFE06,00FF80DEI0F01FA1F80069A1FE01FB61JFDE400IF61800IFC7,01IF84,07F7FE781FFE3F0C1FE117041FE193841FC0930C0F00B318I01661,J0FE1EJ03003^FS'

                    /*
                        - a: compression type (A, B, C)
                        - b: binary byte count
                        - c: graphic field count
                        - d: bytes per row
                    */

                    // Reuse pre-rendered paths
                    const parameter_id = [state.inverted].join(',') + ',' + line
                    const img = image_cache.find(p => p.parameters === parameter_id)
                    const x = state.position.x + state.label_home_x
                    const y = state.position.y + state.label_home_y
                    if (img) {
                        svg.push(`    <g type="graphic" transform="translate(${x}, ${y})">`)
                        svg.push('      ' + img.data)
                        svg.push('    </g>')
                        break
                    }

                    const args = line.split(',')
                    const [compression, binary_byte_count, graphic_field_count, bytesPerRow, ...data] = args
                    const graphic = data.join(',')
                    /** @type { (1|0)[] } */
                    let pixelData = []
                    if (compression === 'A') {

                        const width = parseInt(bytesPerRow) * 8
                        const height = (parseInt(graphic_field_count) / (parseInt(bytesPerRow) || 1)) || Infinity

                        // Check if Z64 compression is used
                        const z64 = graphic.includes('Z')
                        if (z64) {
                            pixelData = z64_to_bitmap(graphic, width, height)
                        } else {
                            pixelData = rle_to_bitmap(graphic, width, height)
                        }
                        if (debug) {
                            console.log(`width: ${width}, height: ${height}`)
                            console.log(`pixelData:`, pixelData)
                        }

                        const paths = drawGF(pixelData, width, height, state.inverted, parameter_id)
                        svg.push(`    <g type="graphic" ${inverted_body} transform="translate(${x}, ${y})">`)
                        svg.push('      ' + paths)
                        svg.push('    </g>')

                    } else if (compression === 'B') {

                    } else {
                        console.log(`Unknown compression: ${compression}`)
                    }
                    state.inverted = false
                    break
                }

                case 'XZ': // End of label
                    state.scanning = false
                    break

                default:
                    console.error(new Error(`Unknown command: ${command}`))
                    break
            }
        }
        svg.push(`  </g>`)
        svg.push(`</svg>`)

        const width = Math.floor((dynamic_size ? state.label_width || options.width : options.width) || 1200)
        const height = Math.floor((dynamic_size ? state.label_height || options.height : options.height) || 800)

        svg.unshift(`<svg class="${main_classes}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background-color: #FFF; isolation: isolate; position: relative;">`)

        return svg.join('\n')
    }

    // Use Image for browser and Canvas for Node.js
    const svg2png = async (svg, options) => {
        const canvas = getCanvas() // Gets a new canvas element from browser or node-canvas from Node.js
        const imageLoader = getImageLoader() // Gets a new Image element from browser or node-canvas from Node.js
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get 2d context')
        const svg_base64 = `data:image/svg+xml;base64,${btoa(svg)}`
        // console.log(`svg_base64:`, svg_base64)
        const image = await imageLoader(svg_base64)
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image, 0, 0)
        const png = canvas.toDataURL('image/png')
        return png
    }

    const zpl2png = async (zpl, options) => {
        const svg = zpl2svg(zpl, options)
        return await svg2png(svg, options)
    }

    return {
        zpl2svg,
        svg2png,
        zpl2png,
        decodeRLE,
        generateImageBase64,
        drawGF,
    }

}));