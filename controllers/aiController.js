// backend/controllers/aiController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const generatePDF = require("../utils/pdfGenerator");
const sendEmail = require("../utils/sendEmail");
const fs = require("fs");
const path = require("path");

// Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateAIReport = async (req, res) => {
  try {
    const { query, email } = req.body;

    if (!query || !email) {
      return res.status(400).json({ message: "Query and email are required" });
    }

    // Step 1️⃣: Get AI response from Gemini
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });
    const prompt = `Generate a professional and detailed report in paragraphs for this query: "${query}". 
    Include important points, summary, and conclusion if relevant.`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    // Step 2️⃣: Generate PDF
    const pdfPath = path.join(__dirname, `../reports/Report_${Date.now()}.pdf`);
    await generatePDF(aiResponse, pdfPath);

    // Step 3️⃣: Send email with PDF attachment
    await sendEmail(email, "Your AI Generated Report", "Please find the attached report.", pdfPath);

    // Step 4️⃣: Delete PDF after sending (optional cleanup)
    setTimeout(() => fs.unlinkSync(pdfPath), 10000);

    // Step 5️⃣: Send response to frontend
    res.status(200).json({
      message: "Report generated and sent successfully!",
      aiResponse,
      downloadLink: `/reports/${path.basename(pdfPath)}`,
    });
  } catch (error) {
    console.error("AI Report Error:", error);
    res.status(500).json({ message: "Failed to generate AI report", error: error.message });
  }
};
