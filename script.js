// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupScrollEffects();
    setupContactForm();
    setupModal();
    smoothScrollLinks();
});

// Navigation and scroll behavior
function setupNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
        highlightActiveSection();
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.toggle('active', 
                link.getAttribute('href') === `#${current}`);
        });
    }
}

// Smooth scrolling for anchor links
function smoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations and effects
function setupScrollEffects() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger specific animations
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    // Observe elements for animation
    document.querySelectorAll('.fade-in, section').forEach(el => {
        observer.observe(el);
    });
}

function animateSkillBars() {
    document.querySelectorAll('.skill-progress').forEach((bar, index) => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, index * 100);
    });
}

// Contact form handling
function setupContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Live validation
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.parentElement.classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        // Show loading state
        const btnText = submitBtn.querySelector('.btn-text');
        const loading = submitBtn.querySelector('.loading');
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        loading.style.display = 'inline-block';
        
        // Simulate submission
        setTimeout(() => {
            form.reset();
            clearErrors();
            resetButton();
            showSuccessModal();
        }, 2000);
    }
    
    function validateForm() {
        const fields = form.querySelectorAll('input, textarea');
        return Array.from(fields).every(field => validateField(field));
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const group = field.parentElement;
        
        group.classList.remove('error');
        
        if (!value) {
            showError(group, `Please enter your ${field.name}`);
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && !isValidEmail(value)) {
            showError(group, 'Please enter a valid email address');
            return false;
        }
        
        // Length checks
        if (field.name === 'name' && value.length < 2) {
            showError(group, 'Name too short');
            return false;
        }
        
        if (field.name === 'message' && value.length < 10) {
            showError(group, 'Message too short');
            return false;
        }
        
        return true;
    }
    
    function showError(group, message) {
        group.classList.add('error');
        const errorEl = group.querySelector('.error-message');
        if (errorEl) errorEl.textContent = message;
    }
    
    function clearErrors() {
        form.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
        });
    }
    
    function resetButton() {
        const btnText = submitBtn.querySelector('.btn-text');
        const loading = submitBtn.querySelector('.loading');
        
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        loading.style.display = 'none';
    }
}

// Modal functionality
function setupModal() {
    const modal = document.getElementById('successModal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            hideModal();
        }
    });
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(hideModal, 5000);
}

function hideModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Utility functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Page load animations
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    const heroElements = document.querySelectorAll('.hero h1, .hero .subtitle, .hero p, .cta-button');
    heroElements.forEach((el, i) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, i * 200);
    });
});

// Fun easter egg - because why not?
let keys = [];
document.addEventListener('keydown', (e) => {
    keys.push(e.key);
    if (keys.length > 10) keys.shift();
    
    if (keys.join('').includes('sedem')) {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 2000);
        keys = [];
        console.log('🎨 Nice! You found my little secret!');
    }
});
