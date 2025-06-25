## Vanilla JS implementation of a stand-alone ZPL (Zebra Programming Language) to SVG converter.

#### It is a work in progress and is not yet complete.

#### You can try it out here: [ZPL to SVG Converter](https://jozo132.github.io/zpl2svg/)

![image](https://github.com/user-attachments/assets/33841a00-f7b7-4deb-ac3d-811db46edce3)

The goal is to be able to convert from ZPL to SVG and possibly vice verse.
The conversion speed is decently fast with under 10ms from current testing.
There are still a lot of bugs and missing features.

#### Dependencies:

- [bwip-js](https://www.npmjs.com/package/bwip-js) for barcode rendering
- [pako](https://github.com/nodeca/pako) for Z64 graphic encoding
- [canvas](https://www.npmjs.com/package/canvas) for graphic fields (only for Node.JS)

## Practical usage

#### Node.JS first install:

```sh
npm i bwip-js pako canvas
```

#### Browser import:

```html
<script
  type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/bwip-js/4.5.1/bwip-js-min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"></script>
<script src="path_to/zpl2svg.js"></script>
```

#### Node.JS import:

```js
const { zpl2svg } = require("path_to/zpl2svg.js");
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
`;
const svg_content = zpl2svg(zpl_content, {
  scale: 1,
  width: 370,
  height: 260,
});
```

##### Supported ZPL command list:

- ^XA `Start of label`
- ^PR `Print rate (skipped)`
- ^FX `Comment`
- ^FS `End of field`
- ^CF `Font selection`
- ^FO/^F0 `Field origin`
- ^GB `Graphic box`
- ^GD `Graphic diagonal line`
- ^GC `Graphic circle`
- ^GE `Graphic ellipse`
- ^FR `Field reverse point`
- ^FD `Field data`
- ^BY `Barcode field default parameters`
- ^B0/^BO `Aztec code (partially implemented)`
- ^B1 `Code 11`
- ^B2 `Interleaved 2 of 5`
- ^B3 `Code 39`
- ^B4 `Code 49`
- ^B5 `Planet code`
- ^B7 `PDF417`
- ^B8 `EAN8`
- ^B9 `UPCE`
- ^BA `Code 93`
- ^BB `Coda block`
- ^BC `Code 128`
- ^BQ `QR Code`
- ^GF `Graphic field`
- ^XZ `End of label`

##### QR Code Support (^BQ):

The converter now supports QR codes using the `^BQ` command with the following parameters:

- Format: `^BQo,h,m,e,s`
- Parameters:
  - `o`: Orientation (N, R, I, B)
  - `h`: Model (1 or 2 - QR Code Model 1 or 2)
  - `m`: Magnification (1-10)
  - `e`: Error correction (L, M, Q, H)
  - `s`: Mask (0-7)

Example:

```zpl
^XA
^FO50,50^BQN,2,10,L,7^FD123456789^FS
^XZ
```
