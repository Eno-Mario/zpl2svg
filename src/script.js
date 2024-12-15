
// @ts-check
"use strict"


const zpl_test_sample = `^XA
^FX Demo VDA4902 Label Template
^FX A4 landscape border
^FO10,10^GB1200,792,3^FS

^FX VDA 4902 frame
^FX Horizontal Dividers
^FO10,110^GB1200,1,1^FS
^FO10,250^GB1200,1,1^FS
^FO600,180^GB610,1,1^FS
^FO10,400^GB1200,1,1^FS
^FO10,560^GB590,1,1^FS
^FO600,470^GB610,1,1^FS
^FO600,620^GB610,1,1^FS
^FO10,670^GB1200,1,1^FS

^FX Vertical Dividers
^FO600,10^GB1,240,1^FS
^FO800,180^GB1,70,1^FS
^FO1000,180^GB1,70,1^FS
^FO600,400^GB1,400,1^FS
^FO840,620^GB1,50,1^FS

^FX Set default font
^CF0,16

^FX Section 1: Receiver
^FO20,20^FD(1) Receiver^FS
^CF0,32
^FO20,45^FDXYZ Motors Inc.^FS
^FO20,80^FD1234 Industrial Drive, Detroit, 48201^FS

^FX Section 2: Dock-Gate
^CF0,16
^FO610,20^FD(2) Dock - Gate^FS
^CF0,38
^FO610,50^FDWH-SECTOR-B3^FS

^FX Section 3: Advice Note No
^CF0,16
^FO20,120^FD(3) Advice Note No (N)^FS
^CF0,40
^FO190,120^FD1122334455^FS
^FO30,160^BY2^B3N,N,80,N,N^FD1122334455^FS

^FX Section 4: Supplier Address
^CF0,16
^FO610,120^FD(4) Supplier Address^FS
^CF0,32
^FO610,150^FD5678 Supplier Lane, Cleveland, 44114^FS

^FX Section 5: Net weight
^CF0,16
^FO610,190^FD(5) Net weight^FS
^CF0,38
^FO610,210^FD24.8kg^FS

^FX Section 6: Gross weight
^CF0,16
^FO810,190^FD(6) Gross weight^FS
^CF0,38
^FO810,210^FD25.5kg^FS

^FX Section 7: No Boxes
^CF0,16
^FO1010,190^FD(7) No Boxes^FS
^CF0,38
^FO1010,210^FD 12^FS

^FX Section 8: Part No
^CF0,16
^FO20,260^FD(8) Part No (P)^FS
^CF0,48
^FO150,260^FD123456789012^FS
^FO30,300^BY2^B3N,N,90,N,N^FD123456789012^FS

^FX Section 9: Quantity
^CF0,16
^FO20,410^FD(9) Quantity (Q)^FS
^CF0,48
^FO140,410^FD 500^FS
^FO30,460^BY2^B3N,N,90,N,N^FD500^FS

^FX Section 10: Description
^CF0,16
^FO610,410^FD(10) Description^FS
^CF0,38
^FO610,430^FDBrake Pad Assembly^FS

^FX Section 11: Supplier Part No
^CF0,16
^FO610,480^FD(11) Supplier Part No (30S)^FS
^CF0,38
^FO610,500^FDCP-45678-BRK^FS
^FO620,540^BY2^B3N,N,70,N,N^FDCP-45678-BRK^FS

^FX Section 12: Supplier
^CF0,16
^FO20,570^FD(12) Supplier (V)^FS
^CF0,48
^FO150,570^FD987654321^FS
^FO30,610^BY2^B3N,N,50,N,N^FD987654321^FS

^FX Section 13: Date
^CF0,16
^FO610,630^FD(13) Date^FS
^CF0,28
^FO690,640^FD D 241215^FS

^FX Section 14: Eng. Change
^CF0,16
^FO850,630^FD(14) Eng. Change^FS
^CF0,28
^FO990,640^FD B33-827 A^FS

^FX Section 15: Serial No
^CF0,16
^FO20,680^FD(15) Serial No (S)^FS
^CF0,48
^FO160,680^FD 852934^FS
^FO30,720^BY2^B3N,N,70,N,N^FD852934^FS

^FX Section 16: Batch No
^CF0,16
^FO610,680^FD(16) Batch No (F)^FS
^CF0,32
^FO760,680^FDA12345B67890^FS
^FO620,710^BY2^B3N,N,80,N,N^FDA12345B67890^FS

^FX Section 17: Sender
^CF0,16
^FO20,810^FDABC Automotive Parts Co.^FS
^FO610,810^FDVDA4902 Label^FS

^FX Last Section: Timestamp
^CF0,16
^FO1050,810^FD2024-12-15 09:23:56^FS

^FX Author: J.Vovk <jozo132@gmail.com>
^XZ
`


const code_element = document.getElementById("code")
const output_element = document.getElementById("raw")
const render_element = document.getElementById("svg")
const button_svg = document.getElementById("svg-tab")
const button_raw = document.getElementById("raw-tab")
const div_svg = document.getElementById("svg-div")
const div_raw = document.getElementById("raw-div")
if (!code_element || !output_element || !render_element || !button_svg || !button_raw || !div_svg || !div_raw) {
    throw new Error("Missing element")
}

code_element.innerHTML = zpl_test_sample

let timeout = null
let refresh_count = 0
const update_svg = () => {
    refresh_count++
    clearTimeout(timeout)
    timeout = setTimeout(() => { // @ts-ignore
        const zpl = code_element.value
        const t = +new Date()
        const { width, height } = render_element.getBoundingClientRect()
        // @ts-ignore
        const svg_output = zplToSvg(zpl, { scale: 0.8, width, height })
        const render_time = +new Date() - t
        console.log("Render time:", render_time, "ms")
        output_element.innerHTML = svg_output
        render_element.innerHTML = svg_output
    }, refresh_count == 1 ? 0 : 100)
}

setTimeout(update_svg, 100)


code_element.addEventListener("input", update_svg)

button_svg.addEventListener("click", (e) => {
    e?.preventDefault()
    div_svg.classList.remove("hidden")
    div_raw.classList.add("hidden")
    button_svg.classList.add("active")
    button_raw.classList.remove("active")
})

button_raw.addEventListener("click", (e) => {
    e?.preventDefault()
    div_svg.classList.add("hidden")
    div_raw.classList.remove("hidden")
    button_svg.classList.remove("active")
    button_raw.classList.add("active")
})