const test = require('node:test');
const assert = require('node:assert');
const { validateContact, buildEmail } = require('../lib/contact');

const good = { fullname: 'Ada Obi', email: 'ada@example.com', phone: '0801', product: 'TAG K20 Organic Fertilizer', inquiry: 'Price for 10 bags?' };

test('accepts a valid message', () => assert.ok(validateContact(good).data));
test('honeypot flags spam', () => assert.strictEqual(validateContact({ ...good, website: 'http://spam' }).spam, true));
test('rejects missing name', () => assert.ok(validateContact({ ...good, fullname: '  ' }).error));
test('rejects bad email', () => assert.ok(validateContact({ ...good, email: 'not-an-email' }).error));
test('rejects empty message', () => assert.ok(validateContact({ ...good, inquiry: '' }).error));
test('rejects over-long message', () => assert.ok(validateContact({ ...good, inquiry: 'x'.repeat(3001) }).error));
test('handles missing body', () => assert.ok(validateContact(undefined).error));
test('strips line breaks (header injection)', () => {
    const r = validateContact({ ...good, fullname: 'Ada\r\nBcc: evil@x.com' });
    assert.ok(!/[\r\n]/.test(r.data.fullname));
});
test('escapes HTML in the email body', () => {
    const { data } = validateContact({ ...good, inquiry: '<script>alert(1)</script>' });
    const mail = buildEmail(data, { from: 'me@gmail.com', to: 'me@gmail.com' });
    assert.ok(!mail.html.includes('<script>'));
    assert.ok(mail.html.includes('&lt;script&gt;'));
});
test('reply-to is the customer, from is the Gmail account', () => {
    const mail = buildEmail(validateContact(good).data, { from: 'me@gmail.com', to: 'inbox@gmail.com' });
    assert.ok(mail.replyTo.includes('ada@example.com'));
    assert.ok(mail.from.includes('me@gmail.com'));
    assert.strictEqual(mail.to, 'inbox@gmail.com');
});
