document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Theme Configuration (Dark Mode)
    // ----------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        body.classList.remove('dark-mode');
        updateThemeIcon(false);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }
    
    function updateThemeIcon(isDark) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.className = 'bi bi-sun';
            themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
            icon.className = 'bi bi-moon-stars';
            themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
        }
    }

    // ----------------------------------------------------
    // 2. Text Direction (RTL Toggle)
    // ----------------------------------------------------
    const rtlToggle = document.getElementById('rtl-toggle');
    const htmlElement = document.documentElement;
    
    // Check localStorage for saved direction preference
    const savedDir = localStorage.getItem('dir');
    if (savedDir === 'rtl') {
        htmlElement.setAttribute('dir', 'rtl');
        updateRtlIcon(true);
    } else {
        htmlElement.setAttribute('dir', 'ltr');
        updateRtlIcon(false);
    }
    
    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const currentDir = htmlElement.getAttribute('dir');
            const isRtl = currentDir === 'rtl';
            const newDir = isRtl ? 'ltr' : 'rtl';
            
            htmlElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateRtlIcon(!isRtl);
            
            // Reload slider or map layout adjustments if needed
            window.dispatchEvent(new Event('resize'));
        });
    }
    
    function updateRtlIcon(isRtl) {
        if (!rtlToggle) return;
        let icon = rtlToggle.querySelector('i');
        if (!icon) {
            // Create icon if it doesn't exist
            icon = document.createElement('i');
            rtlToggle.textContent = '';
            rtlToggle.appendChild(icon);
        }
        icon.className = 'bi bi-arrow-left-right';
        if (isRtl) {
            rtlToggle.setAttribute('aria-label', 'Switch to Left to Right Layout');
        } else {
            rtlToggle.setAttribute('aria-label', 'Switch to Right to Left Layout');
        }
    }

    // ----------------------------------------------------
    // 3. Sticky Header Scroll Effect
    // ----------------------------------------------------
    const header = document.querySelector('.premium-nav');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ----------------------------------------------------
    // 4. Scroll Reveal Animations (Intersection Observer)
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        revealElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    // ----------------------------------------------------
    // 5. Before/After Image Comparison Slider
    // ----------------------------------------------------
    const sliders = document.querySelectorAll('.ba-slider-container');
    
    sliders.forEach(slider => {
        const afterImg = slider.querySelector('.ba-after');
        const handle = slider.querySelector('.ba-handle');
        let isDragging = false;
        
        const updateSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            const width = rect.width;
            let x = clientX - rect.left;
            
            // Adjust coordinates if RTL
            const isRtl = htmlElement.getAttribute('dir') === 'rtl';
            if (isRtl) {
                x = width - x;
            }
            
            // Boundary checks
            if (x < 0) x = 0;
            if (x > width) x = width;
            
            const percentage = (x / width) * 100;
            
            if (isRtl) {
                afterImg.style.width = `${100 - percentage}%`;
                handle.style.right = `${percentage}%`;
                handle.style.left = 'auto';
            } else {
                afterImg.style.width = `${percentage}%`;
                handle.style.left = `${percentage}%`;
            }
        };
        
        // Mouse Events
        handle.addEventListener('mousedown', () => {
            isDragging = true;
            handle.classList.add('dragging');
        });
        
        window.addEventListener('mouseup', () => {
            isDragging = false;
            handle.classList.remove('dragging');
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });
        
        // Touch Events (Mobile Support)
        handle.addEventListener('touchstart', () => {
            isDragging = true;
        }, { passive: true });
        
        window.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientX);
        }, { passive: true });
        
        // Recalculate on window resize to ensure correct bounds
        window.addEventListener('resize', () => {
            const rect = slider.getBoundingClientRect();
            // Reset to 50% on large size changes
            const isRtl = htmlElement.getAttribute('dir') === 'rtl';
            afterImg.style.width = '50%';
            if (isRtl) {
                handle.style.right = '50%';
                handle.style.left = 'auto';
            } else {
                handle.style.left = '50%';
                handle.style.right = 'auto';
            }
        });
    });

    // ----------------------------------------------------
    // 6. Custom Client-Side Form Validation
    // ----------------------------------------------------
    const forms = document.querySelectorAll('.needs-validation-custom');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                const feedback = input.nextElementSibling;
                const hasFeedback = feedback && feedback.classList.contains('invalid-feedback-custom');
                
                if (!input.value.trim() || (input.type === 'email' && !validateEmail(input.value)) || (input.type === 'tel' && !validatePhone(input.value))) {
                    input.classList.add('is-invalid');
                    if (hasFeedback) {
                        feedback.style.display = 'block';
                    }
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                    if (hasFeedback) {
                        feedback.style.display = 'none';
                    }
                }
            });
            
            if (isValid) {
                // Form is valid - trigger luxury success response
                const submitBtn = form.querySelector('[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>SECURES SENDING...';
                
                setTimeout(() => {
                    // Success display
                    form.reset();
                    inputs.forEach(input => {
                        input.classList.remove('is-valid');
                    });
                    
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'MESSAGE SENT SUCCESSFULLY';
                    
                    // Show a toast or feedback alert
                    const alertContainer = document.createElement('div');
                    alertContainer.className = 'alert alert-success mt-4 border-0 rounded-0 bg-transparent text-center';
                    alertContainer.style.borderLeft = '3px solid var(--secondary-color)';
                    alertContainer.innerHTML = `
                        <h5 class="fw-bold text-success mb-1">Message Received</h5>
                        <p class="small mb-0 text-secondary">Thank you. My expertise is at your disposal. I will review your inquiry and contact you within 24 business hours.</p>
                    `;
                    form.appendChild(alertContainer);
                    
                    setTimeout(() => {
                        alertContainer.remove();
                        submitBtn.textContent = originalText;
                    }, 5000);
                    
                }, 1500);
            }
        });
    });
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    function validatePhone(phone) {
        // Simple numeric phone validation
        const re = /^[\d\s()+\-]{7,20}$/;
        return re.test(String(phone));
    }

    // ----------------------------------------------------
    // 7. Business Opening Status Indicator
    // ----------------------------------------------------
    const statusIndicator = document.getElementById('business-status');
    if (statusIndicator) {
        const checkBusinessHours = () => {
            const now = new Date();
            const day = now.getDay(); // 0 = Sunday, 1 = Monday...
            const hours = now.getHours();
            
            // Assume Open Monday - Friday 8 AM - 6 PM, Saturday 9 AM - 4 PM, Sunday Closed
            let isOpen = false;
            
            if (day >= 1 && day <= 5) {
                if (hours >= 8 && hours < 18) isOpen = true;
            } else if (day === 6) {
                if (hours >= 9 && hours < 16) isOpen = true;
            }
            
            if (isOpen) {
                statusIndicator.innerHTML = '<span class="badge bg-success rounded-0 p-2"><i class="bi bi-circle-fill me-1 small"></i> Currently Open</span>';
            } else {
                statusIndicator.innerHTML = '<span class="badge bg-danger rounded-0 p-2"><i class="bi bi-circle-fill me-1 small"></i> Currently Closed</span>';
            }
        };
        checkBusinessHours();
    }

    // ----------------------------------------------------
    // 8. Gallery Filtering
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.parentElement.style.display = 'block';
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.transform = 'scale(0.8)';
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.parentElement.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ----------------------------------------------------
    // 9. Countdown Timer (Coming Soon Page)
    // ----------------------------------------------------
    const countdown = document.getElementById('countdown-timer');
    if (countdown) {
        // Set date: 30 days from now
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;
            
            if (difference < 0) {
                countdown.innerHTML = "<h4>We are online. Enjoy our luxury maintenance services!</h4>";
                return;
            }
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        };
        
        setInterval(updateTimer, 1000);
        updateTimer();
    }

    // ----------------------------------------------------
    // 10. Dynamic Copyright Year
    // ----------------------------------------------------
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // ----------------------------------------------------
    // 11. Back to Top Button Behavior
    // ----------------------------------------------------
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
