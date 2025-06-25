// Simple test script for QR code functionality
const fs = require("fs");

// Load the zpl2svg module
const { zpl2svg } = require("./zpl2svg.js");

// Test QR code ZPL
const testZPL = `^XA
^FO50,50^BQN,2,10,L,7^FD123456789^FS
^FO50,200^BQN,2,5,M,0^FDhttps://example.com^FS
^XZ`;

try {
  const svg = zpl2svg(testZPL, { width: 800, height: 600 });
  console.log("QR Code SVG generated successfully!");
  console.log("SVG length:", svg.length);

  // Save to file for inspection
  fs.writeFileSync("test_qr_output.svg", svg);
  console.log("SVG saved to test_qr_output.svg");
} catch (error) {
  console.error("Error generating QR code:", error);
}
