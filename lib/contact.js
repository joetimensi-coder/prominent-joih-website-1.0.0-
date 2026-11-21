// Validation and email-building for the contact form. No network code here, so it is easy to test.

const LIMITS = { fullname: 100, email: 150, phone: 30, product: 100, inquiry: 3000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Remove line breaks from single-line fields (blocks email header injection).
const oneLine = (v) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim();

function validateContact(body = {}) {
    // Honeypot: bots fill the hidden "website" field, people never see it.
    if (body.website) return { spam: true };

    const data = {
        fullname: oneLine(body.fullname),
        email: oneLine(body.email),
        phone: oneLine(body.phone),
        product: oneLine(body.product),
        inquiry: String(body.inquiry ?? '').trim()
    };

    if (!data.fullname) return { error: 'Please enter your name.' };
    if (!data.email || !EMAIL_RE.test(data.email)) return { error: 'Please enter a valid email address.' };
    if (!data.inquiry) return { error: 'Please enter your message.' };
    for (const [k, max] of Object.entries(LIMITS)) {
        if (data[k].length > max) return { error: `Your ${k} is too long.` };
    }
    return { data };
}

function buildEmail(data, { from, to }) {
    const lines = [
        ['Name', data.fullname], ['Email', data.email],
        ['Phone', data.phone || '-'], ['Product', data.product || '-']
    ];
    const text = lines.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nMessage:\n${data.inquiry}`;
    const html = '<table cellpadding="6">' +
        lines.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`).join('') +
        `</table><p><b>Message:</b></p><p>${escapeHtml(data.inquiry).replace(/\n/g, '<br>')}</p>`;
    return {
        from: `"PROMINENT JOIH Website" <${from}>`,   // Gmail always sends as the logged-in account
        to,
        replyTo: `"${data.fullname.replace(/"/g, '')}" <${data.email}>`, // pressing Reply goes to the customer
        subject: `New website inquiry from ${data.fullname}` + (data.product ? ` (${data.product})` : ''),
        text, html
    };
}

module.exports = { validateContact, buildEmail, escapeHtml };
