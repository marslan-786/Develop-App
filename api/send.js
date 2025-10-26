import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, message } = req.body;

  // 🔑 Gmail SMTP settings (تمہارے والے رکھے ہوئے ہیں)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nothingisimpossiblebrother@gmail.com",
      pass: "agntmvxlgazptvow"
    }
  });

  const mailOptions = {
    from: `"Website Message" <nothingisimpossiblebrother@gmail.com>`,
    to: "marslansalfias@gmail.com",
    subject: `New Message from ${name}`,
    text: `Name: ${name}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "✅ Message Sent Successfully!" });
  } catch (err) {
    console.error("Email Error:", err);
    return res.status(500).json({ success: false, error: "❌ Failed to send message!" });
  }
}
