// CashKey Property Group - Main JavaScript Functionality
// Lead generation and interactive components

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLeadCaptureForm();
    initPropertyCalculator();
    initAnimations();
    initTestimonialCarousel();
    initScrollEffects();
    initMobileMenu();
    
    // Lead capture form functionality
    function initLeadCaptureForm() {
        const form = document.getElementById('lead-capture-form');
        if (!form) return;
        
        let currentStep = 1;
        const totalSteps = 3;
        
        // Step navigation
        window.nextStep = function() {
            if (currentStep < totalSteps) {
                document.getElementById(`step-${currentStep}`).classList.add('hidden');
                currentStep++;
                document.getElementById(`step-${currentStep}`).classList.remove('hidden');
                updateProgressBar();
            }
        };
        
        window.prevStep = function() {
            if (currentStep > 1) {
                document.getElementById(`step-${currentStep}`).classList.add('hidden');
                currentStep--;
                document.getElementById(`step-${currentStep}`).classList.remove('hidden');
                updateProgressBar();
            }
        };
        
        function updateProgressBar() {
            const progress = (currentStep / totalSteps) * 100;
            const progressBar = document.querySelector('.progress-fill');
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        }
        
        // Form validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidationError);
        });
        
        function validateField(e) {
            const field = e.target;
            const value = field.value.trim();
            
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            let isValid = true;
            let errorMessage = '';
            
            // Required field validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            
            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }
            
            // Phone validation
            if (field.type === 'tel' && value) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
            }
            
            if (!isValid) {
                field.classList.add('border-red-500');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message text-red-500 text-sm mt-1';
                errorDiv.textContent = errorMessage;
                field.parentNode.appendChild(errorDiv);
            } else {
                field.classList.remove('border-red-500');
            }
            
            return isValid;
        }
        
        function clearValidationError(e) {
            const field = e.target;
            field.classList.remove('border-red-500');
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields in current step
            const currentStepFields = document.getElementById(`step-${currentStep}`).querySelectorAll('input, select, textarea');
            let allValid = true;
            
            currentStepFields.forEach(field => {
                if (!validateField({target: field})) {
                    allValid = false;
                }
            });
            
            if (allValid) {
                if (currentStep < totalSteps) {
                    nextStep();
                } else {
                    submitForm();
                }
            }
        });
        
        function submitForm() {
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="animate-spin">⏳</span> Processing...';
            
            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                showSuccessMessage();
                form.reset();
                currentStep = 1;
                document.getElementById('step-2').classList.add('hidden');
                document.getElementById('step-3').classList.add('hidden');
                document.getElementById('step-1').classList.remove('hidden');
                updateProgressBar();
                submitButton.disabled = false;
                submitButton.innerHTML = 'Get My Cash Offer';
            }, 2000);
        }
        
        function showSuccessMessage() {
            const successDiv = document.createElement('div');
            successDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            successDiv.innerHTML = `
                <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
                    <div class="text-green-500 text-6xl mb-4">✓</div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Thank You!</h3>
                    <p class="text-gray-600 mb-6">We've received your information and will contact you within 24 hours with your cash offer.</p>
                    <button onclick="this.parentElement.parentElement.remove()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Close
                    </button>
                </div>
            `;
            document.body.appendChild(successDiv);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (successDiv.parentElement) {
                    successDiv.remove();
                }
            }, 5000);
        }
    }
    
    // Property evaluation calculator
    function initPropertyCalculator() {
        const calculator = document.getElementById('property-calculator');
        if (!calculator) return;
        
        const sliders = calculator.querySelectorAll('input[type="range"]');
        const resultDisplay = calculator.querySelector('.calculation-result');
        
        sliders.forEach(slider => {
            slider.addEventListener('input', updateCalculation);
        });
        
        function updateCalculation() {
            const sqft = parseInt(document.getElementById('sqft').value) || 0;
            const bedrooms = parseInt(document.getElementById('bedrooms').value) || 0;
            const bathrooms = parseInt(document.getElementById('bathrooms').value) || 0;
            const condition = parseInt(document.getElementById('condition').value) || 1;
            
            // Simplified calculation (replace with actual algorithm)
            const basePricePerSqft = 120;
            let estimatedValue = sqft * basePricePerSqft;
            
            // Adjust for bedrooms/bathrooms
            estimatedValue += (bedrooms * 10000) + (bathrooms * 5000);
            
            // Adjust for condition (1=poor, 5=excellent)
            const conditionMultiplier = [0.6, 0.7, 0.8, 0.9, 1.0];
            estimatedValue *= conditionMultiplier[condition - 1];
            
            // Cash offer is typically 70-80% of estimated value
            const cashOffer = estimatedValue * 0.75;
            
            if (resultDisplay) {
                resultDisplay.innerHTML = `
                    <div class="text-center p-6 bg-green-50 rounded-lg">
                        <h4 class="text-lg font-semibold text-gray-800 mb-2">Estimated Cash Offer</h4>
                        <div class="text-3xl font-bold text-green-600 mb-2">$${Math.round(cashOffer).toLocaleString()}</div>
                        <p class="text-sm text-gray-600">Based on ${sqft.toLocaleString()} sq ft, ${bedrooms} bed, ${bathrooms} bath</p>
                        <p class="text-xs text-gray-500 mt-2">*Actual offer may vary based on location and market conditions</p>
                    </div>
                `;
            }
        }
        
        // Initialize calculation on page load
        updateCalculation();
    }
    
    // Animation initialization
    function initAnimations() {
        // Typewriter effect for hero headline
        const heroHeadline = document.getElementById('hero-headline');
        if (heroHeadline && typeof Typed !== 'undefined') {
            new Typed('#hero-headline', {
                strings: [
                    'Sell Your House Fast for Cash',
                    'Get a Fair Cash Offer Today',
                    'Skip the Hassle, Sell to CashKey'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
        
        // Animated counters
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(counter);
        });
    }
    
    // Testimonial carousel
    function initTestimonialCarousel() {
        const carousel = document.getElementById('testimonial-carousel');
        if (!carousel || typeof Splide === 'undefined') return;
        
        new Splide('#testimonial-carousel', {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            arrows: true,
            pagination: true,
            gap: '2rem',
            breakpoints: {
                768: {
                    perPage: 1,
                }
            }
        }).mount();
    }
    
    // Scroll effects
    function initScrollEffects() {
        // Reveal animations on scroll
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Mobile menu functionality
    function initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuButton.querySelector('svg');
                icon.classList.toggle('rotate-45');
            });
        }
    }
    
    // Utility functions
    window.showComingSoon = function() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
                <h3 class="text-2xl font-bold text-gray-800 mb-4">Coming Soon!</h3>
                <p class="text-gray-600 mb-6">This feature is currently in development. Please check back soon or contact us directly.</p>
                <button onclick="this.parentElement.parentElement.remove()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Close
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    };
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .progress-fill {
        transition: width 0.3s ease-in-out;
    }
    
    .hover-lift {
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    
    .hover-lift:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
`;
document.head.appendChild(style);