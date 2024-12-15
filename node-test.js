const zplToSvg = require('./zpl2svg');

const zpl_test_sample = `^XA
^FO50,50
^GB100,100,100^FS
^FO50,200
^GB100,100,100^FS
^FO50,350
^GB100,100,100^FS
^CF0,32
^FO20,20^GB330,220,3^FS
^FO120,40^A0N,30,30^FDHello ZPL!^FS
^FO40,100^BY2^B3N,N,100,Y,N^FD1234567^FS
^XZ
`

const svg = zplToSvg(zpl_test_sample, { scale: 1, width: 1000, height: 1000 })

console.log(svg)