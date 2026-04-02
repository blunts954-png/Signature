import './style.css'

// 0. Preloader Logic
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
      // Trigger animations for the first section
      applyPersonalization();
    }, 1000);
  } else {
    applyPersonalization();
  }
});

// 1. Reveal Engine
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
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

// 2. Personalization Logic
function trackClick(type) {
  let p = JSON.parse(localStorage.getItem('sig_p') || '{"Res":0,"Com":0}');
  p[type]++;
  localStorage.setItem('sig_p', JSON.stringify(p));
  console.log(`Adapting UI for ${type} preference...`);
}

function applyPersonalization() {
  let p = JSON.parse(localStorage.getItem('sig_p') || '{"Res":0,"Com":0}');
  const feed = document.getElementById('feed');
  if (feed) {
    const cards = Array.from(feed.children);
    cards.sort((a,b) => (p[b.dataset.type] || 0) - (p[a.dataset.type] || 0));
    cards.forEach(c => feed.appendChild(c));
    
    // Attach event listeners
    cards.forEach(c => {
      c.addEventListener('click', () => trackClick(c.dataset.type));
    });
  }
}

// 3. AI Vision Simulation
const fileInput = document.getElementById('vision-file');
const btnUpload = document.getElementById('btn-upload');
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
        
        overlay.style.display = 'flex';
        scanline.style.display = 'block';
        scanline.classList.add('scanning');

        setTimeout(() => {
          overlay.innerHTML = "Signature Neural Audit Complete.<br><span class='gold-text' style='font-size:0.6rem'>Potential Value Increase: +42%</span>";
          img.style.filter = "contrast(1.2) brightness(0.8) sepia(0.3) saturate(0.5)"; // Signature Filter
          scanline.classList.remove('scanning');
          scanline.style.display = 'none';
        }, 3000);
      }
      reader.readAsDataURL(this.files[0]);
    }
  });
}

// 4. AI Concierge Logic
const concierge = document.getElementById('concierge');
const bubble = document.getElementById('btn-ai-bubble');
const closeConcierge = document.getElementById('concierge-close-btn');

function toggleConcierge() {
  if(concierge) concierge.classList.toggle('active');
}

if (bubble) bubble.addEventListener('click', toggleConcierge);
if (closeConcierge) closeConcierge.addEventListener('click', toggleConcierge);

let chatStage = 0;
let projectType = '';

function botReply(msg) {
  if (!msg.trim()) return;
  const chat = document.getElementById('chat');
  const userMsg = document.createElement('div');
  userMsg.className = "chat-msg user";
  userMsg.innerText = msg;
  chat.appendChild(userMsg);
  
  const chatInput = document.getElementById('chat-input-field');
  if (chatInput) chatInput.value = '';
  chat.scrollTop = chat.scrollHeight;

  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = "chat-msg bot";
    
    if (chatStage === 0) {
      projectType = msg;
      botMsg.innerText = "Excellent choice. " + msg + " excellence is our heritage. What is the location or zip code of the project?";
      chatStage++;
    } else if (chatStage === 1) {
      botMsg.innerText = "Perfect. And finally, what is the anticipated budget tier for this project?";
      chatStage++;
    } else if (chatStage === 2) {
      botMsg.innerText = `I have recorded that. Analyzing architectural feasibility for your ${projectType} project. Brandon will reach out shortly to begin the drafting phase.`;
      chatStage++;
    } else {
      botMsg.innerText = `Thank you. The Signature Intelligence Agent will notify Brandon regarding any further details you provide.`;
    }

    chat.appendChild(botMsg);
    chat.scrollTop = chat.scrollHeight;
  }, 1000);
}

// Attach Concierge Input Events
const chatInput = document.getElementById('chat-input-field');
if (chatInput) {
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') botReply(chatInput.value);
  });
}

const resBtn = document.querySelector('.btn-residential');
const comBtn = document.querySelector('.btn-commercial');
if (resBtn) resBtn.addEventListener('click', () => botReply('Residential'));
if (comBtn) comBtn.addEventListener('click', () => botReply('Commercial'));

// 5. Vault Logic
const vaultModal = document.getElementById('vault-modal');
const btnOpenVault = document.getElementById('btn-open-vault');
const btnCloseVault = document.getElementById('vault-close-btn');
const btnDownloadReport = document.getElementById('btn-download-report');

if (btnOpenVault) btnOpenVault.addEventListener('click', () => vaultModal.classList.add('active'));
if (btnCloseVault) btnCloseVault.addEventListener('click', () => vaultModal.classList.remove('active'));
if (btnDownloadReport) {
  btnDownloadReport.addEventListener('click', () => {
    btnDownloadReport.innerText = 'Compiling PDF...';
    setTimeout(() => {
      btnDownloadReport.innerText = 'Report Sent to Email';
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
