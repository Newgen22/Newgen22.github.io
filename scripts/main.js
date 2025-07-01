// Main JavaScript functionality
class NewGenWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createBackgroundAnimation();
        this.initScrollProgress();
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initContactForm();
        this.initBackToTop();
        this.initCounters();
    }

    setupEventListeners() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('load', this.handleLoad.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleScroll() {
        this.updateScrollProgress();
        this.updateNavbar();
        this.updateBackToTop();
    }

    handleLoad() {
        this.animateOnLoad();
    }

    handleResize() {
        this.updateBackgroundAnimation();
    }

    // Background Animation
    createBackgroundAnimation() {
        const bgAnimation = document.getElementById('bgAnimation');
        
        // Create particles
        for (let i = 0; i < 20; i++) {
            this.createParticle(bgAnimation);
        }

        // Create glow orbs
        for (let i = 0; i < 5; i++) {
            this.createGlowOrb(bgAnimation);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * window.innerWidth;
        const delay = Math.random() * 15;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}px`;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                this.createParticle(container);
            }
        }, 15000 + delay * 1000);
    }

    createGlowOrb(container) {
        const orb = document.createElement('div');
        orb.className = 'glow-orb';
        
        const size = Math.random() * 100 + 50;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const delay = Math.random() * 4;
        
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        orb.style.left = `${x}px`;
        orb.style.top = `${y}px`;
        orb.style.animationDelay = `${delay}s`;
        
        container.appendChild(orb);
    }

    updateBackgroundAnimation() {
        const bgAnimation = document.getElementById('bgAnimation');
        const orbs = bgAnimation.querySelectorAll('.glow-orb');
        
        orbs.forEach(orb => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            orb.style.left = `${x}px`;
            orb.style.top = `${y}px`;
        });
    }

    // Scroll Progress
    initScrollProgress() {
        this.scrollProgress = document.getElementById('scrollProgress');
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (this.scrollProgress) {
            this.scrollProgress.style.width = `${scrollPercent}%`;
        }
    }

    // Navbar
    updateNavbar() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Mobile Menu
    initMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const navLinks = document.getElementById('navLinks');
        
        if (mobileMenu && navLinks) {
            mobileMenu.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close menu when clicking on links
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        }
    }

    // Smooth Scrolling
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contactForm');
        const messageDiv = document.getElementById('formMessage');
        
        if (form && messageDiv) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form, messageDiv);
            });
        }
    }

    handleFormSubmit(form, messageDiv) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateForm(data)) {
            this.showMessage(messageDiv, 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            return;
        }

        // Simulate form submission
        this.showMessage(messageDiv, 'กำลังส่งข้อความ...', 'info');
        
        setTimeout(() => {
            this.showMessage(messageDiv, 'ส่งข้อความเรียบร้อยแล้ว ขอบคุณสำหรับข้อเสนอแนะ!', 'success');
            form.reset();
        }, 2000);
    }

    validateForm(data) {
        return data.name && data.email && data.subject && data.message;
    }

    showMessage(messageDiv, text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    // Back to Top Button
    initBackToTop() {
        this.backToTopBtn = document.getElementById('backToTop');
        
        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    updateBackToTop() {
        if (this.backToTopBtn) {
            if (window.scrollY > 300) {
                this.backToTopBtn.classList.add('visible');
            } else {
                this.backToTopBtn.classList.remove('visible');
            }
        }
    }

    // Counter Animation
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);

        element.style.animation = 'countUp 0.5s ease-out';
    }

    // Load animations
    animateOnLoad() {
        // Add any additional load animations here
        document.body.classList.add('loaded');
    }
}

// Utility functions
const utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewGenWebsite();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NewGenWebsite, utils };
}