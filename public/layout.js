const PAGES = [['index.html','Home'],['about.html','About'],['products.html','Products'],['safety.html','Product safety'],['research.html','Research'],['community.html','Community'],['contact.html','Contact']];
const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

customElements.define('site-header', class extends HTMLElement {
    connectedCallback() {
        const links = PAGES.map(([h, t]) =>
            `<li><a href="${h}"${h === here ? ' aria-current="page"' : ''}>${t}</a></li>`).join('');
        this.innerHTML = `
        <div id="top-utility-bar">Organic fertilizers for healthier soil and stronger harvests</div>
        <header>
            <a id="logo-container" href="index.html" aria-label="PROMINENT JOIH home">
                <span class="logo-name">PROMINENT JOIH</span>
                <span class="logo-sub">ORGANIC PRODUCTS, INC</span>
            </a>
            <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
            <nav id="site-nav" aria-label="Main"><ul>${links}</ul></nav>
        </header>`;
        const header = this.querySelector('header'), toggle = this.querySelector('.menu-toggle');
        const set = (open) => {
            header.classList.toggle('nav-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.textContent = open ? 'Close' : 'Menu';
        };
        toggle.addEventListener('click', () => set(!header.classList.contains('nav-open')));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    }
});

customElements.define('site-footer', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
            <div class="footer-grid">
                <div><p class="footer-brand">PROMINENT JOIH</p><p>Organic fertilizers for healthier soil and stronger harvests.</p></div>
                <div><h4>Company</h4><ul class="footer-links"><li><a href="about.html">About us</a></li><li><a href="research.html">Research</a></li><li><a href="community.html">Community</a></li></ul></div>
                <div><h4>Products</h4><ul class="footer-links"><li><a href="products.html#tag-k20">TAG K20</a></li><li><a href="products.html#biosoltamax">BIOSOLTAMAX</a></li><li><a href="safety.html">Product safety</a></li></ul></div>
                <div><h4>Contact</h4><ul class="footer-links"><li><a href="contact.html">Send an inquiry</a></li><li><a href="https://wa.link/rn5nd8" target="_blank" rel="noopener">WhatsApp: +234 707 801 7207</a></li><li class="footer-addr">Plot 16, Equity Estate, Magboro, Ogun State, Nigeria</li></ul></div>
            </div>
            <p class="footer-copy">&copy; ${new Date().getFullYear()} PROMINENT JOIH Organic Products, Inc. All rights reserved.</p>
        </footer>
        <a class="wa-float" href="https://wa.link/rn5nd8" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">WhatsApp</a>`;
    }
});
