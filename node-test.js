// @ts-check
"use strict"

const zpl_test_sample = `
^XA
^FO 50,70 ^GB70,20,10^FS
^FO150,70 ^GB70,20,10^FS
^FO250,70 ^GB70,20,10^FS
^CF0,32 
^FO20,20^GB330,220,3^FS
^FO120,40^A0N,30,30^FDHello ZPL!^FS
^FO40,100^BY2^B3N,N,100,Y,N^FD1234567^FS
^XZ
`

const { zpl2svg, zpl2png } = require('./zpl2svg');


const main = async () => {

    const svg = await zpl2svg(zpl_test_sample, { scale: 1, width: 1000, height: 1000 })
    console.log('SVG output:', svg.substring(0, 128) + '...')

    const png = await zpl2png(zpl_test_sample, { scale: 1, width: 1000, height: 1000 })
    console.log('PNG output:', png.substring(0, 128) + '...')

}


main()