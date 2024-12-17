
/* This is a very simple ZPL to SVG converter written in pure JavaScript. */
// @ts-check
"use strict";
(function (root, factory) { // @ts-ignore
    if (typeof define === 'function' && define.amd) { // @ts-ignore
        define([bwipjs], factory);
    } else if (typeof module === 'object' && module.exports) {
        const bwipjs = require('bwip-js')
        module.exports = factory(bwipjs);
    } else { // @ts-ignore
        root.zplToSvg = factory(bwipjs);
    }
}(typeof self !== 'undefined' ? self : this, function (bwipjs) {
    if (!bwipjs) {
        console.error('zpl2svg error: bwip-js is required for barcode generation')
        return
    }
    /** @type { (input: string[], configuration: { family: string, size: number, style: string, weight: string }) => void } */
    const parseFont = (input, configuration) => {
        const [font, height, width] = input
        switch (font) {
            case 'A': configuration.family = "OCR-A"; configuration.size = 5; break
            case 'B': configuration.family = "OCR-A"; configuration.size = 7; break
            case 'C': configuration.family = "OCR-A"; configuration.size = 10; break
            case 'D': configuration.family = "OCR-A"; configuration.size = 10; break
            case 'E': configuration.family = "OCR-B"; configuration.size = 15; break
            case 'F': configuration.family = "OCR-B"; configuration.size = 13; break
            case 'G': configuration.family = "OCR-B"; configuration.size = 40; break
            case 'H': configuration.family = "OCR-A"; configuration.size = 13; break
            case 'GS': configuration.family = "SYMBOL PROPORTIONAL"; break
            case 'O':
            // case '0': configuration.family = "Helvetica"; configuration.size = (+height * 0.5 * (scale || 1)) || configuration.size; break
            case '0': configuration.family = "ms-gothic, sans-serif"; configuration.size = +height || configuration.size; break
            case 'P': configuration.family = "Helvetica"; configuration.size = 18; break
            case 'Q': configuration.family = "Helvetica"; configuration.size = 24; break
            case 'R': configuration.family = "Helvetica"; configuration.size = 31; break
            case 'S': configuration.family = "Helvetica"; configuration.size = 35; break
            case 'T': configuration.family = "Helvetica"; configuration.size = 42; break
            case 'U': configuration.family = "Helvetica"; configuration.size = 53; break
            case 'V': configuration.family = "Helvetica"; configuration.size = 71; break
            default:
                console.log(`Unknown font: ${font}`)
                break
        }
    }

    /** @type { (zpl: string, options?: { width?: number, height?: number, scale?: number, x_offset?: number, y_offset?: number, custom_class?: string }) => string } */
    const zplToSvg = (zpl, options) => {
        options = options || {}
        const lines = zpl.split("\n").map(line => line.split('//')[0].trim()).filter(line => line.length > 0).join('').split('^').map(line => line.trim()).filter(line => line.length > 0)
        const svg = []
        const scale = options.scale || 1
        const width = options.width || 1200
        const height = options.height || 800
        const x_offset = options.x_offset || 0
        const y_offset = options.y_offset || 0
        const custom_class = options.custom_class || ''
        const state = {
            font: {
                family: "Arial",
                size: 10,
                style: "normal",
                weight: "normal"
            },
            position: {
                x: 0,
                y: 0,
            },
            stroke: "black",
            fill: "black",
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

        // Add white background
        svg.push(`<svg ${custom_class ? `class="${custom_class}"` : ''} width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="dominant-baseline: hanging;">`)
        svg.push(`<rect x="0" y="0" width="100%" height="100%" fill="white"/>`)
        svg.push(`<g transform="scale(${scale}) translate(${x_offset}, ${y_offset})">`)
     

        // Track inversion regions
        let inversionMasks = []

        for (let i = 0; i < lines.length; i++) {
            const id = `s${svg.length}`

            let line = lines[i]
            const command = line.substring(0, 2).toUpperCase()
            line = line.substring(2)
            // console.log(`Command: ${command} with line: ${line}`)
            const args = line.split(',')

            switch (command) {
                case 'XA': break // Start of label

                case 'PR': break // Print Rate


                case 'FX': svg.push(`<!-- ${args.join(',')} -->`); break // Comment

                case 'FS': break // End of field

                case 'CF': parseFont(args, state.font); break

                case 'F0':
                case 'FO': // Field Origin
                    state.position.x = parseInt(args[0]);
                    state.position.y = parseInt(args[1]);
                    break

                case 'GB': { // Graphic Box
                    const width = parseInt(args[0])
                    const height = parseInt(args[1])
                    const inset = parseInt(args[2]) || 0
                    const radius = parseInt(args[3]) || 0
                    // Draw shape with inset except when inset > width/2 or height/2 then just draw a rectangle with fill
                    const params = encodeURI(JSON.stringify({
                        x: state.position.x,
                        y: state.position.y,
                        w: width,
                        h: height,
                        i: inset,
                        f: state.fill,
                        s: state.stroke,
                    }))
                    const full = width / 2 <= inset || height / 2 <= inset

                    const w = width
                    const h = height
                    const i = inset

                    // Outline
                    const x = state.position.x
                    const y = state.position.y
                    const fill = state.fill
                    const stroke = state.stroke

                    let rect
                    if (full) {
                        rect = `<rect type="rect" x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${radius ? `rx="${radius}px" ry="${radius}px" stroke="${stroke}" stroke-width="1"` : ''}/>`
                    } else {
                        const r = radius - i / 2
                        rect = `<rect type="rect" x="${x + i / 2}" y="${y + i / 2}" width="${w - i}" height="${h - i}" fill="none" stroke="${stroke}" stroke-width="${i}" ${r !== 0 ? `rx="${r}px" ry="${r}px"` : ''}/>`
                    }


                    svg.push(rect)

                    break
                }

                case 'FR': // Field Reverse Print (DOESN'T WORK IN SVG YET) TODO: Implementaion of reverse print
                    state.inverted = true;
                    break

                case 'FD': { // Field Data (Text or Barcode)
                    let value = args.join(',')
                    if (state.barcode.type) {
                        let bcid = ''
                        let scale_multiplier = state.barcode.barscale
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
                            case 'BC': bcid = 'hibccode128'; scale_multiplier *= 1; alttext = value; break // I don't know why but this works
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
                            height: state.barcode.height * scale_multiplier / (6 * scale_multiplier) / scale_multiplier,
                            paddingtop: 0,
                            paddingbottom: 0,
                            paddingleft: 0,
                            paddingright: 0,
                            includetext: state.barcode.print_human_readable,
                            textxalign: 'center',
                            textcolor: '#000',
                            scale: 2 * scale_multiplier,
                            rotate: state.barcode.orientation === 'B' ? 'L' : state.barcode.orientation,
                        }
                        if (alttext && state.barcode.print_human_readable) barcode_options.alttext = alttext
                        if (bcid === 'azteccode') {
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
                        const barcode = bwipjs.toSVG(barcode_options)

                        // <svg viewBox="0 0 WIDTH HEIGHT" ...
                        // Extract the width and height from the viewBox attribute
                        const viewBox = barcode.match(/viewBox="0 0 (\d+) (\d+)"/)
                        if (viewBox) {
                            const [, width, height] = viewBox
                            // const barcode_svg = barcode.replace(/<svg/, `<svg x="${state.position.x}" y="${state.position.y}" width="${width}"`)
                            // replace svg with viewbox
                            const params = encodeURI(JSON.stringify(Object.assign(
                                {
                                    x: state.position.x,
                                    y: state.position.y,
                                },
                                state.barcode
                            )))
                            const barcode_svg = barcode.replace(/<svg viewBox="0 0 (\d+) (\d+)"/, `<svg x="${state.position.x}" y="${state.position.y}" width="${width}" style="margin: 0; padding: 0;" `)

                            svg.push([
                                `<g type="barcode" params="${params}">`,
                                barcode_svg.split('\n').map(line => {
                                    line = line.trim()
                                    if (!line) return ''
                                    return '  ' + line
                                }).filter(Boolean).join('\n'),
                                '</g>'

                            ].join('\n'))
                        }
                        state.barcode.type = ''
                    } else {
                        const text = `<text x="${state.position.x}" y="${state.position.y}" font-size="${state.font.size}" font-family="${state.font.family}" font-style="${state.font.style}" font-weight="${state.font.weight}">${value}</text>`
                        if (state.inverted) {
                            // Add text to mask for inversion
                            inversionMasks.push(`<text x="${state.position.x}" y="${state.position.y}" font-size="${state.font.size}" font-family="${state.font.family}" font-style="${state.font.style}" font-weight="${state.font.weight}" fill="white">${value}</text>`)
                        } else {
                            svg.push(text)
                        }
                    }

                    break
                }


                case 'BY': { // Barcode Field Default Parameters
                    state.barcode.width = parseInt(args[0]) || state.barcode.width
                    // state.barcode.ratio = parseInt(args[1]) || state.barcode.ratio
                    state.barcode.barscale = parseInt(args[1]) || state.barcode.barscale
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
                    state.barcode.orientation = args[0] || state.barcode.orientation
                    state.barcode.height = parseInt(args[1]) || state.barcode.default_height
                    state.barcode.print_human_readable = args[2] ? args[2] === 'Y' : true
                    state.barcode.print_above = args[3] ? args[3] === 'Y' : false
                    state.barcode.check = args[4] ? args[4] === 'Y' : false
                    state.barcode.mode = args[5] || state.barcode.mode

                    break
                }


                case 'XZ': break // End of label

                default:
                    console.log(`Unknown command: ${command}`)
                    break
            }

            if (command !== 'FR') {
                state.inverted = false
            }
        }

        // If there are inversion masks, wrap them in an SVG mask
        if (inversionMasks.length > 0) {
            const maskId = `mask${Date.now()}`
            svg.push(`<defs><mask id="${maskId}" maskUnits="userSpaceOnUse">`)
            svg.push(`<rect x="0" y="0" width="100%" height="100%" fill="black"/>`)
            svg.push(inversionMasks.join('\n'))
            svg.push(`</mask></defs>`)

            // Apply the mask to the entire SVG group
            svg.push(`<g mask="url(#${maskId})">`)
            svg.push(...svg.splice(2, svg.length - 2)) // Wrap all non-background content
            svg.push(`</g>`)
        }
        svg.push(`</g>`)
        svg.push(`</svg>`)
        return svg.join('\n')
    }

    return zplToSvg

}));