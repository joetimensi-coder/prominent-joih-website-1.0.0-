// Add REAL customer feedback here (with their permission). The section stays hidden while this list is empty.
// Example: { quote: 'Text of their feedback.', name: 'Full name', detail: 'Crop or town' }
const TESTIMONIALS = [];

// Add REAL grower videos here (with their permission). The section stays hidden while this list is empty.
//   YouTube : { type: 'youtube',  id: 'dQw4w9WgXcQ', title: 'Name, crop' }   (the part after v= in the link)
//   Facebook: { type: 'facebook', url: 'https://www.facebook.com/.../videos/123', title: 'Name, crop' }  (must be public)
//   File    : { type: 'mp4',      src: 'videos/name.mp4', title: 'Name, crop' }  (save the file in public/videos)
const VIDEOS = [];

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const update = () => header && header.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', update, { passive: true }); update();

    const product = new URLSearchParams(location.search).get('product');
    const select = document.getElementById('product');
    if (select && product) select.value = product;

    const vbox = document.getElementById('videos'), vsec = document.getElementById('video-section');
    if (vbox && vsec && VIDEOS.length) {
        VIDEOS.forEach((v) => {
            const card = document.createElement('figure'); card.className = 'video-card';
            const frame = document.createElement('div'); frame.className = 'video-frame';
            const cap = document.createElement('figcaption'); cap.textContent = v.title || '';
            const iframe = (src) => {
                const f = document.createElement('iframe'); f.src = src; f.title = v.title || 'Grower video'; f.loading = 'lazy';
                f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true; return f;
            };
            if (v.type === 'mp4') {
                const m = document.createElement('video'); m.src = v.src; m.controls = true; m.preload = 'metadata'; m.playsInline = true;
                frame.appendChild(m);
            } else if (v.type === 'youtube') {
                const b = document.createElement('button'); b.type = 'button'; b.className = 'video-play';
                b.setAttribute('aria-label', 'Play video: ' + (v.title || 'grower video'));
                b.style.backgroundImage = 'url(https://img.youtube.com/vi/' + encodeURIComponent(v.id) + '/hqdefault.jpg)';
                b.innerHTML = '<span aria-hidden="true">\u25B6</span>';
                b.addEventListener('click', () => { frame.replaceChildren(iframe('https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?autoplay=1&rel=0')); });
                frame.appendChild(b);
            } else if (v.type === 'facebook') {
                frame.appendChild(iframe('https://www.facebook.com/plugins/video.php?show_text=false&href=' + encodeURIComponent(v.url)));
            }
            card.append(frame, cap); vbox.appendChild(card);
        });
        vsec.hidden = false;
    }

    const box = document.getElementById('testimonials'), sec = document.getElementById('testimonial-section');
    if (box && sec && TESTIMONIALS.length) {
        TESTIMONIALS.forEach(({ quote, name, detail }) => {
            const c = document.createElement('blockquote'); c.className = 'card';
            const p = document.createElement('p'); p.textContent = '\u201C' + quote + '\u201D';
            const f = document.createElement('footer'); f.textContent = name + (detail ? ', ' + detail : '');
            c.append(p, f); box.appendChild(c);
        });
        sec.hidden = false;
    }

    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const io = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: 0.1 });
        document.querySelectorAll('main section, #trust-strip > div, .product-card, .card').forEach(el => { el.classList.add('reveal'); io.observe(el); });
    }

    const form = document.getElementById('contact-form'), status = document.getElementById('form-status');
    if (!form) return;
    const show = (t, c) => { status.textContent = t; status.className = 'form-status ' + c; };
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const btn = form.querySelector('button[type="submit"]'); btn.disabled = true; show('Sending...', '');
        try {
            const res = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || 'Request failed');
            form.reset(); show('Thank you! Your message was sent. We will contact you shortly.', 'success');
        } catch (err) {
            show(err.message && err.message !== 'Request failed' ? err.message : 'Sorry, we could not send your message. Please try again or contact us on WhatsApp.', 'error');
        } finally { btn.disabled = false; }
    });
});
