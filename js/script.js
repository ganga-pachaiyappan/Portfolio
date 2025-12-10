/*==================== toggle icon navbar ====================*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};


/*==================== scroll sections active link ====================*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };

    });

    /*==================== sticky navbar ====================*/

    let header = document.querySelector('header');

    header.classList.toggle('sticky',window.scrollY > 100)

    /*==================== remove toggle icon and navbar when click navbar link (scroll) ====================*/
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};


/*==================== scroll reveal ====================*/
ScrollReveal({
// reset:true,
distance: '80px',
duration: 500,
delay: 10
});
ScrollReveal().reveal('.home-content, .heading',{ origin:'top'});
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form, .technical-skills, .professional-skills',{ origin:'bottom'});
ScrollReveal().reveal('.home-content h1, .about-img ',{ origin:'left'});
ScrollReveal().reveal('.home-content p, .about-content ',{ origin:'right'});


/*==================== typed js ====================*/

const typed = new Typed('.multiple-text',{
    strings:['Web Developer','IoT Engineer','Frontend Developer'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});


// Contact form toggle - show/hide using classes to enable smooth transition
const contactBtn = document.querySelector('.contact-btn');
const contactSection = document.querySelector('.contact');
const contactTitle = contactSection.querySelector('h2');
const navAnchors = document.querySelectorAll('.navbar a');

// ensure contact overlay is closed on load
document.addEventListener('DOMContentLoaded', () => {
    closeContact();
    // if page loaded with #contact hash, remove it (optional) so it's not visible
    if(window.location.hash === '#contact'){
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
});

function openContact() {
    contactSection.classList.add('active');
    document.body.classList.add('no-scroll');
    document.body.classList.add('overlay-active');
    toggleFocus(true);
    // ensure mobile navbar is closed when contact is opened
    if(typeof navbar !== 'undefined'){
        navbar.classList.remove('active');
    }
    if(typeof menuIcon !== 'undefined'){
        menuIcon.classList.remove('bx-x');
    }
}

function closeContact() {
    contactSection.classList.remove('active');
    document.body.classList.remove('no-scroll');
    document.body.classList.remove('overlay-active');
    toggleFocus(false);
}

// disable/enable keyboard focus for all page elements except the contact form
const focusableSelectors = 'a, button, input, textarea, select, [tabindex]';
function toggleFocus(disable){
    document.querySelectorAll(focusableSelectors).forEach((el) => {
        // skip elements inside the contact modal itself
        if(contactSection.contains(el)) return;

        if(disable){
            // store existing tabindex if present
            if(el.hasAttribute('tabindex')){
                el.setAttribute('data-previous-tabindex', el.getAttribute('tabindex'));
            }
            el.setAttribute('tabindex','-1');
            el.setAttribute('aria-hidden','true');
            el.dataset._inerted = 'true';
        } else {
            if(el.dataset._inerted){
                if(el.hasAttribute('data-previous-tabindex')){
                    el.setAttribute('tabindex', el.getAttribute('data-previous-tabindex'));
                    el.removeAttribute('data-previous-tabindex');
                } else {
                    el.removeAttribute('tabindex');
                }
                el.removeAttribute('aria-hidden');
                delete el.dataset._inerted;
            }
        }
    });
}

// open on click
contactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openContact();
});

// close on clicking outside the form (overlay)
contactSection.addEventListener('click', (e) => {
    if(e.target === contactSection){
        closeContact();
    }
});

// close on esc
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && contactSection.classList.contains('active')){
        closeContact();
    }
});

// Navigator links: when a link is clicked, close the contact overlay unless it was the contact btn itself
navAnchors.forEach(link => {
    link.addEventListener('click', (e) => {
        // if link is the contact button (open contact), let it open instead
        if(link.classList.contains('contact-btn')){
            // do nothing here - contactBtn already handles opening
            return;
        }
        // Any other nav click should close the contact overlay if it's open
        if(contactSection.classList.contains('active')){
            closeContact();
        }
    });
});

// Match resume button width to the icons group and ensure text fits
const resumeBtn = document.querySelector('.home-content .resume');
const socialMedia = document.querySelector('.home-content .social-media');

function syncResumeToSocial(){
    if(!resumeBtn || !socialMedia) return;
    // Temporarily reset to measure text width
    resumeBtn.style.width = 'auto';
    resumeBtn.style.minWidth = '0';
    // Measure the content width of the button (including padding)
    const contentWidth = resumeBtn.scrollWidth + 24; // buffer for padding

    // compute the icons total width (excluding resume button)
    const icons = Array.from(socialMedia.querySelectorAll('a')).filter(a => a !== resumeBtn);
    let iconsWidth = 0;
    icons.forEach(icon => {
        const w = icon.offsetWidth;
        const mr = parseFloat(getComputedStyle(icon).marginRight) || 0;
        iconsWidth += (w + mr);
    });
    // fallback: if no icons found, use the container width
    if(iconsWidth <= 0){
        iconsWidth = socialMedia.offsetWidth;
    }

    // Ensure resume button is at least the size of the icons group but grows if needed to fit text
    const finalMinWidth = Math.max(iconsWidth, contentWidth);
    resumeBtn.style.minWidth = `${finalMinWidth}px`;

    // Compute a font size that scales with width but stays in sensible bounds
    const fontPx = Math.max(12, Math.min(20, Math.round(finalMinWidth * 0.14)));
    resumeBtn.style.fontSize = fontPx + 'px';
}

// Re-run on DOM load and resize to keep them aligned
document.addEventListener('DOMContentLoaded', syncResumeToSocial);
window.addEventListener('resize', syncResumeToSocial);

// Toast helper
const toast = document.getElementById('form-toast');
let toastTimer = null;
function showToast(msg, type = 'info', duration = 3500){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.remove('success','error','info');
    toast.classList.add(type);
    toast.classList.add('show');
    toast.setAttribute('aria-hidden','false');
    if(toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => hideToast(), duration);
}
function hideToast(){
    if(!toast) return;
    toast.classList.remove('show');
    toast.classList.remove('success','error','info');
    toast.setAttribute('aria-hidden','true');
}

// Contact form submission + feedback
const contactForm = document.querySelector('.contact form');
if(contactForm){
    // disable the browser's default validation UI in favor of our own
    contactForm.noValidate = true;
    // attach input listeners to clear invalid state on user change
    Array.from(contactForm.querySelectorAll('input, textarea')).forEach(el => {
        el.addEventListener('input', () => el.classList.remove('input-invalid'));
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // clear previous invalid state
        contactForm.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));
        // Validate before sending
        const validation = validateContactForm(contactForm);
        if(!validation.valid){
            showToast(validation.message, 'error', 4200);
            if(validation.firstInvalid){
                validation.firstInvalid.classList.add('input-invalid');
                validation.firstInvalid.focus();
            }
            return;
        }
        // Basic client-side checks to make sure fields are present
        const form = e.target;
        const fd = new FormData(form);
        const submitBtn = form.querySelector('input[type="submit"]');
        if(submitBtn){
            submitBtn.disabled = true;
            // keep original label for restore
            submitBtn.dataset._originalLabel = submitBtn.value;
            submitBtn.value = 'Sending...';
        }
        showToast('Sending message...', 'info', 10000);
        try{
            const res = await fetch(form.action, { method: 'POST', body: fd });
            const data = await res.json();
            if(data && (data.success || res.ok)){
                showToast('Message sent successfully.', 'success', 3000);
                form.reset();
                // clear invalid states after reset
                contactForm.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));
                // close overlay shortly after success
                setTimeout(() => {
                    closeContact();
                }, 800);
            } else {
                const msg = data && data.message ? data.message : 'Failed to send message';
                showToast(msg, 'error', 5000);
            }
        }catch(err){
            console.error('Form submit error', err);
            showToast('Network error. Please try again later.', 'error', 5000);
        }
        finally{
            if(submitBtn){
                submitBtn.disabled = false;
                submitBtn.value = submitBtn.dataset._originalLabel || 'Send Message';
                delete submitBtn.dataset._originalLabel;
            }
        }
    });
}

// Validate the contact form fields before submit
function validateContactForm(form){
    const name = form.querySelector('[name="Name"]');
    const email = form.querySelector('[name="Email"]');
    const phone = form.querySelector('[name="Phone"]');
    const subject = form.querySelector('[name="Subject"]');
    const message = form.querySelector('[name="Message"]');

    if(!name || !email || !phone || !subject || !message){
        return { valid: false, message: 'Please fill in all fields.' };
    }

    if(!name.value.trim()){
        return { valid: false, firstInvalid: name, message: 'Please enter your full name.' };
    }
    if(!email.value.trim()){
        return { valid: false, firstInvalid: email, message: 'Please enter your email address.' };
    }
    if(!isValidEmail(email.value.trim())){
        return { valid: false, firstInvalid: email, message: 'Please enter a valid email address.' };
    }
    if(!phone.value.trim()){
        return { valid: false, firstInvalid: phone, message: 'Please enter a phone number.' };
    }
    if(!subject.value.trim()){
        return { valid: false, firstInvalid: subject, message: 'Please add an email subject.' };
    }
    if(!message.value.trim()){
        return { valid: false, firstInvalid: message, message: 'Please write a message.' };
    }

    return { valid: true };
}

function isValidEmail(email){
    // Basic email regex; it's fine for client-side validation
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}