import axios from "axios";
import { createPDF } from "../utils/pdfGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import fs from "fs";

export const generateReport = async (req, res) => {
  const { query, email } = req.body;

  try {
    // 1️⃣ Get AI response
    const aiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: query }] }],
      },
      {
        headers: { "x-goog-api-key": process.env.GEMINI_API_KEY },
      }
    );

    const reportText = aiResponse.data.candidates[0].content.parts[0].text;

    // 2️⃣ Create PDF
    const pdfPath = await createPDF(reportText);

    // 3️⃣ Send email with attachment
    await sendEmail(email, "Your AI Generated Report", "Attached is your report.", pdfPath);

    // 4️⃣ Send file for download
    const file = fs.readFileSync(pdfPath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    res.send(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating report" });
  }
};
