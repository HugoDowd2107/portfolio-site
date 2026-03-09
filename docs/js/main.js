// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Shrink nav top margin on scroll
const navBlock = document.querySelector('.navigation-block');
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navBlock.classList.add('nav-scrolled');
    } else {
        navBlock.classList.remove('nav-scrolled');
    }
}, { passive: true });

// Update active navigation link based on scroll position
const navLinks = document.querySelectorAll('.navigation-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});
