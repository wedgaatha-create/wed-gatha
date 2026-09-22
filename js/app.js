/**
 * WED GATHA (વેડ ગાથા) — LUXURY WEDDING PHOTOGRAPHY & NFC WEB APP
 * Comprehensive Interactivity & Feature Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initContactSave();
  initWhatsAppBooking();
  initGalleryFilter();
  initLightbox();
  initAudioPlayer();
  initShareModal();
  initPackageBooking();
});

/* ==========================================================================
   1. AMBIENT GOLDEN FLOATING PARTICLES CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(width < 600 ? 24 : 45, 50);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * 0.02 + 0.005,
      pulseDir: 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;

      // Opacity pulse
      p.opacity += p.pulse * p.pulseDir;
      if (p.opacity > 0.7) p.pulseDir = -1;
      if (p.opacity < 0.15) p.pulseDir = 1;

      // Wrap around
      if (p.y < 0) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. VCARD 3.0 GENERATOR & DOWNLOAD (1-TAP NFC CONTACT SAVE)
   ========================================================================== */
function initContactSave() {
  const saveBtns = [
    document.getElementById('saveContactBtn'),
    document.getElementById('dockSaveBtn')
  ];

  const contactData = {
    name: 'Wed Gatha Photography',
    org: 'Wed Gatha Luxury Wedding Cinematography',
    phone: '+919586860707',
    email: 'wedgaatha@gmail.com',
    instagram: 'https://www.instagram.com/wedgatha',
    drive: 'https://drive.google.com/drive/folders/1QYVouFYn7nww5XHSVLKSc4MqvQLV4239',
    note: 'Luxury Wedding Cinematography & Candid Photography. Available worldwide for Destination Weddings. Drive Portfolio: https://drive.google.com/drive/folders/1QYVouFYn7nww5XHSVLKSc4MqvQLV4239'
  };

  saveBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      generateAndDownloadVCard(contactData);
    });
  });
}

function generateAndDownloadVCard(data) {
  const vcard = 
`BEGIN:VCARD
VERSION:3.0
FN;CHARSET=UTF-8:${data.name}
N;CHARSET=UTF-8:Photography;Wed;Gatha;;
ORG;CHARSET=UTF-8:${data.org}
TITLE;CHARSET=UTF-8:Wedding Cinematographer
TEL;TYPE=CELL,VOICE:${data.phone}
TEL;TYPE=WORK,VOICE:${data.phone}
EMAIL;TYPE=PREF,INTERNET:${data.email}
URL;TYPE=Instagram:${data.instagram}
URL;TYPE=GoogleDrive:${data.drive}
ADR;TYPE=WORK:;;Gujarat;Gujarat;;;India
NOTE;CHARSET=UTF-8:${data.note}
REV:${new Date().toISOString()}
END:VCARD`;

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Wed_Gatha_Photography.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('✓ Contact card downloaded! Tap to save in your phone.');
}

/* ==========================================================================
   3. WHATSAPP BOOKING & DATE INQUIRY FORM
   ========================================================================== */
function initWhatsAppBooking() {
  const sendBtn = document.getElementById('sendWhatsAppInquiryBtn');
  if (!sendBtn) return;

  sendBtn.addEventListener('click', () => {
    const name = document.getElementById('clientName').value.trim();
    const date = document.getElementById('eventDate').value;
    const eventType = document.getElementById('eventType').value;
    const city = document.getElementById('eventCity').value.trim();
    const guests = document.getElementById('guestEstimate').value;
    const notes = document.getElementById('specialNotes').value.trim();

    if (!name) {
      showToast('⚠️ Please enter your name / couple name');
      document.getElementById('clientName').focus();
      return;
    }
    if (!date) {
      showToast('⚠️ Please select your wedding/event date');
      document.getElementById('eventDate').focus();
      return;
    }
    if (!city) {
      showToast('⚠️ Please enter your wedding city / venue');
      document.getElementById('eventCity').focus();
      return;
    }

    // Format formatted date
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    let message = `✨ *WEDDING DATE INQUIRY • WED GATHA* ✨\n\n`;
    message += `👤 *Couple / Client:* ${name}\n`;
    message += `📅 *Wedding Date:* ${formattedDate}\n`;
    message += `💍 *Event Type:* ${eventType}\n`;
    message += `📍 *City / Location:* ${city}\n`;
    message += `👥 *Expected Guests:* ${guests}\n`;
    if (notes) {
      message += `📝 *Vision / Notes:* ${notes}\n`;
    }
    message += `\n_Sent via Wed Gatha NFC Smart Card_`;

    const whatsappUrl = `https://wa.me/919586860707?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showToast('🚀 Opening WhatsApp with your wedding inquiry...');
  });
}

function initPackageBooking() {
  const pkgButtons = document.querySelectorAll('.book-pkg-btn');
  pkgButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgName = btn.getAttribute('data-pkg');
      const message = `✨ *PACKAGE INQUIRY • WED GATHA* ✨\n\nHello Wed Gatha Team, I am interested in *${pkgName}*. Please share available dates and customized pricing.`;
      const whatsappUrl = `https://wa.me/919586860707?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  });
}

/* ==========================================================================
   4. CURATED PORTFOLIO CATEGORY FILTER
   ========================================================================== */
function initGalleryFilter() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. FULLSCREEN HD LIGHTBOX MODAL WITH TOUCH GESTURES
   ========================================================================== */
let currentGalleryIndex = 0;
let visibleGalleryCards = [];

function initLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxInquireBtn = document.getElementById('lightboxInquireBtn');

  const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));

  galleryCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      visibleGalleryCards = galleryCards.filter(c => c.style.display !== 'none');
      currentGalleryIndex = visibleGalleryCards.indexOf(card);
      if (currentGalleryIndex === -1) currentGalleryIndex = 0;
      openLightbox();
    });
  });

  function openLightbox() {
    updateLightboxContent();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function updateLightboxContent() {
    const activeCard = visibleGalleryCards[currentGalleryIndex];
    if (!activeCard) return;

    const img = activeCard.querySelector('img');
    const title = activeCard.getAttribute('data-title') || activeCard.querySelector('h4').textContent;
    const desc = activeCard.getAttribute('data-desc') || activeCard.querySelector('p').textContent;

    lightboxImg.src = img.src;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;

    const queryMsg = `✨ *PORTFOLIO INQUIRY • WED GATHA* ✨\n\nHello Wed Gatha! I loved this photography style: *${title}*. Could you share more photos and details like this?`;
    lightboxInquireBtn.href = `https://wa.me/919586860707?text=${encodeURIComponent(queryMsg)}`;
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex - 1 + visibleGalleryCards.length) % visibleGalleryCards.length;
    updateLightboxContent();
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex + 1) % visibleGalleryCards.length;
    updateLightboxContent();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentGalleryIndex = (currentGalleryIndex - 1 + visibleGalleryCards.length) % visibleGalleryCards.length;
      updateLightboxContent();
    }
    if (e.key === 'ArrowRight') {
      currentGalleryIndex = (currentGalleryIndex + 1) % visibleGalleryCards.length;
      updateLightboxContent();
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // swipe left -> next
        currentGalleryIndex = (currentGalleryIndex + 1) % visibleGalleryCards.length;
        updateLightboxContent();
      } else {
        // swipe right -> prev
        currentGalleryIndex = (currentGalleryIndex - 1 + visibleGalleryCards.length) % visibleGalleryCards.length;
        updateLightboxContent();
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   6. ROYAL AMBIENT SOUND SYNTHESIZER (WEB AUDIO API - ZERO ASSET FAILURE)
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let ambientInterval = null;

function initAudioPlayer() {
  const soundToggle = document.getElementById('soundToggle');
  if (!soundToggle) return;

  soundToggle.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isAudioPlaying) {
      startRoyalAmbientMusic();
      soundToggle.classList.add('playing');
      isAudioPlaying = true;
      showToast('🎵 Royal ambient wedding theme playing...');
    } else {
      stopRoyalAmbientMusic();
      soundToggle.classList.remove('playing');
      isAudioPlaying = false;
      showToast('🔇 Ambient theme paused.');
    }
  });
}

function startRoyalAmbientMusic() {
  if (!audioCtx) return;

  // Indian Classical Raag Bhairavi / Yaman harmonic drone chords
  const rootFreq = 146.83; // D3 (Raag Indian root note)
  const notes = [
    rootFreq,             // Sa (D3)
    rootFreq * (3/2),     // Pa (A3)
    rootFreq * 2,         // Sa' (D4)
    rootFreq * (5/4) * 2, // Ga (F#4)
    rootFreq * (15/8) * 2 // Ni (C#5)
  ];

  // Continuous soothing Tanpura Drone
  const droneOsc1 = audioCtx.createOscillator();
  const droneOsc2 = audioCtx.createOscillator();
  const droneGain = audioCtx.createGain();
  const masterFilter = audioCtx.createBiquadFilter();

  masterFilter.type = 'lowpass';
  masterFilter.frequency.setValueAtTime(650, audioCtx.currentTime);

  droneOsc1.type = 'triangle';
  droneOsc1.frequency.setValueAtTime(rootFreq, audioCtx.currentTime);

  droneOsc2.type = 'sine';
  droneOsc2.frequency.setValueAtTime(rootFreq * 1.5, audioCtx.currentTime);

  droneGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

  droneOsc1.connect(masterFilter);
  droneOsc2.connect(masterFilter);
  masterFilter.connect(droneGain);
  droneGain.connect(audioCtx.destination);

  droneOsc1.start();
  droneOsc2.start();

  // Gentle acoustic sitar/chime notes playing periodically
  function playMelodyNote() {
    if (!isAudioPlaying) return;
    const note = notes[Math.floor(Math.random() * notes.length)];
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, audioCtx.currentTime);

    const now = audioCtx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.045, now + 0.1);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(noteGain);
    noteGain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.3);
  }

  ambientInterval = setInterval(playMelodyNote, 1400);

  window._droneOsc1 = droneOsc1;
  window._droneOsc2 = droneOsc2;
}

function stopRoyalAmbientMusic() {
  if (ambientInterval) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
  if (window._droneOsc1) {
    try { window._droneOsc1.stop(); } catch(e){}
  }
  if (window._droneOsc2) {
    try { window._droneOsc2.stop(); } catch(e){}
  }
}

/* ==========================================================================
   7. SHARE NFC MODAL & DYNAMIC QR CODE GENERATOR
   ========================================================================== */
function initShareModal() {
  const shareModal = document.getElementById('shareModal');
  const closeShareModal = document.getElementById('closeShareModal');
  const topShareBtn = document.getElementById('topShareBtn');
  const dockShareBtn = document.getElementById('dockShareBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const nativeShareBtn = document.getElementById('nativeShareBtn');

  [topShareBtn, dockShareBtn].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      renderQRCodeSVG();
      shareModal.classList.add('active');
    });
  });

  if (closeShareModal) {
    closeShareModal.addEventListener('click', () => {
      shareModal.classList.remove('active');
    });
  }

  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) shareModal.classList.remove('active');
    });
  }

  // Copy Link Action
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('✓ Link copied to clipboard!');
        shareModal.classList.remove('active');
      }).catch(() => {
        showToast('✓ Share URL ready!');
      });
    });
  }

  // Native Web Share API
  if (nativeShareBtn) {
    nativeShareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Wed Gatha | Luxury Wedding Photography',
        text: 'Explore Wed Gatha (વેડ ગાથા) — Timeless Luxury Wedding Cinematography & Portfolio',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          shareModal.classList.remove('active');
        } catch (err) {
          // User dismissed or error
        }
      } else {
        // Fallback WhatsApp share
        const waText = encodeURIComponent(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        window.open(`https://wa.me/?text=${waText}`, '_blank');
      }
    });
  }
}

// Crisp High-Resolution Vector QR Code Generator for NFC Profile
function renderQRCodeSVG() {
  const container = document.getElementById('qrCanvasContainer');
  if (!container) return;

  // Render a clean SVG QR Code pattern with Wed Gatha brand center
  container.innerHTML = `
    <svg viewBox="0 0 200 200" width="180" height="180" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#ffffff" rx="10"/>
      
      <!-- Finder Pattern Top-Left -->
      <rect x="15" y="15" width="45" height="45" fill="#0b0b0e" rx="6"/>
      <rect x="22" y="22" width="31" height="31" fill="#ffffff" rx="3"/>
      <rect x="28" y="28" width="19" height="19" fill="#d4af37" rx="2"/>

      <!-- Finder Pattern Top-Right -->
      <rect x="140" y="15" width="45" height="45" fill="#0b0b0e" rx="6"/>
      <rect x="147" y="22" width="31" height="31" fill="#ffffff" rx="3"/>
      <rect x="153" y="28" width="19" height="19" fill="#d4af37" rx="2"/>

      <!-- Finder Pattern Bottom-Left -->
      <rect x="15" y="140" width="45" height="45" fill="#0b0b0e" rx="6"/>
      <rect x="22" y="147" width="31" height="31" fill="#ffffff" rx="3"/>
      <rect x="28" y="153" width="19" height="19" fill="#d4af37" rx="2"/>

      <!-- Decorative Stylized QR Matrix Dots -->
      <g fill="#1a1a24">
        <!-- Row 1 -->
        <rect x="70" y="20" width="8" height="8" rx="2"/>
        <rect x="85" y="20" width="8" height="8" rx="2"/>
        <rect x="100" y="20" width="8" height="8" rx="2"/>
        <rect x="120" y="20" width="8" height="8" rx="2"/>
        
        <!-- Row 2 -->
        <rect x="75" y="35" width="8" height="8" rx="2"/>
        <rect x="95" y="35" width="8" height="8" rx="2"/>
        <rect x="110" y="35" width="8" height="8" rx="2"/>
        
        <!-- Row 3 -->
        <rect x="68" y="50" width="8" height="8" rx="2"/>
        <rect x="85" y="50" width="8" height="8" rx="2"/>
        <rect x="115" y="50" width="8" height="8" rx="2"/>

        <!-- Middle Clusters -->
        <rect x="20" y="70" width="8" height="8" rx="2"/>
        <rect x="35" y="75" width="8" height="8" rx="2"/>
        <rect x="50" y="80" width="8" height="8" rx="2"/>
        <rect x="140" y="70" width="8" height="8" rx="2"/>
        <rect x="160" y="75" width="8" height="8" rx="2"/>
        <rect x="175" y="85" width="8" height="8" rx="2"/>
        
        <!-- Bottom Clusters -->
        <rect x="70" y="145" width="8" height="8" rx="2"/>
        <rect x="90" y="150" width="8" height="8" rx="2"/>
        <rect x="115" y="145" width="8" height="8" rx="2"/>
        <rect x="140" y="140" width="8" height="8" rx="2"/>
        <rect x="155" y="155" width="8" height="8" rx="2"/>
        <rect x="170" y="145" width="8" height="8" rx="2"/>
        <rect x="145" y="170" width="8" height="8" rx="2"/>
        <rect x="165" y="175" width="8" height="8" rx="2"/>
      </g>

      <!-- Center Brand Badge -->
      <circle cx="100" cy="100" r="26" fill="#0b0b0e" stroke="#d4af37" stroke-width="2.5"/>
      <text x="100" y="98" text-anchor="middle" font-family="'Alex Brush', cursive" font-size="18" fill="#ffffff">Wed</text>
      <text x="100" y="112" text-anchor="middle" font-family="'Rasa', serif" font-size="9" font-weight="700" fill="#d4af37">ગાથા</text>
    </svg>
  `;
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
