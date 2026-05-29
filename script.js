/**
 * DURAVAL KITCHEN COMBO LANDING PAGE - INTERACTIVE SCRIPTS
 */

document.addEventListener('DOMContentLoaded', function () {

    // --- 1. STICKY HEADER SCROLL EFFECT ---
    // Supabase client initialization (replace with your project URL and anon key)
    const supabaseUrl = 'https://ukurtlghxzzttmiumeck.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdXJ0bGdoeHp6dHRtaXVtZWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NTk2NTcsImV4cCI6MjA5NTUzNTY1N30.lWhmFkNFSZSKN5wCpXpynu02zHTPzrhZ8MfgPhnnB9I';
    const recaptchaSiteKey = '6Lcj0AEtAAAAAATkfYBEtGOnrPGNCWVENoZsY3tp';
    const submitLeadFunctionUrl = 'https://ukurtlghxzzttmiumeck.supabase.co/functions/v1/submit-lead';
    const enableRecaptcha = false; // set true to re-enable
    const isSupabaseConfigured = !supabaseUrl.includes('YOUR_SUPABASE') && !supabaseAnonKey.includes('YOUR_SUPABASE');
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. MOBILE MENU TOGGLE ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navOverlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const floatingCallWidget = document.querySelector('.widget-call[data-phone]');

    if (floatingCallWidget) {
        floatingCallWidget.addEventListener('click', function (e) {
            e.preventDefault();
            const phone = floatingCallWidget.getAttribute('data-phone');
            if (phone) {
                window.location.href = `tel:${phone}`;
            }
        });
    }

    if (menuToggle && navOverlay) {
        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('active');
            navOverlay.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navOverlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
                menuToggle.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // --- 3. SCROLL-SPY & ACTIVE NAVIGATION LINK ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Trigger 150px before entering section
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. TABS SWITCHING (SPECIFICATIONS) ---
    const tabDishRack = document.getElementById('tab-dish-rack');
    const tabLiftSystem = document.getElementById('tab-lift-system');
    const panelDishRack = document.getElementById('dish-rack-specs');
    const panelLiftSystem = document.getElementById('lift-system-specs');

    if (tabDishRack && tabLiftSystem && panelDishRack && panelLiftSystem) {
        tabDishRack.addEventListener('click', function () {
            // Set tabs
            tabDishRack.classList.add('active');
            tabDishRack.setAttribute('aria-selected', 'true');
            tabLiftSystem.classList.remove('active');
            tabLiftSystem.setAttribute('aria-selected', 'false');

            // Toggle panels
            panelDishRack.style.display = 'block';
            panelDishRack.classList.add('active');
            panelLiftSystem.style.display = 'none';
            panelLiftSystem.classList.remove('active');
        });

        tabLiftSystem.addEventListener('click', function () {
            // Set tabs
            tabLiftSystem.classList.add('active');
            tabLiftSystem.setAttribute('aria-selected', 'true');
            tabDishRack.classList.remove('active');
            tabDishRack.setAttribute('aria-selected', 'false');

            // Toggle panels
            panelLiftSystem.style.display = 'block';
            panelLiftSystem.classList.add('active');
            panelDishRack.style.display = 'none';
            panelDishRack.classList.remove('active');
        });
    }

    // --- 5. FORM VALIDATION & MODAL SUCCESS POPUP ---
    const form = document.getElementById('lead-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const userDisplayName = document.getElementById('user-display-name');
    const userDisplayPhone = document.getElementById('user-display-phone');

    // Input fields and error elements
    const fullnameInput = document.getElementById('fullname');
    const phoneInput = document.getElementById('phone');
    const fullnameError = document.getElementById('fullname-error');
    const phoneError = document.getElementById('phone-error');
    const submitBtn = document.getElementById('submit-btn');
    const formStatusMessage = document.getElementById('form-status-message');

    // Helper functions for validation
    function validateName(name) {
        const trimmed = name.trim();
        if (trimmed.length < 2) {
            return "Họ và tên đệm phải có ít nhất 2 ký tự.";
        }
        return "";
    }

    function validatePhone(phone) {
        const trimmed = phone.trim();
        // Regex matches standard Vietnamese phone numbers:
        // Starts with 0 or +84 followed by 9 digits (total 10 digits digits)
        const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
        if (trimmed.length === 0) {
            return "Số điện thoại không được để trống.";
        }
        if (!phoneRegex.test(trimmed)) {
            return "Số điện thoại không đúng định dạng (Ví dụ: 0987654321).";
        }
        return "";
    }

    function showSuccessModal(fullnameVal, phoneVal) {
        if (!successModal) return;
        userDisplayName.textContent = fullnameVal.trim();
        userDisplayPhone.textContent = phoneVal.trim();
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function setFormStatus(message, type) {
        if (!formStatusMessage) return;
        formStatusMessage.textContent = message;
        formStatusMessage.classList.remove('error', 'success');
        if (type) formStatusMessage.classList.add(type);
    }

    async function getRecaptchaToken() {
        if (!window.grecaptcha || !window.grecaptcha.enterprise) {
            throw new Error('reCAPTCHA chưa được cấu hình.');
        }

        await new Promise((resolve) => window.grecaptcha.enterprise.ready(resolve));
        return window.grecaptcha.enterprise.execute(recaptchaSiteKey, { action: 'submit_lead_form' });
    }

    // Clear error class on input event
    fullnameInput.addEventListener('input', function () {
        fullnameInput.parentElement.classList.remove('invalid');
        fullnameError.textContent = "";
    });

    phoneInput.addEventListener('input', function () {
        phoneInput.parentElement.classList.remove('invalid');
        phoneError.textContent = "";
    });

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            setFormStatus('', '');

            const fullnameVal = fullnameInput.value;
            const phoneVal = phoneInput.value;

            let isValid = true;

            // Validate name
            const nameErrorText = validateName(fullnameVal);
            if (nameErrorText) {
                fullnameInput.parentElement.classList.add('invalid');
                fullnameError.textContent = nameErrorText;
                isValid = false;
            } else {
                fullnameInput.parentElement.classList.remove('invalid');
            }

            // Validate phone
            const phoneErrorText = validatePhone(phoneVal);
            if (phoneErrorText) {
                phoneInput.parentElement.classList.add('invalid');
                phoneError.textContent = phoneErrorText;
                isValid = false;
            } else {
                phoneInput.parentElement.classList.remove('invalid');
            }

            // If all validation passes
            if (isValid) {
                if (!isSupabaseConfigured || submitLeadFunctionUrl.includes('YOUR_SUPABASE_PROJECT_REF')) {
                    setFormStatus('Gửi thất bại, thử lại.', 'error');
                    return;
                }

                const submitLabel = submitBtn ? submitBtn.querySelector('span') : null;
                if (submitBtn) submitBtn.disabled = true;
                if (submitLabel) submitLabel.textContent = 'ĐANG GỬI...';

                try {
                    const recaptchaToken = enableRecaptcha ? await getRecaptchaToken() : null;
                    const res = await fetch(submitLeadFunctionUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: fullnameVal.trim(),
                            phone: phoneVal.trim(),
                            cabinet_size: document.getElementById('cabinet-size').value,
                            message: document.getElementById('message').value,
                            recaptchaToken
                        })
                    });

                    if (!res.ok) {
                        const errorPayload = await res.json().catch(() => ({}));
                        console.error('Submit function failed:', errorPayload);
                        setFormStatus('Gửi thất bại, thử lại.', 'error');
                        return;
                    }

                    setFormStatus('', '');
                    showSuccessModal(fullnameVal, phoneVal);
                    form.reset();
                } catch (err) {
                    console.error('Submit error:', err);
                    setFormStatus('Gửi thất bại, thử lại.', 'error');
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                    if (submitLabel) submitLabel.textContent = 'GỬI YÊU CẦU & NHẬN ƯU ĐÃI NGAY';
                }
            }
        });
    }

    // Modal Close Triggers
    if (successModal && closeModalBtn) {
        closeModalBtn.addEventListener('click', function () {
            successModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Unlock scrolling
        });

        // Close on clicking backdrop
        successModal.addEventListener('click', function (e) {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});
