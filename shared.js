
const EMAIL = 'dalmagroupofhotels@gmail.com';

const navToggle = document.getElementById('navToggle');
const navPanel = document.getElementById('navPanel');
const navLinks = [...document.querySelectorAll('.nav-link')];

navToggle?.addEventListener('click', () => {
  const isOpen = navPanel.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
  const href = link.getAttribute('href') || '';
  link.classList.toggle('active', href === currentPage);

  link.addEventListener('click', () => {
    navPanel?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open menu');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll(':scope > .section-header .type-target, :scope .hero-copy .type-target').forEach((el, index) => {
        window.setTimeout(() => typeText(el), index * 120);
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));



const HEADING_TYPE_SPEED = 90; // increase for slower, decrease for faster
const HEADING_TYPE_START_DELAY = 180; // delay before typing starts

function prepareTypeTargets() {
  const selectors = [
    '.page-hero .section-header h1',
    '.hero-copy h1'
  ];

  const seen = new Set();
  document.querySelectorAll(selectors.join(',')).forEach(el => {
    if (seen.has(el) || el.children.length > 0) return;
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text || text.length > 220) return;
    seen.add(el);
    el.dataset.text = text;
    el.classList.add('type-target');
  });
}

function typeText(el) {
  if (!el || el.dataset.typed === 'true') return;
  const fullText = el.dataset.text || el.textContent || '';
  el.dataset.typed = 'true';
  el.textContent = '';
  el.classList.add('typing');

  const speed = Number(el.dataset.typeSpeed || HEADING_TYPE_SPEED);
  let i = 0;

  function tick() {
    i += 1;
    el.textContent = fullText.slice(0, i);
    if (i < fullText.length) {
      const char = fullText[i - 1];
      const pause = /[,.!?]/.test(char) ? speed * 2.2 : /\s/.test(char) ? speed * 1.35 : speed;
      window.setTimeout(tick, pause);
    } else {
      el.classList.remove('typing');
      el.classList.add('typed');
    }
  }

  window.setTimeout(tick, HEADING_TYPE_START_DELAY);
}

prepareTypeTargets();

document.querySelectorAll('.type-target').forEach(el => {
  const revealParent = el.closest('.reveal');
  if (!revealParent || revealParent.classList.contains('visible')) {
    typeText(el);
  }
});

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const heroSlides = [...document.querySelectorAll('.hero-slide')];
const heroDots = [...document.querySelectorAll('.hero-dot')];
let heroIndex = 0;
function setHeroSlide(index) {
  if (!heroSlides.length) return;
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => slide.classList.toggle('active', i === heroIndex));
  heroDots.forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));
}
heroDots.forEach((dot, index) => dot.addEventListener('click', () => setHeroSlide(index)));
if (heroSlides.length) {
  setHeroSlide(0);
  setInterval(() => setHeroSlide(heroIndex + 1), 5500);
}

function initSlider(id) {
  const slider = document.getElementById(id);
  if (!slider) return;
  const track = slider.querySelector('.slider-track');
  const slides = [...slider.querySelectorAll('.slider-slide')];
  const pagination = document.querySelector(`[data-slider-pagination="${id}"]`);
  const prevBtn = document.querySelector(`[data-slider-prev="${id}"]`);
  const nextBtn = document.querySelector(`[data-slider-next="${id}"]`);
  let index = 0;

  function renderPagination() {
    if (!pagination) return;
    pagination.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = i === index ? 'active' : '';
      btn.setAttribute('aria-label', `Show slide ${i + 1}`);
      btn.addEventListener('click', () => update(i));
      pagination.appendChild(btn);
    });
  }

  function update(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    if (track) track.style.transform = `translateX(-${index * 100}%)`;
    if (pagination) [...pagination.children].forEach((btn, i) => btn.classList.toggle('active', i === index));
  }

  prevBtn?.addEventListener('click', () => update(index - 1));
  nextBtn?.addEventListener('click', () => update(index + 1));
  renderPagination();
  if (slides.length > 1) setInterval(() => update(index + 1), 6000);
}
initSlider('testimonialSlider');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || 'Gallery Image';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}
lightboxTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => openLightbox(trigger.dataset.src, trigger.dataset.alt));
});
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

const bookingDialog = document.getElementById('bookingDialog');
const bookingDialogClose = document.getElementById('bookingDialogClose');
const bookingButtons = document.querySelectorAll('.open-booking');
const modalRoomSelect = document.getElementById('m-room');

function openBookingDialog(roomValue = '') {
  if (!bookingDialog) return;
  bookingDialog.classList.add('open');
  bookingDialog.setAttribute('aria-hidden', 'false');
  if (roomValue && modalRoomSelect) modalRoomSelect.value = roomValue;
  document.body.style.overflow = 'hidden';
}
function closeBookingDialog() {
  if (!bookingDialog) return;
  bookingDialog.classList.remove('open');
  bookingDialog.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
bookingButtons.forEach(btn => btn.addEventListener('click', () => openBookingDialog(btn.dataset.room || '')));
bookingDialogClose?.addEventListener('click', closeBookingDialog);
bookingDialog?.addEventListener('click', (event) => {
  if (event.target === bookingDialog) closeBookingDialog();
});

const policyDialog = document.getElementById('policyDialog');
const policyDialogClose = document.getElementById('policyDialogClose');
const policyDialogTitle = document.getElementById('policyDialogTitle');
const policyDialogContent = document.getElementById('policyDialogContent');
const policyButtons = document.querySelectorAll('.js-open-policy');

const policyContent = {
  privacy: {
    title: 'Privacy',
    html: '<p>Information submitted through the enquiry form or booking request form is used only to respond to your enquiry or reservation request.</p><p style="margin-top:1rem;">Contact details such as your name, phone number, email address, stay dates, and message are only included in the email or WhatsApp message you choose to send.</p>'
  },
  terms: {
    title: 'Terms',
    html: '<p>Room requests submitted through this website are enquiry and reservation requests. Availability, confirmation, and final arrangements are handled directly by New Dalma Hotel.</p><p style="margin-top:1rem;">Please review your details before sending your request by email or WhatsApp.</p>'
  },
  cookies: {
    title: 'Cookies',
    html: '<p>This website uses cookies to remember your cookie choice and improve performance and usability.</p><p style="margin-top:1rem;">You can change your preference at any time by reopening the cookie banner from your browser settings or by clearing site data.</p>'
  }
};

function openPolicy(key) {
  const policy = policyContent[key];
  if (!policy || !policyDialog || !policyDialogTitle || !policyDialogContent) return;
  policyDialogTitle.textContent = policy.title;
  policyDialogContent.innerHTML = policy.html;
  policyDialog.classList.add('open');
  policyDialog.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closePolicy() {
  if (!policyDialog) return;
  policyDialog.classList.remove('open');
  policyDialog.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
policyButtons.forEach(btn => btn.addEventListener('click', () => openPolicy(btn.dataset.policy)));
policyDialogClose?.addEventListener('click', closePolicy);
policyDialog?.addEventListener('click', (event) => {
  if (event.target === policyDialog) closePolicy();
});

function showSuccess(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 5000);
}

function markFieldValidity(field, valid) {
  if (!field) return;
  field.classList.toggle('invalid', !valid);
}

function validateRequiredText(input) {
  return !!input && input.value.trim().length > 0;
}
function validateEmail(input) {
  return !!input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
}
function validateNumber(input, min = 0) {
  if (!input) return false;
  const value = Number(input.value);
  return Number.isFinite(value) && value >= min;
}
function validatePhone(input) {
  return !!input && input.value.trim().length >= 6;
}
function validateDateRange(checkin, checkout) {
  if (!checkin || !checkout || !checkin.value || !checkout.value) return false;
  return new Date(checkout.value) > new Date(checkin.value);
}

function validateContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return false;
  const nameInput = form.querySelector('#cName');
  const emailInput = form.querySelector('#cEmail');
  const phoneInput = form.querySelector('#cPhone');
  const messageInput = form.querySelector('#cMessage');

  const nameValid = validateRequiredText(nameInput);
  const emailValid = validateEmail(emailInput);
  const phoneValid = validatePhone(phoneInput);
  const messageValid = validateRequiredText(messageInput);

  markFieldValidity(nameInput?.closest('.field'), nameValid);
  markFieldValidity(emailInput?.closest('.field'), emailValid);
  markFieldValidity(phoneInput?.closest('.field'), phoneValid);
  markFieldValidity(messageInput?.closest('.field'), messageValid);
  return nameValid && emailValid && phoneValid && messageValid;
}

document.getElementById('contactForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!validateContactForm()) return;

  const name = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const subject = document.getElementById('cSubject').value.trim() || 'Enquiry from website';
  const message = document.getElementById('cMessage').value.trim();
  const body = `${message}\n\n${name}\n${phone}\n${email}`;
  showSuccess('contactSuccess');
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  form.reset();
});

function getBookingFields(form) {
  return {
    name: form.querySelector('[name="name"]'),
    checkin: form.querySelector('[name="checkin"]'),
    checkout: form.querySelector('[name="checkout"]'),
    rooms: form.querySelector('[name="rooms"]'),
    room: form.querySelector('[name="room"]'),
    adults: form.querySelector('[name="adults"]'),
    children: form.querySelector('[name="children"]'),
    phone: form.querySelector('[name="phone"]'),
    message: form.querySelector('[name="message"]')
  };
}

function validateBookingForm(form) {
  if (!form) return false;
  const f = getBookingFields(form);
  const validity = {
    name: validateRequiredText(f.name),
    dateRange: validateDateRange(f.checkin, f.checkout),
    rooms: validateNumber(f.rooms, 1),
    adults: validateNumber(f.adults, 1),
    children: !f.children || f.children.value === '' ? true : validateNumber(f.children, 0),
    phone: validatePhone(f.phone)
  };

  markFieldValidity(f.name?.closest('.field'), validity.name);
  markFieldValidity(f.checkin?.closest('.field'), validity.dateRange && !!f.checkin?.value);
  markFieldValidity(f.checkout?.closest('.field'), validity.dateRange && !!f.checkout?.value);
  markFieldValidity(f.rooms?.closest('.field'), validity.rooms);
  markFieldValidity(f.adults?.closest('.field'), validity.adults);
  markFieldValidity(f.children?.closest('.field'), validity.children);
  markFieldValidity(f.phone?.closest('.field'), validity.phone);

  return Object.values(validity).every(Boolean);
}

function getRoomPrice(roomValue) {
  if ((roomValue || '').includes('30')) return 30;
  if ((roomValue || '').includes('40')) return 40;
  if ((roomValue || '').includes('50')) return 50;
  return 0;
}

function buildBookingBody(data) {
  const nights = Math.max(0, Math.round((new Date(data.checkout) - new Date(data.checkin)) / 86400000));
  const price = getRoomPrice(data.room);
  const total = nights > 0 && price > 0 ? `\nEstimated Total: ${nights} night(s) × $${price} × ${data.rooms} room(s) = $${nights * price * Number(data.rooms)} USD` : '';
  return `Booking Request – New Dalma Hotel\n\nRoom Selected:  ${data.room}\nCheck-In:       ${data.checkin}\nCheck-Out:      ${data.checkout}\nNights:         ${nights}\nRooms:          ${data.rooms}\nAdults:         ${data.adults}\nChildren:       ${data.children || '0'}\nPhone:          ${data.phone}${total}\n\nAdditional Message:\n${data.message || 'None'}\n\n---\nSent via New Dalma Hotel website`;
}

function getBookingData(form) {
  const f = getBookingFields(form);
  return {
    name: f.name.value.trim(),
    checkin: f.checkin.value,
    checkout: f.checkout.value,
    rooms: f.rooms.value,
    room: f.room.value,
    adults: f.adults.value,
    children: f.children.value || '0',
    phone: f.phone.value.trim(),
    message: f.message.value.trim()
  };
}

function submitBooking(form, successId) {
  if (!validateBookingForm(form)) return false;
  const data = getBookingData(form);
  const body = buildBookingBody(data);
  showSuccess(successId);
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Booking Request – ${data.name}`)}&body=${encodeURIComponent(body)}`;
  form.reset();
  return true;
}

document.getElementById('bookingForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  submitBooking(event.currentTarget, 'bookingSuccess');
});
document.getElementById('bookingModalForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (submitBooking(event.currentTarget, 'bookingModalSuccess')) {
    setTimeout(closeBookingDialog, 250);
  }
});

document.querySelectorAll('.js-whatsapp').forEach(button => {
  button.addEventListener('click', () => {
    const formId = button.dataset.form || 'bookingForm';
    const form = document.getElementById(formId);
    const successId = formId === 'bookingModalForm' ? 'bookingModalSuccess' : 'bookingSuccess';
    if (!validateBookingForm(form)) return;
    const data = getBookingData(form);
    const body = buildBookingBody(data);
    showSuccess(successId);
    window.open(`https://wa.me/${button.dataset.number}?text=${encodeURIComponent(body)}`, '_blank', 'noopener');
  });
});

const cookieBanner = document.getElementById('cookieBanner');
const cookieChoice = localStorage.getItem('dalma-cookie-choice');
if (cookieBanner && !cookieChoice) cookieBanner.classList.add('show');
document.getElementById('acceptCookies')?.addEventListener('click', () => {
  localStorage.setItem('dalma-cookie-choice', 'accepted');
  cookieBanner?.classList.remove('show');
});
document.getElementById('declineCookies')?.addEventListener('click', () => {
  localStorage.setItem('dalma-cookie-choice', 'declined');
  cookieBanner?.classList.remove('show');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
    closeBookingDialog();
    closePolicy();
  }
});


function applyTextStagger() {
  const selectors = [
    '.hero-copy',
    '.hero-stats',
    '.page-hero .section-header',
    '.section-header',
    '.feature-card',
    '.room-card',
    '.amenity-card',
    '.info-card',
    '.contact-form-card',
    '.checkin-bar',
    '.image-card',
    '.gallery-item',
    '.room-gallery-item',
    '.dining-gallery-item',
    '.stat-card',
    '.floating-badge',
    '.location-note'
  ];

  const itemSelector = 'h1, h2, h3, p, .eyebrow, .divider, .lead, .hero-actions, .hero-dots, .btn, .btn-secondary, .btn-ghost, strong, span, li, .room-price, .status-note, form, .info-row';

  document.querySelectorAll(selectors.join(',')).forEach(container => {
    const children = [...container.querySelectorAll(':scope > ' + itemSelector)].filter(el => !el.classList.contains('text-animated'));
    children.forEach((el, index) => {
      el.classList.add('text-animated');
      el.style.setProperty('--stagger-delay', `${index * 90}ms`);
    });
  });
}

function initPageTransitions() {
  document.body.classList.add('page-ready');

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href') || '';
    const target = link.getAttribute('target');
    const download = link.hasAttribute('download');
    const isAnchor = href.startsWith('#');
    const isExternal = /^https?:/i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('whatsapp:');

    if (!href || target === '_blank' || download || isAnchor || isExternal) return;

    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.body.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = href;
      }, 320);
    });
  });
}

applyTextStagger();
initPageTransitions();

window.addEventListener('pageshow', () => {
  document.body.classList.remove('is-leaving');
  document.body.classList.add('page-ready');
});
