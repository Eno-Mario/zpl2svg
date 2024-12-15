
/* This is a very simple ZPL to SVG converter written in pure JavaScript. */

"use strict";
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.zplToSvg = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {


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

    /** @type { (zpl: string, options?: { width?: number, height?: number, scale?: number }) => string } */
    const zplToSvg = (zpl, options) => {
        options = options || {}
        const lines = zpl.split("\n").map(line => line.split('//')[0].trim()).filter(line => line.length > 0).join('').split('^').map(line => line.trim()).filter(line => line.length > 0)
        const svg = []
        const scale = options.scale || 1
        const width = options.width || 1200
        const height = options.height || 800
        const state = {
            font: {
                family: "Arial",
                size: 10,
                style: "normal",
                weight: "normal"
            },
            position: {
                x: 0,
                y: 0
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
        svg.push(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="dominant-baseline: hanging;">`)
        svg.push(`<rect x="0" y="0" width="100%" height="100%" fill="white"/>`)

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
                case 'XA': break

                case 'FX': svg.push(`<!-- ${args.join(',')} -->`); break

                case 'FS': break

                case 'CF': parseFont(args, state.font); break

                case 'FO':
                    state.position.x = parseInt(args[0]) * scale;
                    state.position.y = parseInt(args[1]) * scale;
                    break

                case 'GB': {
                    const width = parseInt(args[0]) * scale
                    const height = parseInt(args[1]) * scale
                    const inset = parseInt(args[2]) * scale
                    // Draw shape with inset except when inset > width/2 or height/2 then just draw a rectangle with fill

                    const full = width / 2 <= inset || height / 2 <= inset

                    // Outline
                    const x = state.position.x
                    const y = state.position.y
                    const fill = state.fill
                    const stroke = state.stroke

                    let rect
                    if (full) {
                        rect = `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`
                    } else {
                        // Draw 4 rectangles (top, right, bottom, left)
                        const top = `<rect x="${x}" y="${y}" width="${width}" height="${inset}" fill="${fill}"/>`
                        const right = `<rect x="${x + width - inset}" y="${y}" width="${inset}" height="${height}"/>`
                        const bottom = `<rect x="${x}" y="${y + height - inset}" width="${width}" height="${inset}"/>`
                        const left = `<rect x="${x}" y="${y}" width="${inset}" height="${height}"/>`
                        rect = [top, right, bottom, left].join('\n')
                    }


                    svg.push(rect)

                    break
                }

                case 'FR':
                    state.inverted = true;
                    break

                case 'FD': {
                    const value = args.join(',')
                    if (state.barcode.type) {
                        let bcid = ''
                        let scale_multiplier = state.barcode.barscale
                        let alttext = ''
                        switch (state.barcode.type) {
                            // case 'BC': bcid = 'code128'; break // Can't get this to work
                            case 'BC': bcid = 'hibccode128'; scale_multiplier *= 1; alttext = value; break // I don't know why but this works
                            case 'B3': bcid = 'code39'; break
                            default: break
                        }
                        if (!bcid) {
                            console.log(`Unknown barcode type: ${state.barcode.type}`)
                            break
                        }

                        const SCALE = scale * scale_multiplier

                        // bwip-js is imported in index.html
                        // bwip-js.d.ts exists in the same folder as this file
                        const barcode_options = {
                            bcid,
                            text: value,
                            height: state.barcode.height * SCALE / (6 * SCALE) / scale_multiplier,
                            paddingtop: 0,
                            paddingbottom: 0,
                            includetext: state.barcode.print_human_readable,
                            textxalign: 'center',
                            textcolor: '#000',
                            scale: 2 * SCALE,
                        }
                        if (alttext && state.barcode.print_human_readable) barcode_options.alttext = alttext

                        // @ts-ignore
                        const barcode = bwipjs.toSVG(barcode_options)

                        // <svg viewBox="0 0 WIDTH HEIGHT" ...
                        // Extract the width and height from the viewBox attribute
                        const viewBox = barcode.match(/viewBox="0 0 (\d+) (\d+)"/)
                        if (viewBox) {
                            const [, width, height] = viewBox
                            // const barcode_svg = barcode.replace(/<svg/, `<svg x="${state.position.x}" y="${state.position.y}" width="${width}"`)
                            // replace svg with viewbox
                            const params = encodeURI(JSON.stringify(state.barcode))
                            const barcode_svg = barcode.replace(/<svg viewBox="0 0 (\d+) (\d+)"/, `<svg type="${bcid}" text="${value}" x="${state.position.x}" y="${state.position.y}" width="${width}" params="${params}" style="margin: 0; padding: 0 `)
                            svg.push(barcode_svg)
                        }
                        state.barcode.type = ''
                    } else {
                        const text = `<text x="${state.position.x}" y="${state.position.y}" font-size="${state.font.size * scale}" font-family="${state.font.family}" font-style="${state.font.style}" font-weight="${state.font.weight}">${value}</text>`
                        if (state.inverted) {
                            // Add text to mask for inversion
                            inversionMasks.push(`<text x="${state.position.x}" y="${state.position.y}" font-size="${state.font.size * scale}" font-family="${state.font.family}" font-style="${state.font.style}" font-weight="${state.font.weight}" fill="white">${value}</text>`)
                        } else {
                            svg.push(text)
                        }
                    }

                    break
                }

                // Barcode settings
                case 'BY': {
                    state.barcode.width = parseInt(args[0]) || state.barcode.width
                    // state.barcode.ratio = parseInt(args[1]) || state.barcode.ratio
                    state.barcode.barscale = parseInt(args[1]) || state.barcode.barscale
                    state.barcode.default_height = parseInt(args[2]) || state.barcode.default_height
                    break
                }

                // Barcode 39
                case 'B3': { // Example: '^B3N,N,80,N,N^FD2581752^FS'
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

                // Barcode 128
                case 'BC': { // Example: '^BCN,80,Y,N,N^FD>:1234567^FS'
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


                case 'XZ': break

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

        svg.push(`</svg>`)
        return svg.join('\n')
    }

    return zplToSvg

}));