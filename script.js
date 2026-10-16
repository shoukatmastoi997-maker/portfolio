// ========================================
// Shoukat Ali — Portfolio
// ========================================

document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Mobile navigation ----------
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

const setMenu = (open) => {
    navMenu.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars', !open);
    icon.classList.toggle('fa-xmark', open);
};

navToggle?.addEventListener('click', () => setMenu(!navMenu.classList.contains('open')));
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ---------- Scroll effects: header, progress bar, back-to-top, active link ----------
const header = document.getElementById('header');
const progress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle('scrolled', y > 20);
    toTop.classList.toggle('show', y > 600);
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    let current = '';
    sections.forEach(section => {
        if (y >= section.offsetTop - 160) current = section.id;
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            setTimeout(() => { entry.target.style.transitionDelay = ''; }, 900);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    revealObserver.observe(el);
});

// ---------- Animated counters ----------
const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    if (reducedMotion) { el.textContent = target; return; }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
};

const stats = document.querySelector('.stats');
if (stats) {
    new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
            stats.querySelectorAll('.stat-num').forEach(animateCounter);
            obs.disconnect();
        }
    }, { threshold: 0.4 }).observe(stats);
}

// ---------- Typing effect ----------
const typed = document.getElementById('typed');
const roles = [
    'DevOps & Cloud Engineer',
    'AWS · Terraform · Kubernetes',
    'CI/CD with Jenkins & GitHub Actions',
    'Full-Stack & AI Engineer'
];

if (typed && !reducedMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    const type = () => {
        const text = roles[roleIndex];
        charIndex += deleting ? -1 : 1;
        typed.textContent = text.slice(0, charIndex);

        let delay = deleting ? 35 : 70;
        if (!deleting && charIndex === text.length) {
            delay = 2200;
            deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }
        setTimeout(type, delay);
    };

    setTimeout(type, 2600);
}

// ---------- Skill card spotlight ----------
document.querySelectorAll('.skill').forEach(card => {
    card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
});

// ---------- Project filters ----------
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.toggle('active', b === btn));
        const f = btn.dataset.filter;
        projects.forEach(p => {
            const show = f === 'all' || p.dataset.cat.split(' ').includes(f);
            p.classList.toggle('hidden', !show);
            if (show) p.classList.add('in');
        });
    });
});

// ---------- Contact form (opens Gmail compose, addressed to me) ----------
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const recipient = document.getElementById('contactEmail').textContent.trim();
    const subject = data.get('subject');
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
    const params = new URLSearchParams({ view: 'cm', fs: '1', to: recipient, su: subject, body });
    const gmail = window.open(`https://mail.google.com/mail/?${params}`, '_blank');

    // Fall back to the default mail client if the new tab was blocked
    if (gmail) {
        gmail.opener = null;
    } else {
        window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Opening Gmail…';
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        contactForm.reset();
    }, 2500);
});

// ---------- Theme toggle ----------
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

const syncThemeIcon = () => {
    const light = root.dataset.theme === 'light';
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon', !light);
    icon.classList.toggle('fa-sun', light);
    document.querySelector('meta[name="theme-color"]').content = light ? '#f6f8fc' : '#070b14';
};

themeToggle?.addEventListener('click', () => {
    const light = root.dataset.theme !== 'light';
    if (light) root.dataset.theme = 'light'; else delete root.dataset.theme;
    try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) { /* storage unavailable */ }
    syncThemeIcon();
});
if (themeToggle) syncThemeIcon();

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

console.log('%c Shoukat Ali ', 'background: linear-gradient(120deg, #22d3ee, #818cf8); color: #050810; font-size: 18px; font-weight: 700; padding: 8px 16px; border-radius: 6px;');
console.log('%c DevOps & Cloud Engineer — github.com/shoukatmastoi997-maker ', 'color: #22d3ee; font-size: 12px;');
