// CashKey Property Group - Main JavaScript Functionality
// Lead generation and interactive components

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavOffset();
    initLeadCaptureForm();
    initPropertyCalculator();
    initAnimations();
    initTestimonialCarousel();
    initScrollEffects();
    initMobileMenu();

    // Keep page content from sliding under the fixed header.
    // Sets the CSS variable --nav-offset based on the actual nav height.
    function initNavOffset() {
        const nav = document.getElementById('site-nav') || document.querySelector('nav.fixed, nav.sticky');
        if (!nav) return;

        const setOffset = () => {
            document.documentElement.style.setProperty('--nav-offset', nav.offsetHeight + 'px');
        };

        setOffset();
        window.addEventListener('resize', setOffset);
        window.addEventListener('orientationchange', setOffset);

        // Update when nav height changes (e.g., mobile menu expands)
        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => setOffset());
            ro.observe(nav);
        }

        const mobileBtn = document.getElementById('mobile-menu-button');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => setTimeout(setOffset, 50));
        }
    }
    
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
            const sqftEl = document.getElementById('sqft');
            const bedroomsEl = document.getElementById('bedrooms');
            const bathroomsEl = document.getElementById('bathrooms');
            const conditionEl = document.getElementById('condition');

            const sqft = parseInt(sqftEl?.value, 10) || 0;
            const bedrooms = parseInt(bedroomsEl?.value, 10) || 0;
            const bathrooms = parseFloat(bathroomsEl?.value) || 0;
            const condition = parseInt(conditionEl?.value, 10) || 3;

            // Update UI value labels
            const sqftValue = document.getElementById('sqft-value');
            const bedroomsValue = document.getElementById('bedrooms-value');
            const bathroomsValue = document.getElementById('bathrooms-value');
            const conditionValue = document.getElementById('condition-value');

            if (sqftValue) sqftValue.textContent = sqft.toLocaleString();
            if (bedroomsValue) bedroomsValue.textContent = bedrooms.toString();
            if (bathroomsValue) bathroomsValue.textContent = bathrooms % 1 === 0 ? bathrooms.toString() : bathrooms.toFixed(1);

            const conditionLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
            const conditionLabel = conditionLabels[Math.max(1, Math.min(5, condition)) - 1];
            if (conditionValue) conditionValue.textContent = conditionLabel;

            // Tuned estimator logic (simple, realistic, and easy to explain)
            // 1) Estimate a market value baseline using a conservative price-per-sq-ft.
            // 2) Adjust for beds/baths.
            // 3) Apply a condition factor (repair/updatedness proxy).
            // 4) Apply a cash-offer factor (discount for speed, convenience, risk, and closing costs).

            // NOTE: We keep this intentionally conservative to avoid over-promising.
            // If you want market-specific accuracy later, we can add a simple zip/city multiplier.
            const basePricePerSqft = 90; // conservative baseline
            const bedAdjustment = 200;
            const bathAdjustment = 1500;

            let marketEstimate = (sqft * basePricePerSqft) + (bedrooms * bedAdjustment) + (bathrooms * bathAdjustment);

            // Condition factor (1=poor ... 5=excellent)
            const conditionFactor = [0.55, 0.65, 0.75, 0.84, 0.90][Math.max(1, Math.min(5, condition)) - 1];
            marketEstimate *= conditionFactor;

            // Cash offer factor (discount for speed & repairs)
            const cashFactor = [0.52, 0.55, 0.57, 0.60, 0.62][Math.max(1, Math.min(5, condition)) - 1];
            const cashOffer = marketEstimate * cashFactor;

            // Display a small range to reflect market variability
            const offerLow = Math.max(0, Math.round(cashOffer * 0.94));
            const offerHigh = Math.max(0, Math.round(cashOffer * 1.00));

            if (resultDisplay) {
                resultDisplay.innerHTML = `
                    <div class="text-center p-6 bg-green-50 rounded-lg">
                        <h4 class="text-lg font-semibold text-gray-800 mb-2">Estimated Cash Offer Range</h4>
                        <div class="text-3xl font-bold text-green-600 mb-2">$${offerLow.toLocaleString()} – $${offerHigh.toLocaleString()}</div>
                        <p class="text-sm text-gray-600">Based on ${sqft.toLocaleString()} sq ft, ${bedrooms} bed, ${bathrooms % 1 === 0 ? bathrooms : bathrooms.toFixed(1)} bath • Condition: ${conditionLabel}</p>
                        <p class="text-xs text-gray-500 mt-2">*This is an estimate only. Your exact offer depends on location, repairs, and local market conditions.</p>
                    </div>
                `;
            }
        }

        // Initialize calculation on page load
        updateCalculation();
    }

    // Subtle, professional animations (no typing/bounce)
    function initAnimations() {
        // One-time hero headline fade-in
        const heroHeadline = document.getElementById('hero-headline');
        if (heroHeadline) {
            heroHeadline.classList.add('hero-fade-in');
        }

        // Animated counters (start when visible)
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const duration = 1600;
            const steps = duration / 16;
            const increment = target / steps;
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

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

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

    .hero-fade-in {
        animation: heroFadeIn 0.7s ease-out both;
    }

    @keyframes heroFadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

`;
document.head.appendChild(style);
