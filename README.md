<<<<<<< HEAD
# PROMINENT JOIH website + Gmail contact form

## Structure
```
server.js          Node server: serves the site and emails form submissions via Gmail
lib/contact.js     Form validation + email building (unit tested)
public/            The website (index.html, style.css, script.js, images)
.env               YOUR secrets (create from .env.example - never share or upload it)
```

## 1. Get a Google App Password
1. Sign in to the Gmail account that will send/receive inquiries.
2. Google Account > Security > turn on **2-Step Verification** (required).
3. Open https://myaccount.google.com/apppasswords (or Security > 2-Step Verification > App passwords at the bottom).
4. Name it (e.g. "Prominent Joih website") > **Create**.
5. Copy the 16-character code. It is shown only once.
6. Paste it into `.env` as GMAIL_APP_PASSWORD. This is NOT your normal Gmail password.

Can't see "App passwords"? 2-Step Verification may be off or security-key-only, the account may be a work/school account, or Advanced Protection may be on.
If you ever change your Google password, the app password stops working: create a new one.

## 2. Run it
```
npm install
cp .env.example .env     # then edit .env
npm start                # look for "Gmail connection OK"
npm test                 # runs the unit tests
```
Open http://localhost:3000 and send a test message.

## 3. Go live
Use a host that runs Node.js (Render, Railway, a VPS, cPanel "Setup Node.js App").
Static-only hosts (GitHub Pages, plain Netlify) cannot run server.js.
Add the .env values as the host's "Environment Variables" instead of uploading .env. Set TRUST_PROXY=1.

## 4. Optional
- WhatsApp button: set WHATSAPP_NUMBER at the top of public/script.js (e.g. '2348012345678').
=======
# prominent-joih-website-1.0.0-
A responsive website for an organic fertilizer business, designed to showcase products, provide information about their benefits, and make it easy for customers to make enquiries and place orders.
>>>>>>> 33cf74e4d9480d1cbf2cb975a794d3a0fb371420
