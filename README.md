## Vanilla JS implementation of a ZPL (Zebra Programming Language) to SVG converter.
#### It is a work in progress and is not yet complete.

![image](https://github.com/user-attachments/assets/9afb466b-622c-4284-80e3-9d5762c5a78c)

The goal is to be able to convert from ZPL to SVG and possibly vice verse. 
The conversion speed is decently fast with under 10ms from current testing. 
There are still a lot of bugs and missing features, but it is a start.

#### Requirements: bwip-js

#### To try out the demo you can run the following command to host a local instance:
```bash
npx serve .
```
## Practical usage
#### Browser import:
```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bwip-js/4.5.1/bwip-js-min.js"></script>
<script src="path_to/zpl2svg.js"></script>
```
#### Node.JS import not yet finished. It's missing bwip-js import and the main function export. This is on my TODO list.

#### General usage:
```js
const zpl_content = `
  ^XA
  ^CF0,32
  ^FO20,20^GB330,220,3^FS
  ^FO120,40^A0N,30,30^FDHello ZPL!^FS
  ^FO40,100^BY2^B3N,N,100,Y,N^FD1234567^FS
  ^XZ
`
const svg_content = zplToSvg(zpl_content, {
  scale: 1,
  width: 370,
  height: 260
})
```
