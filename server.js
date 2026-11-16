require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/submit", async (req, res) => {
  try {
    const { mobile, password, consent } = req.body || {};
    if (consent !== true) {
      return res.status(400).json({ error: "Consent is required." });
    }

    const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
    const safeMobile = clean(mobile, 20);
    // Fixed: consistent camelCase 'safePassword'
    const safePassword = clean(password, 120);

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const message = [
        "New demo form submission",
        `Mobile: ${safeMobile}`,
        `Password length: ${safePassword.length} chars`, // Safer than logging raw passwords
        "Purpose: User-consented demo contact form"
      ].join("\n");

      const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message })
      });

      if (!tg.ok) {
        return res.status(502).json({ error: "Could not send Telegram notification. Check bot settings." });
      }
    }

    return res.json({
      ok: true,
      notification: token && chatId ? "sent" : "not_configured"
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Catch-all JSON error handler for malformed incoming JSON payloads
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON payload sent to server." });
  }
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Demo form running on http://localhost:${port}`));
