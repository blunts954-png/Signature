import './style.css'

const SCORECARD_KEY = 'signature_scorecard_v1';
const DEFAULT_SCORECARD = {
  qualifiedLeadActions: 0,
  conciergeEngagements: 0,
  visionUploads: 0,
  lastUpdated: null
};

function getScorecard() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SCORECARD_KEY) || '{}');
    return { ...DEFAULT_SCORECARD, ...parsed };
  } catch {
    return { ...DEFAULT_SCORECARD };
  }
}

function saveScorecard(nextState) {
  localStorage.setItem(SCORECARD_KEY, JSON.stringify(nextState));
}

function updateScorecardMetric(metricName, incrementBy = 1) {
  const current = getScorecard();
  current[metricName] = (current[metricName] || 0) + incrementBy;
  current.lastUpdated = new Date().toISOString();
  saveScorecard(current);
  renderScorecard();
}

function getConversionIntentPercent(scorecard) {
  const weighted =
    (scorecard.qualifiedLeadActions * 35) +
    (scorecard.conciergeEngagements * 25) +
    (scorecard.visionUploads * 40);

  return Math.min(100, weighted);
}

function renderScorecard() {
  const scorecard = getScorecard();
  const leadsEl = document.getElementById('kpi-leads');
  const engagementEl = document.getElementById('kpi-engagement');
  const visionEl = document.getElementById('kpi-vision');
  const conversionEl = document.getElementById('kpi-conversion');
  const updatedEl = document.getElementById('scorecard-last-updated');

  if (leadsEl) leadsEl.innerText = `${scorecard.qualifiedLeadActions}`;
  if (engagementEl) engagementEl.innerText = `${scorecard.conciergeEngagements}`;
  if (visionEl) visionEl.innerText = `${scorecard.visionUploads}`;
  if (conversionEl) conversionEl.innerText = `${getConversionIntentPercent(scorecard)}%`;
  if (updatedEl) {
    updatedEl.innerText = scorecard.lastUpdated
      ? new Date(scorecard.lastUpdated).toLocaleString()
      : 'Never';
  }
}

// 0. Preloader Logic
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const matrixCanvas = document.getElementById('matrix-canvas');
  const PHASE_ONE_MS = 8000;
  const PHASE_TWO_MS = 15000;
  const EXIT_MS = 800;

  const preloaderPhase = document.getElementById('preloader-phase');
  const preloaderDetail = document.getElementById('preloader-detail');

  function setPreloaderStatus(phase, detail) {
    if (preloaderPhase) preloaderPhase.textContent = phase;
    if (preloaderDetail) preloaderDetail.textContent = detail;
  }

  if (preloader) {
    let stopMatrixAnimation = () => {};
    if (matrixCanvas) {
      stopMatrixAnimation = startMatrixRain(matrixCanvas);
    }

    setPreloaderStatus(
      'Regional alignment',
      'Locating Signature Region: Fort Lauderdale, FL…'
    );

    setTimeout(() => {
      setPreloaderStatus(
        'Matrix sequence',
        'Scanning structural coordinates and calibrating site telemetry…'
      );
    }, PHASE_ONE_MS);

    setTimeout(() => {
      preloader.classList.add('crumble');
      stopMatrixAnimation();
      setTimeout(() => {
        preloader.style.display = 'none';
        document.querySelector('.hero .reveal')?.classList.add('visible');
        initializeROI();
        renderScorecard();
      }, EXIT_MS);
    }, PHASE_ONE_MS + PHASE_TWO_MS);
  } else {
    initializeROI();
    renderScorecard();
  }
});

function startMatrixRain(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const chars = '01SIGNATUREINTELLIGENCE';
  const fontSize = 18;
  let columns = 0;
  let drops = [];
  let animationFrame = 0;
  let running = true;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
  };

  const draw = () => {
    if (!running) return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px ui-monospace, monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const isHead = Math.random() > 0.92;
      ctx.fillStyle = isHead ? 'rgba(212, 175, 55, 0.55)' : 'rgba(165, 140, 70, 0.2)';
      ctx.fillText(text, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    animationFrame = window.requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);

  if (reduceMotion) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.font = `${fontSize}px ui-monospace, monospace`;
    for (let col = 0; col < Math.min(columns, 40); col += 2) {
      for (let row = 0; row < 12; row++) {
        ctx.fillText(
          chars.charAt(Math.floor(Math.random() * chars.length)),
          col * fontSize,
          row * fontSize + 40
        );
      }
    }
    return () => {
      running = false;
      window.removeEventListener('resize', resize);
    };
  }

  draw();

  return () => {
    running = false;
    window.cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
  };
}

// 1. Reveal Engine
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { 
    if(e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Navigation Scroll & Scrolled State
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
});

// Logo Refresh / Scroll to Top
const logo = document.getElementById('logo-refresh');
if (logo) {
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Nav Links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// 2. ROI Calculator Logic
function initializeROI() {
  const slider = document.getElementById('roi-slider');
  const capitalDisplay = document.getElementById('roi-display');
  const savingsDisplay = document.getElementById('roi-savings');

  if (slider && capitalDisplay && savingsDisplay) {
    const formatBudget = (value) => {
      if (value >= 1000000) {
        const millions = value / 1000000;
        return Number.isInteger(millions) ? `$${millions}M` : `$${millions.toFixed(1)}M`;
      }
      return `$${Math.round(value / 1000)}K`;
    };

    const updateValues = (rawVal) => {
      const val = parseInt(rawVal, 10);
      capitalDisplay.innerText = formatBudget(val);
      const savings = Math.floor(val * 0.03);
      savingsDisplay.innerText = `$${savings.toLocaleString()}`;
    };

    updateValues(slider.value);
    slider.addEventListener('input', (e) => {
      updateValues(e.target.value);
    });
  }
}

// 3. AI Vision / Live Site Feed Interactivity
const fileInput = document.getElementById('vision-file');
const btnUpload = document.getElementById('btn-upload');
const terminalLines = [
  "> INITIATING NEURAL AUDIT PROTOCOL...",
  "> EXTRACTING LOAD-BEARING VECTORS...",
  "> CROSS-REFERENCING HURRICANE CODES...",
  "> CALCULATING STRUCTURAL DEPRECIATION...",
  "> IDENTIFYING HIGH-YIELD UPGRADE ZONES...",
  "> RENDER COMPLETE."
];

if (btnUpload && fileInput) {
  btnUpload.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      updateScorecardMetric('visionUploads');
      const reader = new FileReader();
      const img = document.getElementById('vision-preview-img');
      const placeholder = document.getElementById('vision-placeholder');
      const overlay = document.getElementById('vision-overlay');
      const scanline = document.getElementById('scanline');

      reader.onload = function(e) {
        img.src = e.target.result;
        img.style.display = 'block';
        placeholder.style.display = 'none';
        overlay.innerHTML = '';
        overlay.style.display = 'flex';
        scanline.style.display = 'block';
        scanline.classList.add('scanning');
        img.style.filter = "grayscale(100%) brightness(0.4)";

        let delay = 0;
        terminalLines.forEach((line) => {
          setTimeout(() => {
            const p = document.createElement('p');
            p.className = 'terminal-line';
            p.innerText = line;
            overlay.appendChild(p);
          }, delay);
          delay += 400;
        });

        setTimeout(() => {
          overlay.style.display = 'none';
          img.style.filter = "contrast(1.2) brightness(1.1)";
          scanline.classList.remove('scanning');
          scanline.style.display = 'none';
          
          // Trigger Concierge
          setTimeout(() => {
            toggleConcierge();
            botReply("I have analyzed your structure. Our neural budgeting engine suggests approximately 3% optimization potential. Shall we proceed with the capital audit?");
          }, 1000);
        }, delay + 500);
      }
      reader.readAsDataURL(this.files[0]);
    }
  });
}

// 4. Missed Call Intelligence (AI Concierge)
const concierge = document.getElementById('concierge');
const bubble = document.getElementById('btn-ai-bubble');
const closeConcierge = document.getElementById('concierge-close-btn');

function toggleConcierge() {
  if(concierge) {
    const opening = !concierge.classList.contains('active');
    concierge.classList.toggle('active');
    if (opening) {
      updateScorecardMetric('conciergeEngagements');
    }
    if(concierge.classList.contains('active') && chatStage === 0) {
      setTimeout(() => {
        botReply("Missed Call Intelligence Active. Brandon is currently in the vault. I am authorized to handle your capital inquiries in the interim.");
      }, 500);
    }
  }
}

if (bubble) bubble.addEventListener('click', toggleConcierge);
if (closeConcierge) closeConcierge.addEventListener('click', toggleConcierge);

let chatStage = 0;

function botReply(msg, isUser = false) {
  if (!msg.trim()) return;
  const chat = document.getElementById('chat');
  if (!chat) return;
  
  if (isUser) {
    const userMsg = document.createElement('div');
    userMsg.className = "chat-msg user";
    userMsg.innerText = msg;
    chat.appendChild(userMsg);
    
    document.getElementById('chat-input-field').value = '';
    chat.scrollTop = chat.scrollHeight;
    setTimeout(() => handleLogic(msg), 800);
  } else {
    const botMsg = document.createElement('div');
    botMsg.className = "chat-msg bot";
    botMsg.innerText = msg;
    chat.appendChild(botMsg);
    chat.scrollTop = chat.scrollHeight;
  }
}

function handleLogic(userText) {
  if (chatStage === 0) {
    botReply("Confirmed. Signature intelligence can launch with project budgets starting at $10,000 and scale through $10,000,000. Does your project align with that range?");
    chatStage++;
  } else if (chatStage === 1) {
    if(userText.toLowerCase().includes('yes')) {
      updateScorecardMetric('qualifiedLeadActions');
      botReply("Strategic alignment confirmed. I am initiating the missed-call text-back system for your profile. You will receive a direct notification once the neural scan of your project coordinates is complete.");
      chatStage++;
    } else {
      botReply("Understood. We can still provide a lighter-scope planning package, then scale automation as your budget grows.");
      chatStage = 99;
    }
  }
}

const chatField = document.getElementById('chat-input-field');
if (chatField) {
  chatField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') botReply(chatField.value, true);
  });
}

// 5. The Vault (Client Portal)
const vaultModal = document.getElementById('vault-modal');
const btnOpenVault = document.getElementById('btn-open-vault');
const btnCloseVault = document.getElementById('vault-close-btn');

if (btnOpenVault) {
  btnOpenVault.addEventListener('click', () => {
    if (vaultModal) {
      vaultModal.classList.add('active');
    }
    updateScorecardMetric('qualifiedLeadActions');
    // Randomize some dashboard metrics for state-of-the-art feel
    const variance = document.getElementById('vault-variance');
    if (variance) {
      variance.innerText = `VARIANCE: -${(Math.random() * 2 + 0.5).toFixed(2)}% (HIGHLY OPTIMIZED)`;
    }
  });
}
if (btnCloseVault) {
  btnCloseVault.addEventListener('click', () => {
    if (vaultModal) {
      vaultModal.classList.remove('active');
    }
  });
}

const visionCta = document.querySelector('.btn-scroll-vision');
if (visionCta) {
  visionCta.addEventListener('click', () => {
    const target = document.getElementById('vision-section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    updateScorecardMetric('qualifiedLeadActions');
  });
}

// 3D Scan Visualization (Mockup Interactivity)
const scan3D = document.querySelector('.scanline-3d');
if (scan3D) {
  // Add subtle glow follow if needed, but CSS handles pulse
}
