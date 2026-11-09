# Demo Contact Form + Telegram Notifications

This is a safe demo contact form. It collects only a name, mobile number and email, with explicit consent. It does not collect passwords, payment PINs, banking credentials or real OTPs.

## Run locally
1. Install Node.js.
2. In this folder, run `npm install`.
3. Copy `.env.example` to `.env`.
4. Run `npm start`.
5. Open `http://localhost:3000`.

## Enable Telegram notifications
1. In Telegram, open `@BotFather`, run `/newbot`, and follow its prompts.
2. Copy the bot token into `TELEGRAM_BOT_TOKEN` in `.env`.
3. Open your new bot and press Start.
4. Get your chat ID using a trusted Telegram bot-management method, then set `TELEGRAM_CHAT_ID` in `.env`.
5. Restart the server.

Never share your bot token publicly or put it in browser/frontend code. For deployment, set these as server-side environment variables in your hosting provider. The site can accept demo submissions without Telegram credentials, but notifications remain disabled until configured.
