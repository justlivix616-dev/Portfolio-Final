// 1. Custom Interactive Cursor
const cursor = document.getElementById('cursor');
const hoverTargets = document.querySelectorAll('.hover-target');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
    });
    target.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
    });
});

// 2. Interactive Project Filtering (ZJ Style)
const filterBtns = document.querySelectorAll('.filter-btn');
const archiveItems = document.querySelectorAll('.archive-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        archiveItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hide');
                item.style.animation = 'none';
                item.offsetHeight; 
                item.style.animation = null; 
            } else {
                item.classList.add('hide');
            }
        });
    });
});

// 3. Smooth Navigation Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 4. Navbar Parallax / Floating Sticky Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (!navbar) return;
    const scrollY = window.scrollY;
    const translateY = Math.min(scrollY * 0.04, 10);
    const scale = Math.max(0.99, 1 - Math.min(scrollY, 120) * 0.0004);
    navbar.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    navbar.classList.toggle('sticky-active', scrollY > 10);
});

// 5. Hamburger Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
    });
}

// Close mobile menu when a nav link is clicked (improves mobile UX)
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Close menu when clicking outside (only for mobile open state)
document.addEventListener('click', (e) => {
    if (!navLinks || !navToggle) return;
    if (navLinks.classList.contains('open')) {
        const clickInside = navLinks.contains(e.target) || navToggle.contains(e.target);
        if (!clickInside) {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }
});

// Ensure menu closes when resizing to desktop width
window.addEventListener('resize', () => {
    if (!navLinks || !navToggle) return;
    if (window.innerWidth > 900 && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});
