// Advanced animations and effects
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.initAOS();
        this.initParallax();
        this.initHoverEffects();
        this.initTextAnimations();
        this.initCardAnimations();
    }

    // Initialize AOS-like animations
    initAOS() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.getAttribute('data-aos') || 'fade-up';
                    const delay = element.getAttribute('data-aos-delay') || 0;
                    
                    setTimeout(() => {
                        this.animateElement(element, animationType);
                    }, parseInt(delay));
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe elements with data-aos attributes
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element, type) {
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        switch (type) {
            case 'fade-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
                break;
            case 'fade-down':
                element.style.opacity = '0';
                element.style.transform = 'translateY(-30px)';
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
                break;
            case 'fade-left':
                element.style.opacity = '0';
                element.style.transform = 'translateX(30px)';
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                });
                break;
            case 'fade-right':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-30px)';
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                });
                break;
            case 'zoom-in':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                });
                break;
            case 'zoom-out':
                element.style.opacity = '0';
                element.style.transform = 'scale(1.2)';
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                });
                break;
        }
    }

    // Parallax effects
    initParallax() {
        const parallaxElements = document.querySelectorAll('.hero::before');
        
        window.addEventListener('scroll', utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
            });
        }, 16));
    }

    // Enhanced hover effects
    initHoverEffects() {
        // Policy cards
        document.querySelectorAll('.policy-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e.target, e);
            });
        });

        // Team members
        document.querySelectorAll('.team-member').forEach(member => {
            member.addEventListener('mouseenter', () => {
                this.animateTeamMember(member);
            });
        });

        // CTA buttons
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createButtonRipple(e);
            });
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 68, 68, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    animateTeamMember(member) {
        const avatar = member.querySelector('.team-avatar');
        if (avatar) {
            avatar.style.animation = 'none';
            avatar.offsetHeight; // Trigger reflow
            avatar.style.animation = 'avatar-pulse 0.5s ease-out, rotate-border 4s linear infinite';
        }
    }

    createButtonRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: buttonRipple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Text animations
    initTextAnimations() {
        this.typewriterEffect();
        this.glitchEffect();
    }

    typewriterEffect() {
        const elements = document.querySelectorAll('[data-typewriter]');
        
        elements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.getAttribute('data-speed')) || 100;
            element.textContent = '';
            
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, speed);
        });
    }

    glitchEffect() {
        const glitchElements = document.querySelectorAll('[data-glitch]');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.animation = 'glitch 0.3s ease-in-out';
                setTimeout(() => {
                    element.style.animation = '';
                }, 300);
            });
        });
    }

    // Card animations
    initCardAnimations() {
        const cards = document.querySelectorAll('.policy-card, .team-member');
        
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Intersection observer for staggered animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'cardSlideIn 0.6s ease-out forwards';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(card);
        });
    }
}

// Particle system for enhanced background
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.container.appendChild(this.canvas);
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.x -= dx * 0.01;
                particle.y -= dy * 0.01;
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 68, 68, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes buttonRipple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes cardSlideIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
    }
    
    .loading {
        opacity: 0;
        transform: translateY(20px);
    }
    
    .loaded .loading {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.6s ease-out;
    }
`;
document.head.appendChild(style);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
    
    // Initialize particle system for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new ParticleSystem(heroSection);
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationController, ParticleSystem };
}