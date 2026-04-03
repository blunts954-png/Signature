import './style.css'

// 0. Preloader Logic
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('wall-fall');
      setTimeout(() => {
        preloader.style.display = 'none';
        initializePanopticon();
      }, 1500); // Wait for the animation to finish
    }, 1000); // Show logo for 1 second before falling
  } else {
    initializePanopticon();
  }
});

// 1. Reveal Engine & Dynamic Schema
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { 
    if(e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
  const bg = document.querySelector('.parallax-bg');
  if (bg) {
    let scrolled = window.pageYOffset;
    bg.style.transform = `translateY(${scrolled * 0.4}px)`;
  }
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
});

// Navigation Scroll Links
document.querySelectorAll('.nav-link, .btn-scroll-vision, #logo-refresh').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    if(el.id === 'logo-refresh') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    let target = '';
    if(el.classList.contains('btn-scroll-vision')) target = 'vision-section';
    else target = el.getAttribute('href').substring(1);
    
    const targetEl = document.getElementById(target);
    if(targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
  });
});

// 2. The Panopticon (Behavioral Tracking & Domination)
function initializePanopticon() {
  let p = JSON.parse(localStorage.getItem('sig_intel') || '{"res":0,"com":0,"scrollDepth":0,"techTime":0}');
  
  // Track dwell time
  let lastScroll = Date.now();
  
  window.addEventListener('scroll', () => {
    let now = Date.now();
    let scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if(scrollDepth > p.scrollDepth) p.scrollDepth = scrollDepth;
    localStorage.setItem('sig_intel', JSON.stringify(p));
  });

  // Track specific interest (simulated dwell tracking for cards)
  document.querySelectorAll('.feed-card').forEach(card => {
    let enterTime = 0;
    card.addEventListener('mouseenter', () => { enterTime = Date.now(); });
    card.addEventListener('mouseleave', () => {
      let duration = Date.now() - enterTime;
      let type = card.dataset.type.toLowerCase();
      p[type] += duration;
      localStorage.setItem('sig_intel', JSON.stringify(p));
    });
    card.addEventListener('click', () => {
      p[card.dataset.type.toLowerCase()] += 10000; // heavy weight for click
      localStorage.setItem('sig_intel', JSON.stringify(p));
      applyPsychologicalSort();
    });
  });

  applyPsychologicalSort();
}

function applyPsychologicalSort() {
  let p = JSON.parse(localStorage.getItem('sig_intel') || '{"res":0,"com":0}');
  const feed = document.getElementById('feed');
  if (feed) {
    const cards = Array.from(feed.children);
    // Sort so their highest interest is shown FIRST
    cards.sort((a,b) => (p[b.dataset.type.toLowerCase()] || 0) - (p[a.dataset.type.toLowerCase()] || 0));
    cards.forEach(c => feed.appendChild(c));
  }
}

// 3. AI Vision Simulation (Diagnostic Terminal)
const fileInput = document.getElementById('vision-file');
const btnUpload = document.getElementById('btn-upload');

const terminalLines = [
  "> INITIATING NEURAL AUDIT PROTOCOL...",
  "> EXTRACTING LOAD-BEARING VECTORS...",
  "> CROSS-REFERENCING 2024 HURRICANE CODES...",
  "> CALCULATING STRUCTURAL DEPRECIATION...",
  "> IDENTIFYING HIGH-YIELD UPGRADE ZONES...",
  "> INJECTING SIGNATURE ARCHITECTURAL MATRIX...",
  "> RENDER COMPLETE."
];

if (btnUpload && fileInput) {
  btnUpload.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
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
        img.style.filter = "grayscale(100%) contrast(1.5) brightness(0.5)"; // Start dark

        let delay = 0;
        terminalLines.forEach((line, index) => {
          setTimeout(() => {
            const p = document.createElement('p');
            p.className = 'terminal-line';
            p.innerText = line;
            overlay.appendChild(p);
          }, delay);
          delay += Math.random() * 400 + 300; // randomized human-like terminal output
        });

        setTimeout(() => {
          // Final Reveal
          overlay.style.display = 'none';
          img.style.filter = "contrast(1.2) brightness(1.1) saturate(1.2)"; // Signature Filter
          scanline.classList.remove('scanning');
          scanline.style.display = 'none';
          
          // Trigger Concierge Interruption
          setTimeout(() => {
            toggleConcierge();
            botReply("I have reviewed your space. Are you prepared for the capital required to execute this vision properly?");
          }, 1500);

        }, delay + 500);
      }
      reader.readAsDataURL(this.files[0]);
    }
  });
}

// 4. The Interrogator (AI Concierge Logic)
const concierge = document.getElementById('concierge');
const bubble = document.getElementById('btn-ai-bubble');
const closeConcierge = document.getElementById('concierge-close-btn');

function toggleConcierge() {
  if(concierge) {
    concierge.classList.toggle('active');
    if(concierge.classList.contains('active') && chatStage === 0) {
      setTimeout(() => {
        // Intentionally aggressive opening
        // document.getElementById('chat').innerHTML = '';
        // botReply("Are you building a legacy, or just another structure?");
      }, 500);
    }
  }
}

if (bubble) bubble.addEventListener('click', toggleConcierge);
if (closeConcierge) closeConcierge.addEventListener('click', toggleConcierge);

let chatStage = 0;
let projectType = '';

function botReply(msg, isUser = false) {
  if (!msg.trim()) return;
  const chat = document.getElementById('chat');
  
  if (isUser) {
    const userMsg = document.createElement('div');
    userMsg.className = "chat-msg user";
    userMsg.innerText = msg;
    chat.appendChild(userMsg);
    
    const chatInput = document.getElementById('chat-input-field');
    if (chatInput) chatInput.value = '';
    chat.scrollTop = chat.scrollHeight;

    // Simulate thinking delay
    setTimeout(() => handleLogic(msg), Math.random() * 800 + 600);
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
    projectType = userText;
    botReply("Acknowledged. Our minimum engagement for bespoke projects begins at $10,000. Does your financial reality align with this requirement?");
    chatStage++;
  } else if (chatStage === 1) {
    if(userText.toLowerCase().includes('yes') || userText.toLowerCase().includes('y')) {
      botReply("Proceeding. What is the specific zip code or neighborhood for this development?");
      chatStage++;
    } else {
      botReply("Signature Contracting does not compromise on materials or execution. We recommend reviewing our tech stack to understand the value of our neural budgeting.");
      chatStage = 99; // End thread
    }
  } else if (chatStage === 2) {
    botReply(`Location locked. Initiating preliminary demographic and zoning intelligence. Brandon has been notified of your intent. We will not waste your time; do not waste ours.`);
    chatStage++;
  } else {
    // Silent drop - psychological distance
  }
}

// Attach Concierge Input Events
const chatInput = document.getElementById('chat-input-field');
if (chatInput) {
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') botReply(chatInput.value, true);
  });
}

const resBtn = document.querySelector('.btn-residential');
const comBtn = document.querySelector('.btn-commercial');
if (resBtn) resBtn.addEventListener('click', () => botReply('Residential', true));
if (comBtn) comBtn.addEventListener('click', () => botReply('Commercial', true));


// 5. Vault Logic (Live Data Simulation)
const vaultModal = document.getElementById('vault-modal');
const btnOpenVault = document.getElementById('btn-open-vault');
const btnCloseVault = document.getElementById('vault-close-btn');
const btnDownloadReport = document.getElementById('btn-download-report');

if (btnOpenVault) btnOpenVault.addEventListener('click', () => {
  vaultModal.classList.add('active');
  // Inject live date math
  const varianceEl = document.getElementById('vault-variance');
  if(varianceEl) {
    let dayOfMonth = new Date().getDate();
    let calculatedVariance = -(1.2 + (dayOfMonth * 0.01)).toFixed(2); // Fake dynamic number
    varianceEl.innerText = `VARIANCE: ${calculatedVariance}% (OPTIMIZED)`;
  }
});
if (btnCloseVault) btnCloseVault.addEventListener('click', () => vaultModal.classList.remove('active'));

if (btnDownloadReport) {
  btnDownloadReport.addEventListener('click', () => {
    btnDownloadReport.innerText = 'AUTHENTICATING...';
    setTimeout(() => {
      btnDownloadReport.innerText = 'REPORT ENCRYPTED & SENT';
      btnDownloadReport.style.background = 'var(--gold-primary)';
      btnDownloadReport.style.color = '#000';
    }, 1500);
  });
}

// Interactive Audit Card in Vault
const auditCard = document.querySelector('.vault-audit-card');
if (auditCard) {
  auditCard.addEventListener('click', () => {
    const originalText = auditCard.innerHTML;
    auditCard.innerHTML = `<h3 class="serif gold-text" style="margin-bottom: 10px; font-size: 1.5rem;">Authenticating Layer...</h3><div class="vision-scanline scanning" style="display:block; position:relative; height:2px; width:100%; margin-top:20px;"></div>`;
    setTimeout(() => {
      auditCard.innerHTML = originalText;
    }, 2000);
  });
}
