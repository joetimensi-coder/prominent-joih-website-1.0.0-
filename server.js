require('dotenv').config();
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { validateContact, buildEmail } = require('./lib/contact');

const PORT = process.env.PORT || 3000;
const GMAIL_USER = (process.env.GMAIL_USER || '').trim();
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, ''); // Google shows it in groups of 4
const MAIL_TO = (process.env.MAIL_TO || GMAIL_USER).trim();

const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY)); // set to 1 on most hosts
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const mailReady = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);
const transporter = mailReady
    ? nodemailer.createTransport({
        host: 'smtp.gmail.com', port: 465, secure: true,
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }
    })
    : null;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, limit: 5,
    standardHeaders: true, legacyHeaders: false,
    message: { error: 'Too many messages. Please try again in a few minutes.' }
});

app.post('/api/contact', limiter, async (req, res) => {
    const result = validateContact(req.body);
    if (result.spam) return res.json({ ok: true });            // pretend success; do not email bots
    if (result.error) return res.status(400).json({ error: result.error });
    if (!transporter) return res.status(503).json({ error: 'Email is not set up yet. Please contact us another way.' });

    try {
        await transporter.sendMail(buildEmail(result.data, { from: GMAIL_USER, to: MAIL_TO }));
        res.json({ ok: true });
    } catch (err) {
        console.error('Send failed:', err.message);             // never send internal details to the browser
        res.status(500).json({ error: 'Sorry, we could not send your message right now.' });
    }
});

app.listen(PORT, () => {
    console.log(`Website running on http://localhost:${PORT}`);
    if (!transporter) return console.warn('Email NOT configured: set GMAIL_USER and GMAIL_APP_PASSWORD in .env');
    transporter.verify()
        .then(() => console.log('Gmail connection OK'))
        .catch(err => console.error('Gmail connection FAILED:', err.message));
});
