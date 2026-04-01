import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // API Route for sending consultation emails
  app.post("/api/send-consultation-email", async (req, res) => {
    const { name, phone, industry, production_purpose, message, plan, initialPrice, quantity, budget } = req.body;

    const mailOptions = {
      from: `"PlaceURL" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || "sojil.com@gmail.com",
      subject: `[신규 상담 신청] ${name}님으로부터 새로운 문의가 도착했습니다.`,
      text: `
[신규 상담 신청 내역]

성함/업체명: ${name}
연락처: ${phone}
업종: ${industry}
제작 목적: ${production_purpose}

[상세 내용]
플랜: ${plan || "-"}
초기 가격: ${initialPrice ? `₩${initialPrice.toLocaleString()}` : "-"}
수량: ${quantity || "-"}
예산: ${budget || "-"}

[요청 사항]
${message}
      `.trim(),
    };

    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email credentials not set. Skipping email send.");
        return res.status(200).json({ success: true, message: "Email credentials not set, but request received." });
      }

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
