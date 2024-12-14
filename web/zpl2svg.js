// @ts-check
"use strict"

// This is a very simple ZPL to SVG converter written in pure JavaScript.
// It is based on the Zebra Programming Language


const zpl_sample = `
^XA

^FX Top section with logo, name and address.
^CF0,60
^FO50,50^GB100,100,100^FS
^FO75,75^FR^GB100,100,100^FS
^FO93,93^GB40,40,40^FS
^FO220,50^FDIntershipping, Inc.^FS
^CF0,30
^FO220,115^FD1000 Shipping Lane^FS
^FO220,155^FDShelbyville TN 38102^FS
^FO220,195^FDUnited States (USA)^FS
^FO50,250^GB700,3,3^FS

^FX Second section with recipient address and permit information.
^CFA,30
^FO50,300^FDJohn Doe^FS
^FO50,340^FD100 Main Street^FS
^FO50,380^FDSpringfield TN 39021^FS
^FO50,420^FDUnited States (USA)^FS
^CFA,15
^FO600,300^GB150,150,3^FS
^FO638,340^FDPermit^FS
^FO638,390^FD123456^FS
^FO50,500^GB700,3,3^FS

^FX Third section with bar code.
^BY5,2,270
^FO100,550^BC^FD12345678^FS

^FX Fourth section (the two boxes on the bottom).
^FO50,900^GB700,250,3^FS
^FO400,900^GB3,250,3^FS
^CF0,40
^FO100,960^FDCtr. X34B-1^FS
^FO100,1010^FDREF1 F00B47^FS
^FO100,1060^FDREF2 BL4H8^FS
^CF0,190
^FO470,955^FDCA^FS

^XZ
`

/*
Format ^CFf,h,w
Description Set the default font for the ^FD command.
Parameters
    f = font
    h = height
    w = width
Default f = A, h = 10, w = 10

f = specified default font
Accepted Values: A through Z and 0 to 9
Initial Value at power-up: A

h = specified default character height
Accepted Values: 1 to 32000
Initial Value at power-up: 9

w = specified default character width
Accepted Values: 1 to 32000
Initial Value at power-up: 5



Table 17 • Intercharacter Gap and Baseline Parameters
Font H x W (in dots) Type Intercharacter Gap
*/


const code39_lut = {
    '0': '101001101101',
    '1': '110100101011',
    '2': '101100101011',
    '3': '110110010101',
    '4': '101001101011',
    '5': '110100110101',
    '6': '101100110101',
    '7': '101001011011',
    '8': '110100101101',
    '9': '101100101101',
    'A': '110101001011',
    'B': '101101001011',
    'C': '110110100101',
    'D': '101011001011',
    'E': '110101100101',
    'F': '101101100101',
    'G': '101010011011',
    'H': '110101001101',
    'I': '101101001101',
    'J': '101011001101',
    'K': '110101010011',
    'L': '101101010011',
    'M': '110110101001',
    'N': '101011010011',
    'O': '110101101001',
    'P': '101101101001',
    'Q': '101010110011',
    'R': '110101011001',
    'S': '101101011001',
    'T': '101011011001',
    'U': '110010101011',
    'V': '100110101011',
    'W': '110011010101',
    'X': '100101101011',
    'Y': '110010110101',
    'Z': '100110110101',
    '-': '100101011011',
    '.': '110010101101',
    ' ': '100110101101',
    '$': '100100100101',
    '/': '100100101001',
    '+': '100101001001',
    '%': '101001001001',
}
const code39_lut_length = Object.keys(code39_lut).length

const code128_lut = {
    ' ': '11010000100',
    '!': '11010010000',
    '"': '11010000100',
    '#': '11010010000',
    '$': '11010000100',
    '%': '11010010000',
    '&': '11010000100',
    '\'': '11010010000',
    '(': '11010000100',
    ')': '11010010000',
    '*': '11010000100',
    '+': '11010010000',
    ',': '11010000100',
    '-': '11010010000',
    '.': '11010000100',
    '/': '11010010000',
    '0': '11000111000',
    '1': '11000110100',
    '2': '11000110010',
    '3': '11000110001',
    '4': '11000101100',
    '5': '11000101010',
    '6': '11000101001',
    '7': '11000100110',
    '8': '11000100101',
    '9': '11000100011',
    ':': '11000011100',
    ';': '11000011010',
    '<': '11000011001',
    '=': '11000010110',
    '>': '11000010101',
    '?': '11000010011',
    '@': '11001000000',
    'A': '11000001100',
    'B': '11000001010',
    'C': '11000001001',
    'D': '11000000110',
    'E': '11000000101',
    'F': '11000000011',
    'G': '10110011100',
    'H': '10110011010',
    'I': '10110011001',
    'J': '10110010110',
    'K': '10110010101',
    'L': '10110010011',
    'M': '10110001110',
    'N': '10110001101',
    'O': '10110001011',
    'P': '10101111000',
    'Q': '10101110100',
    'R': '10101110010',
    'S': '10101110001',
    'T': '10101101100',
    'U': '10101101010',
    'V': '10101101001',
    'W': '10101100110',
    'X': '10101100101',
    'Y': '10101100011',
    'Z': '10110111000',
    '[': '10110110100',
    '\\': '10110110010',
    ']': '10110110001',
    '^': '10110101100',
    '_': '10110101010',
    '`': '10110101001',
    'a': '10110100110',
    'b': '10110100101',
    'c': '10110100011',
    'd': '11011011000',
    'e': '11011010100',
    'f': '11011010010',
    'g': '11011010001',
    'h': '11011001100',
    'i': '11011001010',
    'j': '11011001001',
    'k': '11001011010',
    'l': '11001011001',
    'm': '11001101010',
    'n': '11001101001',
    'o': '11011000110',
    'p': '11011000101',
    'q': '11001010110',
    'r': '11001010101',
    's': '11010110100',
    't': '11010110010',
    'u': '11010011010',
    'v': '11000110110',
    'w': '10111011000',
    'x': '10111010100',
    'y': '10111010010',
    'z': '10111010001',
    '{': '10111001100',
    '|': '10111001010',
    '}': '10111001001',
    '~': '10111000101',
}

const code128_lut_length = Object.keys(code128_lut).length

const barcode_code39 = (input, use_check) => { // generate sequence of 1 and 0 for each bit in the barcode
    let check = 0
    const sequence = input.split('').map(char => {
        const c = code39_lut[char] || code39_lut[' ']
        check += c.split('').reduce((acc, bit, index) => {
            return acc + (parseInt(bit) * (index % 2 === 0 ? 1 : 2))
        }, 0)
        return c
    })
    // add check digit
    if (use_check && false) {
        check = check % code39_lut_length
        const check_digit = Object.keys(code39_lut).find(key => code39_lut[key] === check)
        sequence.push(code39_lut[check_digit])
    }
    return sequence
}

const barcode_code128 = (input, use_check) => {
    let check = 0
    console.log(input)
    const sequence = input.split('').map(char => {
        const c = code128_lut[char] || code128_lut[' ']
        check += c.split('').reduce((acc, bit, index) => {
            return acc + (parseInt(bit) * (index % 2 === 0 ? 1 : 2))
        }, 0)
        return c
    })
    // add check digit
    if (use_check && false) {
        check = check % code128_lut_length
        const check_digit = Object.keys(code128_lut).find(key => code128_lut[key] === check)
        sequence.push(code128_lut[check_digit])
    }
    return sequence
}

const CODE128 = 'BC'
const CODE39 = 'B3'

const generte_barcode = (options) => {
    const { type, data, args, x, y, alignment, bar_width, scale, height, ratio, human_readable, rotation, use_check, show_text } = options

    let sequence
    switch (type) {
        case CODE39: sequence = barcode_code39(data, use_check); break
        case CODE128: sequence = barcode_code128(data, use_check); break
        default: throw new Error(`Unknown barcode type: ${type}`)
    }

    console.log(sequence)

    const bits_in_char = 12
    const width = sequence.length * bits_in_char * bar_width
    const x0 = x - (alignment === 'center' ? -width / 2 : alignment === 'right' ? -width : 0)
    const y0 = y

    // let barcode = sequence.map((char, index) => {
    //     const bits = char.split('')
    //     const xc = x0 + index * bits_in_char * bar_width
    //     const y = y0
    //     // draw bars for each bit
    //     return bits.map((bit, index) => {
    //         const b = +bit
    //         const width = b ? bar_width : bar_width
    //         const x = xc + index * width
    //         const y = y0
    //         if (b) return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${b ? 'black' : 'white'}"/>`
    //         else return ''
    //     }).filter(Boolean).join('\n')
    // }).join('\n')
    /** @type {{ bit: number, width: number, x: number }[]} */
    const optimized = []
    let state = { bit: 0, x: 0, width: 0 }
    for (let i = 0; i < sequence.length; i++) {
        const char = sequence[i]
        const bits = char.split('')
        for (let j = 0; j < bits.length; j++) {
            const bit = +bits[j]
            if (bit === state.bit) {
                state.width += 1
            } else {
                if (state.bit) optimized.push({ bit: state.bit, width: state.width, x: state.x })
                state = { bit, x: i * bits_in_char + j, width: 1 }
            }
        }
    }
    if (state.bit) optimized.push(state)
    const output = ['<g name="barcode">']
    for (let i = 0; i < optimized.length; i++) {
        const { bit, width } = optimized[i]
        const x = x0 + optimized[i].x * bar_width
        const y = y0
        output.push(`<rect x="${x}" y="${y}" width="${width * bar_width}" height="${height}" fill="${bit ? 'black' : 'white'}"/>`)

    }
    if (show_text) { // Show human readable text at the bottom center
        const text = `<text x="${x0 + width / 2}" y="${y0 + height + 3}" font-size="${height * 0.4 * scale}" font-family="Arial" font-style="normal" font-weight="normal" style="text-anchor: middle;">${data}</text>`
        output.push(text)
    }

    output.push('</g>')
    return output.join('\n')
}


/** @type { (input: string[], configuration: { family: string, size: number, style: string, weight: string }, scale?: number) => void } */
const parseFont = (input, configuration, scale = 1) => {
    const [font, height, width] = input
    /*
        font family mapping
        A: OCR-A 9x5
        B: OCR-A 11x7
        C: OCR-A 18x10
        D: OCR-A 18x10
        E: OCR-B 28x15
        F: OCR-B 26x13
        G: OCR-B 60x40
        H: OCR-A 21x13
        GS: SYMBOL PROPORTIONAL
        0: DEFAULT PROPORTIONAL
        P: Helvetica 20x18
        Q: Helvetica 28x24
        R: Helvetica 35x31
        S: Helvetica 40x35
        T: Helvetica 48x42
        U: Helvetica 59x53
        V: Helvetica 80x71
 
    */
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
        case '0': configuration.family = "Helvetica"; configuration.size = (+height * 0.5 * (scale || 1)) || configuration.size; break
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
export const zplToSvg = (zpl) => {
    const lines = zpl.split("\n").map(line => line.trim()).filter(line => line.length > 0).join('').split('^').map(line => line.trim()).filter(line => line.length > 0)
    const svg = []
    const scale = 0.5
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
            height: 10, // in dots
        }
    }

    // Add white background
    svg.push(`<svg width="100%" height="700px" xmlns="http://www.w3.org/2000/svg">`)
    svg.push(`<rect x="0" y="0" width="100%" height="100%" fill="white"/>`)

    // Track inversion regions
    let inversionMasks = []

    for (let i = 0; i < lines.length; i++) {
        const id = `s${svg.length}`

        let line = lines[i]
        const command = line.substring(0, 2).toUpperCase()
        line = line.substring(2)
        console.log(`Command: ${command} with line: ${line}`)
        const args = line.split(',').map(arg => arg.trim())

        switch (command) {
            case 'XA': break

            case 'FX': svg.push(`<!-- ${args.join(' ')} -->`); break

            case 'FS': break

            case 'CF': parseFont(args, state.font, scale); break

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
                const value = args.join(' ')
                if (state.barcode.type) {
                    const barcode = generte_barcode({
                        type: state.barcode.type,
                        data: value,
                        args,
                        x: state.position.x,
                        y: state.position.y,
                        alignment: state.alignment,
                        scale,
                        bar_width: state.barcode.width,
                        height: state.barcode.height,
                        ratio: state.barcode.ratio,
                        human_readable: false,
                        rotation: 0,
                        use_check: true,
                        show_text: true
                    })
                    svg.push(barcode)
                    state.barcode.type = ''
                } else {
                    const text = `<text x="${state.position.x}" y="${state.position.y}" font-size="${state.font.size * scale}mm" font-family="${state.font.family}" font-style="${state.font.style}" font-weight="${state.font.weight}">${value}</text>`
                    if (state.inverted) {
                        // Add text to mask for inversion
                        inversionMasks.push(`<text x="${state.position.x}" y="${state.position.y}" font-size="${state.font.size * scale}mm" font-family="${state.font.family}" font-style="${state.font.style}" font-weight="${state.font.weight}" fill="white">${value}</text>`)
                    } else {
                        svg.push(text)
                    }
                }

                break
            }

            // Barcode settings
            case 'BY': {
                state.barcode.width = parseInt(args[0]) * scale
                state.barcode.ratio = parseInt(args[1])
                state.barcode.height = parseInt(args[2]) * scale
                break
            }

            // Barcode 128
            case 'BC': {
                state.barcode.type = command
                break
            }

            // Barcode 39
            case 'B3': {
                state.barcode.type = command
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