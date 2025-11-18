// Global locomotive instance (if available)
let locoScroll = null;
let isLocoEnabled = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize locomotive first (if available) so other modules can use it
    initLocomotive();

    // Initialize all functionality
    initLoader();
    initNavigation();
    initTypingAnimation();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
});

// Initialize Locomotive Scroll (graceful fallback if library not present)
function initLocomotive() {
    try {
        if (window.LocomotiveScroll) {
            locoScroll = new LocomotiveScroll({
                el: document.querySelector('[data-scroll-container]'),
                smooth: true,
                smartphone: { smooth: true },
                tablet: { smooth: true }
            });

            isLocoEnabled = true;

            // Keep locomotive updated after load
            window.addEventListener('load', function() {
                try { locoScroll.update(); } catch (e) { /* ignore */ }
            });
        }
    } catch (err) {
        console.warn('Locomotive initialization failed:', err);
        isLocoEnabled = false;
        locoScroll = null;
    }
}

// Helper to read current scroll Y from locomotive if present, otherwise window.scrollY
function getScrollY() {
    try {
        if (isLocoEnabled && locoScroll && locoScroll.scroll && locoScroll.scroll.instance) {
            return locoScroll.scroll.instance.scroll.y;
        }
    } catch (e) {
        // ignore and fallback
    }
    return window.scrollY || 0;
}

// Loading Animation
function initLoader() {
    const loader = document.getElementById('loader');
    
    // Hide loader after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// Navigation Functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    // Unified scroll handler (works with locomotive-scroll when available)
    function onScrollPos(y) {
        if (y > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink(y);
    }

    // Attach native scroll fallback
    window.addEventListener('scroll', function() {
        onScrollPos(window.scrollY || 0);
    });

    // If locomotive is available, listen to its scroll events as well
    if (isLocoEnabled && locoScroll && typeof locoScroll.on === 'function') {
        locoScroll.on('scroll', function(obj) {
            // obj.scroll.y contains the current scroll position
            onScrollPos(obj.scroll.y);
        });
    }

    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active navigation link
    function updateActiveNavLink(scrollY) {
        const sections = document.querySelectorAll('section[id]');
        const currentScroll = typeof scrollY === 'number' ? scrollY : getScrollY();
        const scrollPosition = currentScroll + 100;

        sections.forEach(section => {
            // Compute absolute top relative to the document
            const sectionTop = section.getBoundingClientRect().top + currentScroll;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Typing Animation for Hero Section
function initTypingAnimation() {
    const typingElement = document.getElementById('typing-name');
    const text = 'Abhay Pratap Singh';
    let index = 0;
    
    // Clear the text initially
    typingElement.textContent = '';
    
    function typeText() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 100);
        } else {
            // Add blinking cursor effect
            setTimeout(() => {
                typingElement.style.borderRight = '2px solid var(--accent-cyan)';
                setInterval(() => {
                    typingElement.style.borderRight = 
                        typingElement.style.borderRight === '2px solid transparent' 
                            ? '2px solid var(--accent-cyan)' 
                            : '2px solid transparent';
                }, 500);
            }, 500);
        }
    }
    
    // Start typing animation after a delay
    setTimeout(typeText, 1500);
}

// Scroll Animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.section-header, .about-image, .about-text, .skill-category, .project-card, .timeline-item, .contact-info, .contact-form');
    
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Skill card stagger animation
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.style.animationDelay = `${index * 0.2}s`;
    });

    // Project card stagger animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Timeline item stagger animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.3}s`;
    });
}

// Contact Form Functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'var(--accent-cyan)' : '#ff4757'};
            color: white;
            border-radius: var(--border-radius);
            z-index: 10000;
            transform: translateX(400px);
            transition: var(--transition);
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                // If locomotive-scroll is active, use its scrollTo for consistent behavior
                if (isLocoEnabled && locoScroll && typeof locoScroll.scrollTo === 'function') {
                    // locomotive accepts an element or a selector
                    locoScroll.scrollTo(targetElement, { offset: -headerHeight, duration: 800 });
                } else {
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });
}

// Skill Card Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Parallax Effect for Hero Section (uses locomotive when available)
function handleParallax(scrollY) {
    const scrolled = typeof scrollY === 'number' ? scrollY : getScrollY();
    const parallaxElements = document.querySelectorAll('.particles');

    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// Attach listeners for parallax (native fallback + locomotive)
window.addEventListener('scroll', function() {
    handleParallax(window.pageYOffset || window.scrollY || 0);
});

if (isLocoEnabled && locoScroll && typeof locoScroll.on === 'function') {
    locoScroll.on('scroll', function(obj) {
        handleParallax(obj.scroll.y);
    });
}

// Add floating animation to code block
document.addEventListener('DOMContentLoaded', function() {
    const codeBlock = document.querySelector('.code-block');
    
    if (codeBlock) {
        setInterval(() => {
            codeBlock.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                codeBlock.style.transform = 'translateY(0px)';
            }, 2000);
        }, 4000);
    }
});

// Enhanced mouse animation: inertial cursor follower + pooled ripples + mobile-safe behavior
(function initCursorAndRipples() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;

    // --- Cursor follower & halo ---
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower cursor--hidden';
    const halo = document.createElement('div');
    halo.className = 'cursor-halo cursor--hidden';
    document.body.appendChild(halo);
    document.body.appendChild(cursor);

    let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    let currX = targetX, currY = targetY;
    let cursorVisible = false;
    let cursorScale = 1;

    // lerp loop
    function animateCursor() {
        currX += (targetX - currX) * 0.18;
        currY += (targetY - currY) * 0.18;
        // halo trails a bit more
        halo.style.transform = `translate3d(${currX}px, ${currY}px, 0) translate(-50%, -50%) scale(${1 + (cursorScale-1) * 0.6})`;
        cursor.style.transform = `translate3d(${currX}px, ${currY}px, 0) translate(-50%, -50%) scale(${cursorScale})`;
        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Show/hide helpers
    function showCursor() {
        if (isTouch) return;
        cursor.classList.remove('cursor--hidden');
        halo.classList.remove('cursor--hidden');
        cursorVisible = true;
    }
    function hideCursor() {
        cursor.classList.add('cursor--hidden');
        halo.classList.add('cursor--hidden');
        cursorVisible = false;
    }

    // interactive element hover scaling
    const interactiveSelector = 'a, button, input, textarea, .btn, .nav-link, .project-link, .social-link';

    document.addEventListener('mouseover', (e) => {
        const hit = e.target.closest && e.target.closest(interactiveSelector);
        if (hit) {
            cursorScale = 1.8;
            halo.classList.add('cursor--active');
            cursor.classList.add('cursor--active');
        }
    });
    document.addEventListener('mouseout', (e) => {
        const hit = e.target.closest && e.target.closest(interactiveSelector);
        if (hit) {
            cursorScale = 1;
            halo.classList.remove('cursor--active');
            cursor.classList.remove('cursor--active');
        }
    });

    // Update target on move
    document.addEventListener('mousemove', (e) => {
        if (isTouch) return;
        targetX = e.clientX;
        targetY = e.clientY;
        showCursor();
    }, { passive: true });

    document.addEventListener('mouseleave', hideCursor);
    document.addEventListener('mouseenter', (e) => { if (!isTouch) { targetX = e.clientX; targetY = e.clientY; showCursor(); } });

    // Press feedback
    document.addEventListener('mousedown', () => { cursorScale = 0.85; halo.classList.add('cursor--active'); });
    document.addEventListener('mouseup', () => { cursorScale = 1; halo.classList.remove('cursor--active'); });

    // --- Ripple pool ---
    const POOL_SIZE = 10;
    const ripplePool = [];
    for (let i = 0; i < POOL_SIZE; i++) {
        const el = document.createElement('div');
        el.className = 'ripple';
        el.dataset.busy = '0';
        el.addEventListener('animationend', () => {
            el.classList.remove('ripple--play');
            el.dataset.busy = '0';
            el.style.width = '';
            el.style.height = '';
            el.style.left = '';
            el.style.top = '';
        });
        document.body.appendChild(el);
        ripplePool.push(el);
    }

    function getFreeRipple() {
        for (let r of ripplePool) if (r.dataset.busy === '0') return r;
        return null;
    }

    const MOVE_INTERVAL = 90; // ms
    let lastMove = 0;

    function spawnRipple(x, y, size = 30, duration = 700, large = false) {
        if (isTouch && !large) return; // avoid move ripples on touch devices
        const el = getFreeRipple();
        if (!el) return; // drop if none available
        el.dataset.busy = '1';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        if (large) el.classList.add('ripple--large'); else el.classList.remove('ripple--large');
        el.style.animationDuration = duration + 'ms';
        // force reflow then start
        void el.offsetWidth;
        el.classList.add('ripple--play');
    }

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMove > MOVE_INTERVAL) {
            lastMove = now;
            spawnRipple(e.clientX, e.clientY, 26, 650, false);
        }
    }, { passive: true });

    ['click', 'touchstart'].forEach(evt => {
        document.addEventListener(evt, function (e) {
            let x = 0, y = 0;
            if (e.touches && e.touches[0]) { x = e.touches[0].clientX; y = e.touches[0].clientY; }
            else { x = e.clientX; y = e.clientY; }
            // larger click ripple
            spawnRipple(x, y, 80, 900, true);
        }, { passive: true });
    });

    // hide cursor on small screens
    if (isTouch) hideCursor();

})();

// Performance optimization: debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(function() {
    // Scroll-based animations that don't need to run on every scroll event
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScroll);

// Add Easter egg - Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    // Add some fun effects
    document.body.style.filter = 'hue-rotate(180deg)';
    
    setTimeout(() => {
        document.body.style.filter = 'none';
        alert('🎉 Easter egg activated! Thanks for exploring!');
    }, 2000);
    
    konamiCode = []; // Reset
}