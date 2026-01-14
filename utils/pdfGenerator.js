// backend/utils/pdfGenerator.js
const fs = require("fs");
const PDFDocument = require("pdfkit");

async function generatePDF(content, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    // Title
    doc.fontSize(20).fillColor("#2E86C1").text("AI Generated Report", { align: "center" });
    doc.moveDown(1.5);

    // Body text
    doc.fontSize(12).fillColor("#000000").text(content, { align: "left" });

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
}

module.exports = generatePDF;
