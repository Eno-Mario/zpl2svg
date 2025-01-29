
// @ts-check
"use strict"


const zpl_test_sample = `^XA

^FX Demo VDA4902 Label Template

^FX A5 landscape border
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


^FX Draw custom graphic field
^FO850,250^GFA,4096,4096,32,,:::::::::::::hY03E,hY0FF8,hX01FFC,hX03FFE,hX07FFE,hX07IF,hX0JF,hX0JF8,::::L01FChO0JF8,L0IFEhN0JF8,K01JF8hM0JF8,K01JFCJ018R01CgM0JF8,K01KFJ07EJ03CL07FI01EgH0JF8,K01KFCI0FEJ07EL07F800FF803IFCU0JF8,K03KFEI0FFJ0FFL0FFC03FF80KFU0JF8,K07LF800FFI01FFL0FFC0IFC3KF8Q0F00JF,J01MFC01FFI01FFL07FE1IFC7KFCP03F80JF,J03MFE01FFI03FFL07FF7IFCLFC18N03F80JF,J07IF03FFE01FFI03FEL03LF9LFC7EI01FI07FC0JF,J0IFE00IF01FEI03FEL01LF1LFCFFI03F8007FC0IFE,I01IF8007FF83FEI07FCM0KFC3LF9FFI07F800FF80IFE,I03FFEI01FFC3FEI07FCM0JFE07FF801E1FFI07FC00FF80IFE,I07FF8J0FFC7FCI07FCM07IF80FFEJ03FFI07F800FF80IFE,I07FFK07FE7FCI07F8M07FFE01JF8007FFI07F800FF00IFC,I0FFEK03FE7FCI0FF8M0IFC03JFC007FFI07F800FF00IFC,001FFCK03FEFF8I0FF8L01IF003JFC00IFI0FF801FF00IFC,001FF8K01FEFF8I0FF8L03FFE007JFE01IFI0FF801FF00IFC,003FFL01FEFFC001FFM07FFC00KFE01IFI0FF801FF007FFC,003FEL01PFM07FF001KFC03IFI0FF801FF007FF8,007FEL01PFM0FFE003KFC07IFI0FF001FF007FF8,007FCL01PFL01FFC003FF7FF807IFI0FF001FF007FF8,007FCL01OFEL01FF8007FE3F800JF800FF001FF007FF,007F8L03OFEL03FFI0FFE0CI0KFC0FF001FF007FE,00FF8L03OFEL07FE001FFCJ01LF1MF007FC,00FF8L07OFCL07FE003FF8J03LF1MF003F8,00FF8L07OFCL0FFC003FFK03LF9MF003F8,00FFM07IFCI07FCK01FF8007FEK07LF9MF001F,00FFM0JF8I07F8K01FF800FFEK07LF9MFI04,00FFM0JF8I07F8K03FFI0FFCK0MF1MF,00FFL01JF8I07F8K03FEI0FF8J01LFE1MF,00FFL03JF8I0FF8K07FE001LF81IF7FC01MF,00FFL07JFJ0FF8K07FC001LF83FF87FC03FF001FF,00FF8K0KFJ0FF8K07FC001LFC7FE07FC03FEI0FF,00FF8J01FFEFFJ0FFL0FF8001LFC7FE07FC03FEI0FF003C,00FFEJ07FFDFFJ0FFL0FF8001LFCFFC07FC03FEI0FF00FF,007OF9FFJ0FFL0FF8001LF8FF803FC03FCI0FF01FF8,007OF1FFJ0FFL0FFJ0LF8FF803FE03FCI0FF03FFC,003NFE1FEJ0FFL07FJ07JFE0FF003FE03FCI0FF03FFE,001NFC1FEJ0FFL03EQ0FF001FE03FCI0FF07IF,001NF81FEJ0FFY07E001FC03FCI0FF07IF,I0MFE00FEJ0FEY038001FC03FCI0FF07IF8,I03LFC00FCJ07CgJ07803FCI0FF07IF8,J0LFI01K01gN03FCI07F07IF8,J03JFgY03FCI03E07IF8,hN01F8L03IF,hO0FM03FFE,hW01FFC,gQ0FgL07F8,gP01FF,gP03FFC,gH03FEK03IF,gG01IFK03IF8,gG07IFJ07BIFE,gG0JF8I0LF,g01JFC001LFC,g01JFE003FE3IFE,g01JFE003FE07IF8,g01JFE007FE01IFC,g01JFC007FC007IF,g01JFC007FC003IF8,gG0JF8007F8I0IFC,gG0JFI0FF8I07FFE,gG03FF8I0FF8I01IF8,gN0FF8J0IF8,gN0FF8J03FFC,gN0FFK01FFE,gN0FFL0FFE,gN0FFL07FF,gN0FFL01FF,gM01FFL01FF,gG01EJ01FFM0FF,gG07F8I01FFL01FF,gG0FFCI01FEL0IF,g01FFEI01FEJ0KF,g03IFI01FE007KFE,g07IF8003PFE,g07IF8003PFC,g07IFC003PF8,g0JFC003OFE,g0JFC003OF8,g0JFC001NFC,g0JFC001MF,g07IFCI0KF,g07IF8,g03IF,g01FFE,gG07F,,::::::::::::^FS

^XZ
`


const code_text_element = document.getElementById("code_text")
const svg_text_element = document.getElementById("svg_text")
const render_element = document.getElementById("svg")
const button_svg = document.getElementById("svg-tab")
const button_raw = document.getElementById("raw-tab")
const div_svg = document.getElementById("svg-div")
const div_raw = document.getElementById("raw-div")
const span_conversion_time = document.getElementById("conversion_time")
const download_zpl = document.getElementById("download-zpl")
const download_svg = document.getElementById("download-svg")
const download_png = document.getElementById("download-png")
const zoom_value = document.getElementById('zoom_value')
const x_value = document.getElementById('x_value')
const y_value = document.getElementById('y_value')
const touch_value = document.getElementById('touch_value')
if (!touch_value) throw new Error("Missing touch_value element")
if (!code_text_element || !svg_text_element || !render_element || !button_svg || !button_raw || !div_svg || !div_raw || !span_conversion_time || !download_zpl || !download_svg || !download_png || !zoom_value || !x_value || !y_value) {
    throw new Error("Missing element")
}


/** @type {{ svg_content: string, element: Element | null, viewBox: { x: number, y: number, width: number, height: number }, viewBoxBase?: { x: number, y: number, width: number, height: number }, scale: number, x_offset: number, y_offset: number }} */
const state = {
    svg_content: '',
    viewBox: { x: 0, y: 0, width: 1000, height: 1000 },
    element: null,
    scale: 1,
    x_offset: 0,
    y_offset: 0,
}

// Get mouse position
const mouse_pos = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
}


// Add pan functionality
let isDragging = false
let start = { x: 0, y: 0 }

const update_mouse_pos = (e) => {
    const { left, top, width, height } = render_element.getBoundingClientRect()
    // svg position - mouse position
    if (e) {
        mouse_pos.x = e.clientX - left
        mouse_pos.y = e.clientY - top
        mouse_pos.width = width
        mouse_pos.height = height
    }

    const x = map(mouse_pos.x, 0, mouse_pos.width, state.viewBox.x, state.viewBox.x + state.viewBox.width)
    const y = map(mouse_pos.y, 0, mouse_pos.height, state.viewBox.y, state.viewBox.y + state.viewBox.height)

    if (isDragging && e && e.clientX && e.clientY) {
        const dx = (e.clientX - start.x) * 1.8
        const dy = (e.clientY - start.y) * 1.8
        start = { x: e.clientX, y: e.clientY } // Update start position for next move
        state.viewBox.x -= dx / state.scale
        state.viewBox.y -= dy / state.scale
        update_zoom_pan()
    }

    x_value.innerHTML = x.toFixed(0)
    y_value.innerHTML = y.toFixed(0)
}

const touch_points = { valid: 0, x1: 0, y1: 0, x2: 0, y2: 0 }
let touch_spread = 0

render_element.addEventListener("mousemove", update_mouse_pos)
render_element.addEventListener("touchmove", (e) => {
    e.preventDefault()
    const touch = JSON.stringify([...e.touches].map(t => ({ x: t.clientX.toFixed(1), y: t.clientY.toFixed(1) })))
    // touch_value.innerHTML = touch
    if (e.touches.length == 1) {
        update_mouse_pos(e.touches[0])
        touch_points.valid = 0
    } else if (e.touches.length == 2) {
        isDragging = false
        touch_points.valid++
        if (touch_points.valid == 1) {
            touch_points.x1 = e.touches[0].clientX
            touch_points.y1 = e.touches[0].clientY
            touch_points.x2 = e.touches[1].clientX
            touch_points.y2 = e.touches[1].clientY
        } else {
            const { x1, y1, x2, y2 } = touch_points
            const TA1 = { x: x1, y: y1 }
            const TA2 = { x: x2, y: y2 }
            const TB1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
            const TB2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

            const distA = Math.hypot(TA1.x - TA2.x, TA1.y - TA2.y)
            const distB = Math.hypot(TB1.x - TB2.x, TB1.y - TB2.y)
            const spread = distB - distA
            if (touch_points.valid == 2) touch_spread = spread

            const delta = (spread - touch_spread) * 0.05
            touch_spread = spread

            if (Math.abs(delta) > 5) return;
            zoom_into_point(-1, -1, delta)

            update_zoom_pan()
            zoom_value.innerHTML = state.scale.toFixed(1)
            update_mouse_pos()
        }
    } else {
        isDragging = false
        touch_points.valid = 0
    }
})

const map = (value, in_min, in_max, out_min, out_max) => (value - in_min) * (out_max - out_min) / ((in_max - in_min) || 1) + out_min

// x: 0 to 100 in percentage relative to the width of the element
// y: 0 to 100 in percentage relative to the height of the element
/** @type { (x: number, y: number, delta: number) => void } */
const zoom_into_point = (x, y, delta) => {

    const offset_limit = 1000000
    const max_scale = 20
    const min_scale = 0.05

    if (x == -1 && y == -1) {
        x = 50
        y = 50
    }

    // console.log("Zooming in", x, y, delta)
    const new_scale = state.scale + state.scale * delta * 0.1
    const scale = Math.max(min_scale, Math.min(max_scale, new_scale));
    state.scale = scale

    const max_width = (state?.viewBoxBase?.width || 0) * max_scale
    const max_height = (state?.viewBoxBase?.height || 0) * max_scale
    const min_width = (state?.viewBoxBase?.width || 0) * min_scale
    const min_height = (state?.viewBoxBase?.height || 0) * min_scale

    const actual = state.viewBox
    const original = state.viewBoxBase

    // New viewBox dimensions
    const newWidth = (original?.width || actual.width) / scale
    const newHeight = (original?.height || actual.height) / scale
    const diffWidth = newWidth - actual.width
    const diffHeight = newHeight - actual.height
    const new_left = actual.x - diffWidth * x / 100
    const new_top = actual.y - diffHeight * y / 100

    // Limit values
    state.viewBox = {
        x: Math.max(-offset_limit, Math.min(offset_limit, new_left)),
        y: Math.max(-offset_limit, Math.min(offset_limit, new_top)),
        width: Math.max(min_width, Math.min(max_width, newWidth)),
        height: Math.max(min_height, Math.min(max_height, newHeight))
    }

    // Round to 3 decimal places
    state.viewBox.x = +(state.viewBox.x || 0).toFixed(3)
    state.viewBox.y = +(state.viewBox.y || 0).toFixed(3)
    state.viewBox.width = +(state.viewBox.width || 0).toFixed(3)
    state.viewBox.height = +(state.viewBox.height || 0).toFixed(3)

    state.scale = (state.scale || 1)

    update_zoom_pan()
    zoom_value.innerHTML = state.scale.toFixed(1)
    update_mouse_pos()
}

// @ts-ignore
render_element.onmousewheel = function (e) {
    e.preventDefault();
    // Zoom in or out based on the cursor position on the current visible screen, limit zoom to 0.1 - 10
    const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if (delta == 0) return;

    // Cursor position on the current visible screen scaled to viewBox dimensions
    const x = map(mouse_pos.x, 0, mouse_pos.width, 0, 100) // 0 to 100% relative to last viewBox dimensions
    const y = map(mouse_pos.y, 0, mouse_pos.height, 0, 100) // 0 to 100% relative to last viewBox dimensions

    zoom_into_point(x, y, delta)
}

// @ts-ignore
render_element.addEventListener("DOMMouseScroll", render_element.onmousewheel) // Handle Firefox mousewheel event


render_element.addEventListener("mousedown", (e) => {
    // Only on middle mouse button or right mouse button
    if (e.button != 1 && e.button != 2) return
    e.preventDefault()
    isDragging = true
    start = { x: e.clientX, y: e.clientY }
})
// On touch devices
render_element.addEventListener("touchstart", (e) => {
    if (e.touches.length) {
        e.preventDefault()
        isDragging = true
        start = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
})

render_element.addEventListener("mouseup", (e) => { if (isDragging) e.preventDefault(); isDragging = false })
render_element.addEventListener("mouseleave", (e) => { isDragging = false })
render_element.addEventListener("touchend", (e) => { if (isDragging) e.preventDefault(); isDragging = false })

/* disable right click */
render_element.addEventListener('contextmenu', e => e.preventDefault());

const update_zoom_pan = () => {
    const { x, y, width, height } = state.viewBox
    const viewBox = [x, y, width, height].map(v => v.toFixed(3)).join(" ")
    if (state.element) state.element.setAttribute("viewBox", viewBox)
}

update_zoom_pan()

// code_element.innerHTML = zpl_test_sample

// @ts-ignore
monaco.languages.register({ id: 'zpl' });

// @ts-ignore
monaco.languages.setMonarchTokensProvider('zpl', {
    tokenizer: {
        root: [
            [/(\^FX)([\s\S]*?)(?=\^|$)/, ['comment', 'comment']],
            [/(\^FD)(.*?)(?=\^|$)/, ['keyword', 'string']],
            [/(\^[A-Z0-9]{2})(.*?)(?=\^|$)/, ['keyword', 'number']],
        ]
    }
});

// @ts-ignore
monaco.editor.defineTheme('zplTheme', {
    base: 'vs',
    inherit: true,
    rules: [
        { token: 'comment', foreground: '008000' },
        { token: 'string', foreground: '0000FF' },
        { token: 'number', foreground: 'FF0000' },
        { token: 'keyword', foreground: '0000FF' },
    ]
});

// @ts-ignore
const zpl_editor = monaco.editor.create(code_text_element, {
    value: zpl_test_sample,
    language: 'zpl',
    theme: 'zplTheme'
});

// @ts-ignore
const svg_editor = monaco.editor.create(svg_text_element, {
    value: state.svg_content,
    language: 'xml',
    theme: "vs-dark",
    // Read only
    readOnly: true,
});

const update_sizes = () => {
    const zpl_params = {
        width: (code_text_element.parentElement?.clientWidth || 0) - 10,
        height: (code_text_element.parentElement?.clientHeight || 0) - 10
    }
    const svg_params = {
        width: (svg_text_element.parentElement?.clientWidth || 0) - 10,
        height: (svg_text_element.parentElement?.clientHeight || 0) - 10
    }
    const body_width = innerWidth

    zpl_editor.layout(zpl_params)
    svg_editor.layout(svg_params)

    // show minimap only when body_width >= 1600
    zpl_editor.updateOptions({ minimap: { enabled: body_width >= 600 } })
    svg_editor.updateOptions({ minimap: { enabled: body_width >= 600 } })

    // Fix state width to resize to the document width
    if (state.element) {
        const { width, height } = state.element.getBoundingClientRect()
        // Calculate the expected width based on the given style definition current html body width
        const new_width = innerWidth >= 1600 ? body_width * (2 / 3) - 40 : body_width - 50
        const h = state.element.parentElement?.parentElement?.clientHeight
        const new_height = h ? h - 10 : height
        // @ts-ignore
        state.element.style.width = new_width + "px"
        // @ts-ignore
        state.element.style.height = new_height + "px"
    }
}

let timeout = null
let refresh_count = 0
const update_svg = () => {
    refresh_count++
    clearTimeout(timeout)
    timeout = setTimeout(() => { // @ts-ignore
        // const zpl = code_element.value
        const zpl = zpl_editor.getValue()
        const t = +new Date()
        const { width, height } = render_element.getBoundingClientRect()
        // @ts-ignore
        state.svg_content = zpl2svg(zpl, { width, height, custom_class: "custom-svg-window" })
        const render_time = +new Date() - t
        console.log("Render time:", render_time, "ms")
        span_conversion_time.innerHTML = render_time + " ms"
        // output_element.innerHTML = escped_svg
        // w3CodeColor(output_element)
        // @ts-ignore
        svg_editor.setValue(state.svg_content)
        render_element.innerHTML = state.svg_content
        download_zpl.classList.remove("hidden")
        download_svg.classList.remove("hidden")
        download_png.classList.remove("hidden")
        const exists = state.element
        state.element = document.querySelector(".custom-svg-window")
        if (!exists && state.element && !state.viewBoxBase) {
            const viewBox = state.element.getAttribute("viewBox") || "0 0 1000 1000"
            const [x, y, width, height] = viewBox.split(" ").map(parseFloat)
            state.viewBoxBase = { x, y, width, height }
            state.viewBox = { x, y, width, height }
        }
        update_zoom_pan()
    }, refresh_count == 1 ? 0 : 50)
}

setTimeout(update_svg, 50)


// code_text_element.addEventListener("input", update_svg)
zpl_editor.onDidChangeModelContent(update_svg)

// On document resize change editor sizes
window.addEventListener("resize", () => {
    update_sizes()
})

button_svg.addEventListener("click", (e) => {
    e?.preventDefault()
    setTimeout(() => update_sizes(), 50)
    div_svg.classList.remove("hidden")
    div_raw.classList.add("hidden")
    button_svg.classList.add("active")
    button_raw.classList.remove("active")
})

button_raw.addEventListener("click", (e) => {
    e?.preventDefault()
    setTimeout(() => update_sizes(), 50)
    div_svg.classList.add("hidden")
    div_raw.classList.remove("hidden")
    button_svg.classList.remove("active")
    button_raw.classList.add("active")
})

/** @type { (filename: string, content: string) => void } */
const download_file = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

let download_zpl_active = false
download_zpl.addEventListener("click", (e) => {
    if (download_zpl_active) return;
    download_zpl_active = true;
    setTimeout(() => download_zpl_active = false, 1000);
    e?.preventDefault() // @ts-ignore
    download_file("label.zpl", code_element.value)
})

let download_svg_active = false
download_svg.addEventListener("click", (e) => {
    if (download_svg_active) return;
    download_svg_active = true;
    setTimeout(() => download_svg_active = false, 1000);
    e?.preventDefault() // @ts-ignore
    download_file("label.svg", state.svg_content)
})


let export_png_active = false
async function export_png(filename, svg) {
    if (export_png_active) return;
    export_png_active = true;
    setTimeout(() => export_png_active = false, 5000);
    try {

        // Create a Blob from the SVG string
        // Handle isTrusted error
        if (!svg) {
            export_png_active = false;
            console.error("No SVG content to export.");
            return;
        }
        // @ts-ignore
        const png_base64 = await svg2png(svg)
        // Properly trigger a file download
        const a = document.createElement('a');
        a.href = png_base64;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error(error);
    }

    export_png_active = false;

}

setTimeout(() => update_sizes(), 500)

download_png.addEventListener("click", () => export_png("label.png", state.svg_content))

const getLastCommits = async () => {

    const table_element = document.getElementById("commits-container")
    if (!table_element) return console.error("Missing commits table element");

    const getCommitCount = async (username, repo, branch) => {
        const url = `https://api.github.com/repos/${username}/${repo}/commits?sha=${branch}&per_page=1&page=1`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const linkHeader = response.headers.get('Link');
            if (!linkHeader) {
                return 1; // If no Link header, there's only one commit.
            }
            const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
            return match ? parseInt(match[1], 10) : 1;
        } catch (error) {
            console.error("Error fetching commit count:", error);
            return 0;
        }
    }

    const getCommits = async (username, repo, branch, limit = 5) => {
        const res = await fetch(`https://api.github.com/repos/${username}/${repo}/commits?sha=${branch}&per_page=${limit}`)
        const text = await res.text()
        const commits = JSON.parse(text)
        return commits
    }

    try {

        // Use cached commits so we don't hit the github API rate limit
        const stored_commits_json = localStorage.getItem("commit_cache") || ''
        /** @type {{ updated: number, commits: any[], total: number } | null} */
        let stored_commits = null
        if (stored_commits_json) {
            try {
                stored_commits = JSON.parse(stored_commits_json)
            } catch (error) {
                console.error("Failed to parse stored commits", error)
                localStorage.removeItem("commit_cache")
            }
        }

        let load_new_commits = true
        let commits = []
        if (stored_commits) {
            const { updated } = stored_commits
            const now = +new Date()
            const diff = now - updated
            const minutes = diff / 1000 / 60
            if (minutes < 2) {
                load_new_commits = false
                commits = stored_commits.commits
                console.log("Using cached commits")
            }
        }

        if (load_new_commits) {
            console.log("Loading new commits")
            commits = await getCommits('jozo132', 'zpl2svg', 'main', 5)
            const total = await getCommitCount('jozo132', 'zpl2svg', 'main')
            stored_commits = { updated: +new Date(), commits, total }
        }
        try {
            if (!Array.isArray(commits)) throw new Error("Invalid response")
            if (load_new_commits) localStorage.setItem("commit_cache", JSON.stringify(stored_commits)) // Store commits in cache
            const total = stored_commits?.total || 0
            const data = commits.map(({ commit: { committer: { date }, message }, author: { login, avatar_url, html_url: url_author }, sha, html_url: url_commit }, i) => ({
                index: total - i, date, sha, login, avatar_url, message, url_author, url_commit
            })).map(({ index, date, sha, login, avatar_url, message, url_author, url_commit }) => [
                index,
                date.replace('T', ' ').replace('Z', ''),
                `<a href="${url_commit}" target="_blank">${sha.substring(0, 7)}...</a>`,
                `<a href="${url_author}" target="_blank" style="text-align: center; display: flex; align-items: center; justify-content: left;">` +
                `<img src="${avatar_url}" alt="${login}" width="20" height="20" style="border-radius: 30%; margin-right: 5px;">${login}` +
                `</a>`,
                message
            ])
            data.forEach(commit => {
                const date = commit[1]
                const index_of_last_semicolon = date.lastIndexOf(':')
                if (index_of_last_semicolon != -1) commit[1] = date.substring(0, index_of_last_semicolon)
            })
            table_element.innerHTML = `
                <table id="commits-table">
                    <tr class="sticky">
                        <th>#</th>
                        <th>Date</th>
                        <th>Commit</th>
                        <th>User</th>
                        <th>Message</th>
                    </tr>
                    ${data.map(([index, date, commit, user, message]) => `<tr><td>${index}</td><td>${date}</td><td>${commit}</td><td><span>${user}</span></td><td>${message}</td></tr>`).join("")}
                </table>`
        } catch (error) {
            if (commits && commits.message) {
                table_element.innerHTML = `<p style="color: red;">Failed to load commits</p><p>${commits.message}</p>`
            } else {
                table_element.innerHTML = `<p style="color: red;">Failed to load commits</p><p>${error && error.message || error}</p>`
            }
        }

    } catch (error) {
        console.error(error)
        table_element.innerHTML = `<p style="color: red;">Failed to load commits</p><p>${error && error.message || error}</p>`

    }
}

getLastCommits()