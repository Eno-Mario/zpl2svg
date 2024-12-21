## Vanilla JS implementation of a ZPL (Zebra Programming Language) to SVG converter.
#### It is a work in progress and is not yet complete.

#### You can try it out here: [ZPL to SVG Converter](https://jozo132.github.io/zpl2svg/)

![image](https://github.com/user-attachments/assets/9afb466b-622c-4284-80e3-9d5762c5a78c)

The goal is to be able to convert from ZPL to SVG and possibly vice verse. 
The conversion speed is decently fast with under 10ms from current testing. 
There are still a lot of bugs and missing features, but it is a start.

#### Dependencies: 
- [bwip-js](https://www.npmjs.com/package/bwip-js) for barcode rendering
- [canvas](https://www.npmjs.com/package/canvas) for graphic fields (only for Node.JS)

## Practical usage
#### Browser import:
```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bwip-js/4.5.1/bwip-js-min.js"></script>
<script src="path_to/zpl2svg.js"></script>
```
#### Node.JS import:
```js
const { zpl2svg } = require('path_to/zpl2svg.js')
```

#### Example:
```js
const zpl_content = `
  ^XA
  ^CF0,32
  ^FO20,20^GB330,220,3^FS
  ^FO120,40^A0N,30,30^FDHello ZPL!^FS
  ^FO40,100^BY2^B3N,N,100,Y,N^FD1234567^FS
  ^XZ
`
const svg_content = zpl2svg(zpl_content, {
  scale: 1,
  width: 370,
  height: 260
})
```
