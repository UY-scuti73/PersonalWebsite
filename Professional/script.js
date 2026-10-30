// Highlight the navigation link for the visible section.
const links = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link) => {
                const active = link.getAttribute('href') === '#' + entry.target.id;
                link.classList.toggle('active', active);
                if (active) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });

    document.querySelectorAll('main section[id]').forEach((section) => {
        observer.observe(section);
    });
}

// Show the existing placeholder if the original headshot is unavailable.
const headshot = document.querySelector('.portrait img');
if (headshot) {
    const showFallback = () => { headshot.hidden = true; };
    headshot.addEventListener('error', showFallback);
    if (headshot.complete && headshot.naturalWidth === 0) showFallback();
}
