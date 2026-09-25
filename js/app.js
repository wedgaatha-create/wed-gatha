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
   7. SHARE NFC MODAL & DYNAMIC REAL QR CODE GENERATOR
   ========================================================================== */
function getCleanShareUrl() {
  try {
    const loc = window.location;
    if (loc.protocol === 'http:' || loc.protocol === 'https:') {
      return loc.origin + loc.pathname;
    }
    // For file:// or custom environments, return href without hash
    return (loc.href || '').split('#')[0];
  } catch (e) {
    return window.location.href || 'https://www.instagram.com/wedgatha';
  }
}

function initShareModal() {
  const shareModal = document.getElementById('shareModal');
  const closeShareModal = document.getElementById('closeShareModal');
  const topShareBtn = document.getElementById('topShareBtn');
  const dockShareBtn = document.getElementById('dockShareBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const qrUrlChip = document.getElementById('qrUrlChip');
  const nativeShareBtn = document.getElementById('nativeShareBtn');
  const modalWhatsAppShareBtn = document.getElementById('modalWhatsAppShareBtn');
  const downloadQrBtn = document.getElementById('downloadQrBtn');

  // Open Modal triggers
  [topShareBtn, dockShareBtn].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      renderRealQRCode();
      if (shareModal) shareModal.classList.add('active');
    });
  });

  // Close triggers
  if (closeShareModal) {
    closeShareModal.addEventListener('click', () => {
      if (shareModal) shareModal.classList.remove('active');
    });
  }

  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) shareModal.classList.remove('active');
    });
  }

  // Copy Link Action
  const handleCopyLink = () => {
    const shareUrl = getCleanShareUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('✓ Website link copied to clipboard!');
      }).catch(() => {
        fallbackCopyText(shareUrl);
      });
    } else {
      fallbackCopyText(shareUrl);
    }
  };

  if (copyLinkBtn) copyLinkBtn.addEventListener('click', handleCopyLink);
  if (qrUrlChip) qrUrlChip.addEventListener('click', handleCopyLink);

  // WhatsApp Share Action
  if (modalWhatsAppShareBtn) {
    modalWhatsAppShareBtn.addEventListener('click', () => {
      const shareUrl = getCleanShareUrl();
      const message = `✨ *Wed Gatha (વેડ ગાથા)* — Timeless Luxury Wedding Cinematography & Digital NFC Profile\n\nExplore our portfolio, candid galleries, and direct contact details:\n🔗 ${shareUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    });
  }

  // Native Web Share API
  if (nativeShareBtn) {
    nativeShareBtn.addEventListener('click', async () => {
      const shareUrl = getCleanShareUrl();
      const shareData = {
        title: 'Wed Gatha | Luxury Wedding Photography',
        text: 'Explore Wed Gatha (વેડ ગાથા) — Timeless Luxury Wedding Cinematography & Portfolio',
        url: shareUrl
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          if (shareModal) shareModal.classList.remove('active');
        } catch (err) {
          // User dismissed
        }
      } else {
        // Fallback WhatsApp
        const waText = encodeURIComponent(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        window.open(`https://wa.me/?text=${waText}`, '_blank');
      }
    });
  }

  // High-Resolution QR Card PNG Downloader
  if (downloadQrBtn) {
    downloadQrBtn.addEventListener('click', downloadLuxuryQRCodeCard);
  }
}

function fallbackCopyText(text) {
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
    showToast('✓ Website link copied!');
  } catch (e) {
    showToast('Share link: ' + text);
  }
  document.body.removeChild(input);
}

// Generate Real, 100% Scannable ISO/IEC 18004 Vector QR Code
function renderRealQRCode() {
  const container = document.getElementById('qrCanvasContainer');
  const urlDisplay = document.getElementById('qrUrlText');
  if (!container) return;

  const targetUrl = getCleanShareUrl();

  // Update readable link preview
  if (urlDisplay) {
    try {
      if (targetUrl.startsWith('http')) {
        const parsed = new URL(targetUrl);
        urlDisplay.textContent = parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
      } else {
        urlDisplay.textContent = targetUrl.replace(/^https?:\/\//, '');
      }
    } catch (e) {
      urlDisplay.textContent = targetUrl;
    }
  }

  // Generate real QR code
  try {
    if (typeof QRCode === 'function') {
      const qr = QRCode(targetUrl, { errorCorrectLevel: QRCode.CorrectLevel.M });
      container.innerHTML = qr.createSvg({
        cellSize: 5,
        margin: 2,
        darkColor: '#0b0b0e',
        lightColor: '#ffffff',
        width: 180,
        height: 180
      });
    } else {
      renderFallbackQRCode(container, targetUrl);
    }
  } catch (err) {
    console.warn('QRCode generation fallback:', err);
    renderFallbackQRCode(container, targetUrl);
  }
}

// Backward compatibility alias
function renderQRCodeSVG() {
  renderRealQRCode();
}

// Fallback high-contrast QR generator if script load delay occurs
function renderFallbackQRCode(container, url) {
  const encoded = encodeURIComponent(url);
  container.innerHTML = `
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encoded}&color=0b0b0e&bgcolor=ffffff&margin=8" 
         alt="Wed Gatha QR Code" 
         width="180" 
         height="180" 
         style="display:block; border-radius:8px; margin:0 auto;" />
  `;
}

// Generates a luxury branded 800x960 PNG Card with QR code for printing / sharing
function downloadLuxuryQRCodeCard() {
  try {
    const targetUrl = getCleanShareUrl();
    let qr;
    if (typeof QRCode === 'function') {
      qr = QRCode(targetUrl, { errorCorrectLevel: QRCode.CorrectLevel.H });
    }

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');

    // 1. Luxury Dark Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#121218');
    bgGrad.addColorStop(0.5, '#0b0b0f');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Gold Ornamental Double Borders
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Gold Corner Accents
    const cornerSize = 25;
    ctx.fillStyle = '#d4af37';
    // Top-Left
    ctx.fillRect(25, 25, cornerSize, 4);
    ctx.fillRect(25, 25, 4, cornerSize);
    // Top-Right
    ctx.fillRect(canvas.width - 25 - cornerSize, 25, cornerSize, 4);
    ctx.fillRect(canvas.width - 29, 25, 4, cornerSize);
    // Bottom-Left
    ctx.fillRect(25, canvas.height - 29, cornerSize, 4);
    ctx.fillRect(25, canvas.height - 25 - cornerSize, 4, cornerSize);
    // Bottom-Right
    ctx.fillRect(canvas.width - 25 - cornerSize, canvas.height - 29, cornerSize, 4);
    ctx.fillRect(canvas.width - 29, canvas.height - 25 - cornerSize, 4, cornerSize);

    // 3. Header Branding
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 38px "Cinzel", Georgia, serif';
    ctx.fillText('WED GATHA', canvas.width / 2, 105);

    ctx.fillStyle = '#d4af37';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('વેડ ગાથા  •  LUXURY WEDDING CINEMATOGRAPHY', canvas.width / 2, 145);

    // 4. Crisp White QR Card Surface
    const qrCardSize = 520;
    const qrCardX = (canvas.width - qrCardSize) / 2;
    const qrCardY = 185;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(qrCardX, qrCardY, qrCardSize, qrCardSize, 20);
    } else {
      ctx.rect(qrCardX, qrCardY, qrCardSize, qrCardSize);
    }
    ctx.fill();

    // 5. Draw QR Code Matrix
    if (qr) {
      const moduleCount = qr.getModuleCount();
      const qrPadding = 30;
      const innerSize = qrCardSize - (qrPadding * 2);
      const cellSize = innerSize / moduleCount;
      const startX = qrCardX + qrPadding;
      const startY = qrCardY + qrPadding;

      ctx.fillStyle = '#0b0b0e';
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (qr.isDark(r, c)) {
            ctx.fillRect(
              Math.floor(startX + c * cellSize),
              Math.floor(startY + r * cellSize),
              Math.ceil(cellSize),
              Math.ceil(cellSize)
            );
          }
        }
      }
    }

    // 6. Bottom Information & Call to Action
    ctx.fillStyle = '#e8d8b0';
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SCAN TO VIEW DIGITAL CARD & PORTFOLIO', canvas.width / 2, 765);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('+91 9586860707   •   Instagram @wedgatha', canvas.width / 2, 805);

    ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('NFC & Instant QR Profile', canvas.width / 2, 838);

    // Trigger Download
    const dataUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.download = 'Wed-Gatha-NFC-QR.png';
    downloadLink.href = dataUrl;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    showToast('✓ QR Card image saved! (PNG)');
  } catch (err) {
    console.error('Download QR error:', err);
    showToast('✓ QR Code ready!');
  }
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
