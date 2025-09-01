// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initNavigation();
    initAnimations();
    initFormHandling();
    initInteractiveElements();
    initScrollEffects();
    
    // Mobile Navigation Toggle
    function initNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Animate hamburger bars
                const bars = hamburger.querySelectorAll('.bar');
                bars.forEach((bar, index) => {
                    if (hamburger.classList.contains('active')) {
                        if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                        if (index === 1) bar.style.opacity = '0';
                        if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                    } else {
                        bar.style.transform = 'none';
                        bar.style.opacity = '1';
                    }
                });
            });
            
            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    
                    // Reset hamburger bars
                    const bars = hamburger.querySelectorAll('.bar');
                    bars.forEach(bar => {
                        bar.style.transform = 'none';
                        bar.style.opacity = '1';
                    });
                });
            });
        }
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Navbar background change on scroll
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = 'none';
                }
            });
        }
    }
    
    // Initialize animations
    function initAnimations() {
        // Fade-in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(element => {
            observer.observe(element);
        });
        
        // Animate numbers in stats
        const statNumbers = document.querySelectorAll('.stat-number, .number');
        const numberObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(number => {
            numberObserver.observe(number);
        });
    }
    
    // Animate number counting
    function animateNumber(element) {
        const finalNumber = element.textContent;
        const isPercentage = finalNumber.includes('%');
        const isPlus = finalNumber.includes('+');
        const isK = finalNumber.includes('K');
        
        let numericValue = parseFloat(finalNumber.replace(/[^0-9.]/g, ''));
        let currentValue = 0;
        const increment = numericValue / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(currentValue);
            if (isPercentage) displayValue += '%';
            if (isPlus) displayValue += '+';
            if (isK) displayValue += 'K';
            
            element.textContent = displayValue;
        }, stepTime);
    }
    
    // Initialize form handling
    function initFormHandling() {
        // CTA Button click handlers
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (this.classList.contains('primary')) {
                    // Scroll to research section
                    const researchSection = document.querySelector('#research');
                    if (researchSection) {
                        const offsetTop = researchSection.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                } else if (this.classList.contains('secondary')) {
                    // Show demo modal or video
                    showDemoModal();
                }
            });
        });
        
        // Contact form handling
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const name = formData.get('name');
                const email = formData.get('email');
                const organization = formData.get('organization');
                const service = formData.get('service');
                const message = formData.get('message');
                
                // Enhanced validation
                if (!name || !email || !organization || !service || !message) {
                    showNotification('Please fill in all fields.', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Please enter a valid email address.', 'error');
                    return;
                }
                
                if (name.length < 2) {
                    showNotification('Name must be at least 2 characters long.', 'error');
                    return;
                }
                
                if (message.length < 10) {
                    showNotification('Message must be at least 10 characters long.', 'error');
                    return;
                }
                
                // Simulate form submission
                const submitBtn = this.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;
                
                // Simulate API call with progress
                let progress = 0;
                const progressInterval = setInterval(() => {
                    progress += 20;
                    if (progress >= 100) {
                        clearInterval(progressInterval);
                        showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
                        this.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                }, 400);
            });
        }
        
        // Form field animations
        const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }
    
    // Initialize interactive elements
    function initInteractiveElements() {
        // System card hover effects
        document.querySelectorAll('.system-card, .research-card, .team-member').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Team member social links
        document.querySelectorAll('.social-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.querySelector('i').className.includes('linkedin') ? 'LinkedIn' : 
                               this.querySelector('i').className.includes('twitter') ? 'Twitter' : 
                               this.querySelector('i').className.includes('github') ? 'GitHub' : 'Website';
                showNotification(`Opening ${platform} profile...`, 'info');
            });
        });
        
        // Research features toggle
        document.querySelectorAll('.research-features li').forEach(feature => {
            feature.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });
    }
    
    // Initialize scroll effects
    function initScrollEffects() {
        // Active navigation highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
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
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show demo modal
    function showDemoModal() {
        const modal = document.createElement('div');
        modal.className = 'demo-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Product Demo</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="video-placeholder">
                        <i class="fas fa-play-circle"></i>
                        <p>Demo video would play here</p>
                    </div>
                    <p>Experience our healthcare solutions in action. Contact us for a personalized demo.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.demo-modal').remove()">Close</button>
                    <button class="btn-primary" onclick="document.querySelector('#contact').scrollIntoView({behavior: 'smooth'})">Request Demo</button>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
        
        // Close functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.8)';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }
    
    // Enhanced notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                   type === 'error' ? 'fa-exclamation-circle' : 
                   type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
            font-weight: 500;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate hero elements sequentially
        const heroElements = document.querySelectorAll('.hero .fade-in');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 100); // Reduced from 200ms to 100ms
        });
    });
    
    // Performance optimization: Throttle scroll events
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
    
    // Apply throttling to scroll events for better performance
    const throttledScrollHandler = throttle(function() {
        // Scroll-based animations and effects
    }, 16); // ~60fps
    
    window.addEventListener('scroll', throttledScrollHandler);
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.demo-modal');
            if (modal) {
                modal.remove();
            }
        }
    });
    
    // Add touch support for mobile
    if ('ontouchstart' in window) {
        document.querySelectorAll('.system-card, .research-card, .team-member').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-5px) scale(1.01)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
});

// Add CSS for additional styles
const additionalStyles = `
    .nav-link.active {
        color: #2563eb !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .form-group.focused label {
        color: #2563eb;
        transform: translateY(-20px) scale(0.8);
    }
    
    .research-features li.active {
        color: #2563eb;
        font-weight: 600;
    }
    
    .demo-modal .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .demo-modal .modal-body {
        padding: 1.5rem;
    }
    
    .demo-modal .modal-footer {
        padding: 1.5rem;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    .video-placeholder {
        background: #f1f5f9;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        margin-bottom: 1rem;
    }
    
    .video-placeholder i {
        font-size: 3rem;
        color: #64748b;
        margin-bottom: 1rem;
    }
    
    .btn-primary, .btn-secondary {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: #2563eb;
        color: white;
    }
    
    .btn-secondary {
        background: #f1f5f9;
        color: #64748b;
    }
    
    .btn-primary:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
    }
    
    .btn-secondary:hover {
        background: #e2e8f0;
        transform: translateY(-2px);
    }
    
    body.loaded .hero {
        opacity: 1;
    }
    
    .hero {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
