// Specializations Data Structure
const specializations = [
  {
    id: 1,
    name: 'Frontend Development',
    icon: 'palette',
    description: 'Master UI design and frontend technologies'
  },
  {
    id: 2,
    name: 'Backend Development',
    icon: 'database',
    description: 'Build scalable server-side applications'
  },
  {
    id: 3,
    name: 'Full Stack Development',
    icon: 'layers',
    description: 'Become proficient across the entire stack'
  },
  {
    id: 4,
    name: 'Data Analysis',
    icon: 'bar-chart-3',
    description: 'Transform data into actionable insights'
  },
  {
    id: 5,
    name: 'Data Science & AI/ML',
    icon: 'brain-circuit',
    description: 'Master machine learning and AI technologies'
  },
  {
    id: 6,
    name: 'Project Management',
    icon: 'clipboard-list',
    description: 'Lead teams and deliver successful projects'
  },
  {
    id: 7,
    name: 'Product Design',
    icon: 'lightbulb',
    description: 'Design products that users love'
  },
  {
    id: 8,
    name: 'Cybersecurity',
    icon: 'shield-check',
    description: 'Protect digital assets and data'
  },
  {
    id: 9,
    name: 'DevOps',
    icon: 'wrench',
    description: 'Automate deployment and infrastructure'
  },
  {
    id: 10,
    name: 'UI/UX Design',
    icon: 'monitor',
    description: 'Create intuitive user experiences'
  },
  {
    id: 11,
    name: 'Technical Writing',
    icon: 'pen-tool',
    description: 'Document and communicate clearly'
  },
  {
    id: 12,
    name: 'Blockchain & Web3',
    icon: 'link',
    description: 'Explore decentralized technologies'
  }
];

// Default Configuration
const defaultConfig = {
  hero_headline: 'AI & The Future of Tech Skills',
  hero_subheading: "Is learning tech still worth it in today's AI-driven world? Discover how to stay relevant and build real skills faster using AI.",
  cta_text: '🚀 Register for Free',
  event_date: '9th May, 2026',
  event_time: '10:00 AM WAT',
  event_location: 'Virtual (Google Meet)',
  contact_email: 'alteturiaofficial@gmail.com',
  registration_sheet_webhook_url: 'https://script.google.com/macros/s/AKfycbyUoFXumBmKYrgKrWKG721jcLFKqjw2QLjkNQRrC80erbSjndGEN427C8sqZAAoEbjD/exec',
  contact_sheet_webhook_url: 'https://script.google.com/macros/s/AKfycbyUoFXumBmKYrgKrWKG721jcLFKqjw2QLjkNQRrC80erbSjndGEN427C8sqZAAoEbjD/exec',
  whatsapp_group_url: 'https://chat.whatsapp.com/LrzmQH68G150NgK3vV0HPy?mode=gi_t',
  logo_image_url: 'https://drive.google.com/file/d/1XSe6_1MyGamTZiMGA94nvjWiTXkWVXKb/view?usp=sharing',
  logo_fallback_local: '',
  background_color: '#030816',
  accent_color: '#6ED8FF',
  text_color: '#ffffff',
  card_color: '#0b1328',
  muted_text_color: '#9ca3af',
  font_family: 'Outfit',
  font_size: 16
};

// Apply Config
function applyConfig(config) {
  const c = key => config[key] || defaultConfig[key];

  const getDriveFileId = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    const idMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return idMatch && idMatch[1] ? idMatch[1] : '';
  };

  const getLogoCandidates = (primaryUrl, backupUrl) => {
    const candidates = [];
    const addCandidate = (url) => {
      const trimmed = (url || '').trim();
      if (!trimmed) return;
      const driveId = getDriveFileId(trimmed);
      if (driveId) {
        candidates.push(`https://drive.google.com/uc?export=view&id=${driveId}`);
        candidates.push(`https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`);
        candidates.push(`https://lh3.googleusercontent.com/d/${driveId}`);
      } else {
        candidates.push(trimmed);
      }
    };

    addCandidate(primaryUrl);
    addCandidate(backupUrl);

    return [...new Set(candidates)];
  };

  // Apply logo
  const logoImg = document.getElementById('brand-logo-img');
  const logoFallback = document.getElementById('brand-logo-fallback');
  const logoCandidates = getLogoCandidates(c('logo_image_url'), c('logo_fallback_local'));
  
  if (logoImg && logoFallback) {
    if (logoCandidates.length > 0) {
      logoImg.referrerPolicy = 'no-referrer';
      let candidateIndex = 0;
      const tryNextLogo = () => {
        if (candidateIndex >= logoCandidates.length) {
          logoImg.removeAttribute('src');
          logoImg.style.display = 'none';
          logoFallback.style.display = 'block';
          return;
        }
        logoImg.src = logoCandidates[candidateIndex++];
      };

      logoImg.onload = () => {
        logoImg.style.display = 'block';
        logoFallback.style.display = 'none';
      };
      logoImg.onerror = () => tryNextLogo();

      tryNextLogo();
    } else {
      logoImg.onload = null;
      logoImg.onerror = null;
      logoImg.removeAttribute('src');
      logoImg.style.display = 'none';
      logoFallback.style.display = 'block';
    }
  }

  // Apply colors
  const bg = c('background_color');
  const accent = c('accent_color');
  const textCol = c('text_color');
  
  document.body.style.background = bg;
  document.body.style.color = textCol;
  document.documentElement.style.setProperty('--accent', accent);

  document.querySelectorAll('.neon-text').forEach(el => el.style.color = accent);
  document.querySelectorAll('.section-label').forEach(el => {
    if (!el.style.color || el.style.color === '#6ED8FF' || el.style.color === 'rgb(110, 216, 255)') {
      el.style.color = accent;
    }
  });
  
  document.querySelectorAll('.glow-btn').forEach(btn => {
    const hasCustomBackground = (btn.style.background || '').trim() !== '';
    const hasCustomTextColor = (btn.style.color || '').trim() !== '';

    // Preserve custom-styled/outlined buttons to avoid contrast clashes.
    if (!hasCustomBackground) {
      btn.style.background = accent;
    }

    if (!hasCustomTextColor) {
      btn.style.color = '#030816';
    }

    btn.style.boxShadow = `0 0 30px ${accent}40`;
  });
  
  document.querySelectorAll('.register-btn-header').forEach(btn => {
    btn.style.boxShadow = `0 0 30px ${accent}59`;
  });
  
  document.querySelectorAll('.logo-box').forEach(box => {
    box.style.borderColor = `${accent}99`;
    box.style.boxShadow = `0 0 0 1px ${accent}70 inset, 0 0 20px ${accent}4d`;
  });

  // Apply font
  const font = c('font_family');
  const baseSize = c('font_size');
  document.body.style.fontFamily = `${font}, Outfit, sans-serif`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  applyConfig(defaultConfig);
  initNavigation();
  initFormHandlers();
  initScrollAnimations();
  initLucide();
});

// Navigation Handler
function initNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initRouteLinks() {
  const isInsidePagesFolder = window.location.pathname.includes('/pages/');
  const routes = {
    home: isInsidePagesFolder ? '../index.html' : 'index.html',
    about: isInsidePagesFolder ? 'about.html' : 'pages/about.html',
    events: isInsidePagesFolder ? 'events.html' : 'pages/events.html',
    futureBuilder: isInsidePagesFolder ? 'future-builder-series.html' : 'pages/future-builder-series.html',
    registerBuilderSprint: isInsidePagesFolder ? 'register-builder-sprint.html' : 'pages/register-builder-sprint.html',
    registerTechnicalSession: isInsidePagesFolder ? 'register-technical-session.html' : 'pages/register-technical-session.html'
  };

  document.querySelectorAll('[data-route]').forEach(link => {
    const routeName = link.dataset.route;
    if (routeName && routes[routeName]) {
      link.setAttribute('href', routes[routeName]);
    }
  });
}

// Registration Form Handler
function initFormHandlers() {
  const registrationForm = document.getElementById('registration-form');
  if (registrationForm && !registrationForm.dataset.bound) {
    registrationForm.dataset.bound = '1';
    registrationForm.addEventListener('submit', handleRegistrationSubmit);
  }

  const footerContactForm = document.getElementById('footer-contact-form');
  if (footerContactForm && !footerContactForm.dataset.bound) {
    footerContactForm.dataset.bound = '1';
    footerContactForm.addEventListener('submit', handleContactSubmit);
  }
}

async function handleRegistrationSubmit(event) {
  event.preventDefault();
  
  const statusText = document.getElementById('registration-form-status');
  const submitButton = this.querySelector('button[type="submit"]');
  const sheetWebhook = (this.dataset.sheetWebhook || '').trim();
  const whatsappGroup = (this.dataset.whatsappGroup || '').trim();

  const getValue = id => (document.getElementById(id) || {}).value?.trim() || '';
  const formData = {
    full_name: getValue('reg-full-name'),
    phone_number: getValue('reg-phone'),
    email_address: getValue('reg-email'),
    age_group: getValue('reg-age-group'),
    location: getValue('reg-location'),
    experience_level: getValue('reg-experience'),
    area_of_interest: getValue('reg-interest'),
    session_of_interest: getValue('reg-session'),
    referral_source: getValue('reg-referral'),
    goal: getValue('reg-goal'),
    platform: getValue('reg-platform'),
    handle: getValue('reg-handle'),
    idea_summary: getValue('reg-idea-summary'),
    progress_plan: getValue('reg-progress-plan')
  };

  const requiredFields = [
    { key: 'full_name', label: 'Full name' },
    { key: 'phone_number', label: 'Phone number' },
    { key: 'email_address', label: 'Email' },
    { key: 'location', label: 'Location' },
    { key: 'area_of_interest', label: 'Event selection' },
    { key: 'session_of_interest', label: 'Session selection' }
  ];

  const missingField = requiredFields.find(field => !formData[field.key]);
  if (missingField) {
    if (statusText) {
      statusText.textContent = `Please complete the ${missingField.label} field before submitting.`;
      statusText.style.color = '#f87171';
    }
    return;
  }

  if (submitButton) submitButton.disabled = true;

  try {
    if (!/^https?:\/\//i.test(sheetWebhook)) {
      throw new Error('Missing registration webhook URL');
    }

    const payload = new URLSearchParams({
      form_type: 'registration',
      source: 'alteturia-event-page',
      submitted_at: new Date().toISOString(),
      ...formData
    });

    await fetch(sheetWebhook, {
      method: 'POST',
      mode: 'no-cors',
      body: payload
    });

    this.reset();
    if (statusText) {
      statusText.innerHTML = '✓ Registration successful! Your details have been saved. <br>Redirecting to our WhatsApp community...';
      statusText.style.color = '#6ED8FF';
      statusText.style.fontSize = '16px';
      statusText.style.fontWeight = '500';
      statusText.style.padding = '12px';
      statusText.style.backgroundColor = '#6ED8FF20';
      statusText.style.borderRadius = '8px';
      statusText.style.marginTop = '16px';
      statusText.style.border = '1px solid #6ED8FF40';
    }

    if (/^https?:\/\//i.test(whatsappGroup)) {
      setTimeout(() => {
        window.location.href = whatsappGroup;
      }, 2500);
    }
  } catch (error) {
    if (statusText) {
      statusText.textContent = '✗ Registration failed. Please try again.';
      statusText.style.color = '#f87171';
      statusText.style.fontSize = '16px';
      statusText.style.fontWeight = '500';
      statusText.style.padding = '12px';
      statusText.style.backgroundColor = '#f8717120';
      statusText.style.borderRadius = '8px';
      statusText.style.marginTop = '16px';
      statusText.style.border = '1px solid #f8717140';
    }
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

async function handleContactSubmit(event) {
  event.preventDefault();
  
  const senderInput = document.getElementById('contact-form-email');
  const messageInput = document.getElementById('contact-form-message');
  const statusText = document.getElementById('contact-form-status');
  const submitButton = this.querySelector('button[type="submit"]');
  const recipient = this.dataset.recipient || defaultConfig.contact_email;
  const sheetWebhook = (this.dataset.sheetWebhook || '').trim();
  const sender = senderInput?.value?.trim() || '';
  const message = messageInput?.value?.trim() || '';

  if (!sender || !message) return;

  const setStatus = (text, isSuccess) => {
    if (!statusText) return;
    statusText.textContent = text;
    statusText.style.color = isSuccess ? '#6ED8FF' : '#f87171';
  };

  const subject = encodeURIComponent('New website message from ' + sender);
  const body = encodeURIComponent('Sender: ' + sender + '\n\nMessage:\n' + message);

  const openMailClient = () => {
    window.location.href = 'mailto:' + recipient + '?subject=' + subject + '&body=' + body;
  };

  if (submitButton) submitButton.disabled = true;

  try {
    if (/^https?:\/\//i.test(sheetWebhook)) {
      const payload = new URLSearchParams({
        form_type: 'message',
        sender_email: sender,
        message,
        recipient_email: recipient,
        whatsapp_group_url: this.dataset.whatsappGroup || '',
        source: 'alteturia-event-page',
        submitted_at: new Date().toISOString()
      });

      await fetch(sheetWebhook, {
        method: 'POST',
        mode: 'no-cors',
        body: payload
      });

      if (statusText) {
        statusText.innerHTML = '✓ Message received! Thank you for reaching out.<br>Check your email for confirmation with our WhatsApp community link.';
        statusText.style.color = '#6ED8FF';
        statusText.style.fontSize = '15px';
        statusText.style.fontWeight = '500';
        statusText.style.padding = '12px';
        statusText.style.backgroundColor = '#6ED8FF20';
        statusText.style.borderRadius = '8px';
        statusText.style.marginTop = '12px';
        statusText.style.border = '1px solid #6ED8FF40';
      }
      if (senderInput) senderInput.value = '';
      if (messageInput) messageInput.value = '';
    } else {
      openMailClient();
      if (statusText) {
        statusText.innerHTML = '✓ Email app opened. Your message is ready to send.';
        statusText.style.color = '#6ED8FF';
        statusText.style.fontSize = '15px';
        statusText.style.fontWeight = '500';
        statusText.style.padding = '12px';
        statusText.style.backgroundColor = '#6ED8FF20';
        statusText.style.borderRadius = '8px';
        statusText.style.marginTop = '12px';
        statusText.style.border = '1px solid #6ED8FF40';
      }
    }
  } catch (error) {
    openMailClient();
    if (statusText) {
      statusText.textContent = '✗ Error submitting form, opened email app as fallback.';
      statusText.style.color = '#f87171';
      statusText.style.fontSize = '15px';
      statusText.style.fontWeight = '500';
      statusText.style.padding = '12px';
      statusText.style.backgroundColor = '#f8717120';
      statusText.style.borderRadius = '8px';
      statusText.style.marginTop = '12px';
      statusText.style.border = '1px solid #f8717140';
    }
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

// Scroll Animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(s => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(20px)';
    s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(s);
  });
}

// Initialize Lucide Icons
function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Initialize Specializations Grid
function initSpecializationsGrid(gridId = 'specializations-grid', limit = null) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  if (grid.children.length > 0) return;
  
  grid.innerHTML = '';
  const specializationList = Number.isInteger(limit) ? specializations.slice(0, limit) : specializations;
  specializationList.forEach(spec => {
    const card = document.createElement('div');
    card.className = 'glass-card p-6 text-center hover:border-neon/40 transition-colors cursor-pointer';
    card.innerHTML = `
      <div class="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-lg" style="background: rgba(110,216,255,0.1);">
        <i data-lucide="${spec.icon}" style="width:24px;height:24px;color:#6ED8FF;"></i>
      </div>
      <h3 class="text-lg font-bold mb-2">${spec.name}</h3>
      <p class="text-gray-400 text-sm leading-relaxed">${spec.description}</p>
    `;
    grid.appendChild(card);
  });
  
  // Reinitialize lucide icons for the new elements
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Speaker Images Fallback
function initSpeakerImage(imageElementId) {
  const speakerImg = document.getElementById(imageElementId);
  if (!speakerImg || speakerImg.dataset.bound) return;

  speakerImg.dataset.bound = '1';
  const driveId = speakerImg.dataset.driveId || '';
  const speakerFallbacks = driveId ? [
    `https://drive.google.com/uc?export=view&id=${driveId}`,
    `https://drive.google.com/uc?export=download&id=${driveId}`,
    `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`,
    `https://lh3.googleusercontent.com/d/${driveId}`
  ] : [speakerImg.src];

  let speakerTryIndex = 0;
  speakerImg.referrerPolicy = 'no-referrer';
  
  const tryNextSpeakerImage = () => {
    if (speakerTryIndex >= speakerFallbacks.length) return;
    speakerImg.src = speakerFallbacks[speakerTryIndex++];
  };

  speakerImg.onerror = () => tryNextSpeakerImage();
  tryNextSpeakerImage();
}

// Expose functions globally
window.initSpeakerImage = initSpeakerImage;
window.applyConfig = applyConfig;
window.initSpecializationsGrid = initSpecializationsGrid;
window.initRouteLinks = initRouteLinks;
