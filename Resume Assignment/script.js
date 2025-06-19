document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initModal();
    initSmoothScrolling();
    initTypingAnimation();
    initParallaxEffect();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger skill bars animation when skills section is visible
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                
                // Trigger typing animation when about section is visible
                if (entry.target.id === 'about') {
                    startTypingAnimation();
                }
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
    
    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
    // This will be triggered by scroll animation
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, Math.random() * 500); // Stagger the animations
    });
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
    // Will be triggered by scroll
}

function startTypingAnimation() {
    const subtitle = document.querySelector('.hero .subtitle');
    if (subtitle && !subtitle.classList.contains('typed')) {
        subtitle.classList.add('typed');
        typeWriter(subtitle, subtitle.textContent, 100);
    }
}

function typeWriter(element, text, speed) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(form)) {
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            loading.style.display = 'inline-block';
            
            // Simulate form submission
            setTimeout(() => {
                // Reset form
                form.reset();
                clearFormErrors(form);
                
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                loading.style.display = 'none';
                
                // Show success modal
                showModal();
            }, 2000);
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.parentElement.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input, textarea');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const formGroup = field.parentElement;
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    
    // Remove existing error state
    formGroup.classList.remove('error');
    
    let isValid = true;
    
    // Check if field is empty
    if (!fieldValue) {
        showFieldError(formGroup, `Please enter your ${fieldName}`);
        isValid = false;
    } else {
        // Specific validations
        switch (fieldName) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fieldValue)) {
                    showFieldError(formGroup, 'Please enter a valid email address');
                    isValid = false;
                }
                break;
            case 'name':
                if (fieldValue.length < 2) {
                    showFieldError(formGroup, 'Name must be at least 2 characters');
                    isValid = false;
                }
                break;
            case 'message':
                if (fieldValue.length < 10) {
                    showFieldError(formGroup, 'Message must be at least 10 characters');
                    isValid = false;
                }
                break;
        }
    }
    
    return isValid;
}

function showFieldError(formGroup, message) {
    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFormErrors(form) {
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
    });
}

// ===== MODAL FUNCTIONALITY =====
function initModal() {
    const modal = document.getElementById('successModal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', hideModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            hideModal();
        }
    });
}

function showModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Auto-hide after 5 seconds
    setTimeout(hideModal, 5000);
}

function hideModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ===== PARALLAX EFFECT =====
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = hero.querySelector('.hero-content');
        const speed = scrolled * 0.5;
        
        if (parallax) {
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
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
}

// ===== LOADING ANIMATION =====
window.addEventListener('load', function() {
    // Hide any loading screens
    document.body.classList.add('loaded');
    
    // Start initial animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero h1, .hero .subtitle, .hero p, .cta-button');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
});

// ===== PERFORMANCE OPTIMIZATIONS =====

// Optimize scroll events
const optimizedScrollHandler = throttle(function() {
    // Handle scroll-based animations here if needed
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Tab key navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

// Focus management for modal
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// ===== EASTER EGGS AND ENHANCEMENTS =====

// Konami code easter egg
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Add some fun animation or effect
    document.body.style.animation = 'rainbow 2s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
    
    console.log('🎉 You found the Easter egg! Sedem appreciates your curiosity!');
}


// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        validateField,
        debounce,
        throttle
    };
}