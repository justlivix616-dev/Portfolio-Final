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
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // reuse the same logic as pointerup
        const filterValue = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
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

    // Support touch/pointer devices where click may be unreliable
    btn.addEventListener('pointerup', (e) => {
        if (e.button && e.button !== 0) return; // only primary
        e.preventDefault();
        e.stopPropagation();
        const filterValue = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        archiveItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });
    }, { passive: false });
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
if (navbar) {
    let ticking = false;
    let lastScrollY = window.scrollY || document.documentElement.scrollTop;
    const contactBtn = document.querySelector('.navbar .action-btn') || document.querySelector('.action-btn');
    
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY || document.documentElement.scrollTop;
                const isMobile = window.innerWidth <= 768;
                
                // More pronounced parallax on mobile for visibility
                let translateY, scale;
                if (isMobile) {
                    // Mobile: more noticeable movement
                    translateY = Math.min(scrollY * 0.08, 20);
                    scale = Math.max(0.95, 1 - Math.min(scrollY, 150) * 0.0008);
                } else {
                    // Desktop: subtle effect
                    translateY = Math.min(scrollY * 0.04, 10);
                    scale = Math.max(0.99, 1 - Math.min(scrollY, 120) * 0.0004);
                }

                // Toggle contact button visibility based on scroll direction
                if (contactBtn) {
                    const HIDE_DELTA = 10;    // min px scrolled down to trigger hide
                    const HIDE_SCROLL_Y = 80; // only hide after this scrollY
                    const delta = scrollY - lastScrollY;

                    // Hide on notable downward scroll past threshold
                    if (delta > HIDE_DELTA && scrollY > HIDE_SCROLL_Y) {
                        if (!contactBtn.classList.contains('hidden-by-scroll')) {
                            contactBtn.classList.add('hidden-by-scroll');
                            contactBtn.setAttribute('aria-hidden', 'true');
                            if (window.innerWidth <= 900) navbar.classList.add('compact');
                        }
                    } else if (contactBtn.classList.contains('hidden-by-scroll') && scrollY <= HIDE_SCROLL_Y) {
                        // Only show again when the page is back near the top
                        contactBtn.classList.remove('hidden-by-scroll');
                        contactBtn.setAttribute('aria-hidden', 'false');
                        navbar.classList.remove('compact');
                    }
                }
                
                navbar.style.setProperty('--nav-translate', `${translateY}px`);
                navbar.style.setProperty('--nav-scale', `${scale}`);
                navbar.classList.toggle('sticky-active', scrollY > 10);
                lastScrollY = scrollY;
                ticking = false;
            });
            ticking = true;
        }
    };
    
    // Use passive listener for smooth scroll performance
    window.addEventListener('scroll', onScroll, { passive: true });
}

// 5. Hamburger Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    // Ensure the toggle button does not submit forms and stops propagation
    navToggle.setAttribute('type', 'button');
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
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
    // Remove compact navbar state when switching to desktop widths
    if (window.innerWidth > 900 && navbar.classList.contains('compact')) {
        navbar.classList.remove('compact');
    }
});
