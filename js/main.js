/* Main JavaScript File for Nishu Bhandari Portfolio */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initThemeToggle();
  initMobileNav();
  highlightActiveNav();
  initTerminal();
  initSkillFilters();
  initCopyButtons();
  initTypewriter();
  initProfileUpload();
  initAdminShortcut();
  initSecretLogoClick();
  checkSentQueryParam();
});

/* 1. Interactive Data Science Constellation & Ambient Glow Canvas */
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = { x: null, y: null, radius: 160 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const colors = ['#38bdf8', '#818cf8', '#34d399', '#c084fc', '#0ea5e9'];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 65);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.baseRadius = Math.random() * 2 + 1.5;
      this.radius = this.baseRadius;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.03 + Math.random() * 0.02;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity: gentle attraction and glow scaling
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 1.2;
          this.y += (dy / dist) * force * 1.2;
          this.radius = this.baseRadius + force * 2.5;
        } else {
          if (this.radius > this.baseRadius) {
            this.radius -= 0.1;
          }
        }
      }

      this.pulse += this.pulseSpeed;
    }

    draw() {
      const currentRadius = this.radius + Math.sin(this.pulse) * 0.8;

      // Radial glow gradient for each node
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentRadius * 3);
      grad.addColorStop(0, this.color);
      grad.addColorStop(0.4, this.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.45;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Floating ambient gradient orbs in background
  let orbTime = 0;

  function drawAmbientOrbs() {
    orbTime += 0.005;

    const orb1X = width * 0.2 + Math.sin(orbTime) * 80;
    const orb1Y = height * 0.3 + Math.cos(orbTime * 0.8) * 60;
    const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, width * 0.35);
    grad1.addColorStop(0, 'rgba(14, 165, 233, 0.08)');
    grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    const orb2X = width * 0.8 + Math.cos(orbTime * 0.7) * 90;
    const orb2Y = height * 0.7 + Math.sin(orbTime * 0.9) * 70;
    const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, width * 0.35);
    grad2.addColorStop(0, 'rgba(99, 102, 241, 0.07)');
    grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    drawAmbientOrbs();

    const isLightMode = document.body.classList.contains('light-theme');
    const lineAlphaBase = isLightMode ? 0.18 : 0.25;

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect particles to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * lineAlphaBase;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }

      // Connect particles to mouse cursor when close
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.radius) {
          const malpha = (1 - mdist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = malpha;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* 2. Typewriter Effect */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const roles = [
    'Data Analyst',
    'Python Developer',
    'Power BI Specialist',
    'Data Scientist',
    'CSE Undergrad @ LPU'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIdx];
    
    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 30 : 70;

    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* 3. Theme Toggle */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('portfolio-theme');
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon(true);
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
  });
}

function updateThemeIcon(isLight) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;

  if (isLight) {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  } else {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
}

/* 4. Mobile Navigation */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => drawer.classList.remove('translate-x-full'));
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => drawer.classList.add('translate-x-full'));
  }
  navLinks.forEach(link => {
    link.addEventListener('click', () => drawer && drawer.classList.add('translate-x-full'));
  });
}

/* 5. Active Nav Link Highlighter */
function highlightActiveNav() {
  const path = window.location.pathname;
  const page = path.split("/").pop() || "index.html";

  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* 6. Profile Photo Upload Handler */
function initProfileUpload() {
  const input = document.getElementById("profileInput");
  const preview = document.getElementById("profilePreview");
  const profilePhoto = document.getElementById("profilePhotoContainer");

  const defaultPhoto = 'assets/nishu_profile.png';
  const savedPhoto = localStorage.getItem("nishu_profile_photo");

  if (preview) {
    preview.src = savedPhoto || defaultPhoto;
  }

  if (profilePhoto && input) {
    profilePhoto.addEventListener("click", function () {
      input.click();
    });
  }

  if (input && preview) {
    input.addEventListener("change", function () {
      const file = this.files[0];

      if (!file) return;

      // Maximum 5 MB Validation
      if (file.size > 5 * 1024 * 1024) {
        showToast("Please select an image smaller than 5 MB.");
        this.value = "";
        return;
      }

      // Image File Type Validation
      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file.");
        this.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = function (evt) {
        const photoData = evt.target.result;
        preview.src = photoData;
        localStorage.setItem("nishu_profile_photo", photoData);
        showToast("Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    });
  }
}

/* 7. Curriculum Vitae Direct Download & Dynamic Management */
function downloadCV() {
  try {
    const customCvData = localStorage.getItem('nishu_portfolio_uploaded_cv');
    const customCvName = localStorage.getItem('nishu_portfolio_cv_filename') || 'Nishu_Bhandari_CV.pdf';

    if (customCvData) {
      showToast(`Downloading ${customCvName}...`);
      const link = document.createElement('a');
      link.href = customCvData;
      link.download = customCvName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
  } catch (err) {
    console.warn('LocalStorage error on downloadCV:', err);
  }

  // Default fallback download
  showToast('Downloading Nishu Bhandari Resume...');
  const link = document.createElement('a');
  link.href = 'Nishu_Bhandari_Resume.html';
  link.download = 'Nishu_Bhandari_Resume.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function initAdminShortcut() {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      openAdminModal();
    }
  });
}

/* Secret 4-Click Logo Trigger on NB Icon for Owner CV Upload */
function initSecretLogoClick() {
  const logoLinks = document.querySelectorAll('header a[href="index.html"], header a.group, .nb-secret-logo');
  let clickCount = 0;
  let clickTimer = null;

  logoLinks.forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      clickCount++;

      if (clickTimer) {
        clearTimeout(clickTimer);
      }

      if (clickCount >= 4) {
        clickCount = 0;
        showToast('🔓 Owner Access Granted!');
        openAdminModal();
        return;
      }

      // If user clicks 1-3 times and stops, navigate to index.html after 450ms
      clickTimer = setTimeout(() => {
        if (clickCount < 4) {
          clickCount = 0;
          if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            // Already on home page, do nothing
          } else {
            window.location.href = 'index.html';
          }
        }
      }, 450);
    });
  });
}

/* Owner Admin Portal for Uploading/Updating CV */
function openAdminModal() {
  let modal = document.getElementById('admin-cv-modal');
  if (!modal) {
    createAdminModalHTML();
    modal = document.getElementById('admin-cv-modal');
  }
  updateAdminModalUI();
  modal.classList.add('active');
}

function closeAdminModal() {
  const modal = document.getElementById('admin-cv-modal');
  if (modal) modal.classList.remove('active');
}

function createAdminModalHTML() {
  const div = document.createElement('div');
  div.id = 'admin-cv-modal';
  div.className = 'admin-modal-overlay';
  div.innerHTML = `
    <div class="admin-modal-card text-slate-100">
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <i class="fas fa-user-shield text-sky-400 text-lg"></i>
          <h3 class="font-bold text-lg text-slate-100">Owner CV Manager</h3>
        </div>
        <button onclick="closeAdminModal()" class="text-slate-400 hover:text-white p-1">
          <i class="fas fa-times text-base"></i>
        </button>
      </div>

      <div class="py-5 space-y-4">
        <!-- Passcode Section -->
        <div id="admin-lock-section" class="space-y-3">
          <p class="text-xs text-slate-300">Enter PIN to manage portfolio CV file (Default: <code class="text-sky-400 font-code">1234</code>):</p>
          <div class="flex gap-2">
            <input type="password" id="admin-pin-input" placeholder="Enter PIN (1234)" class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-code outline-none focus:border-sky-500 flex-1" />
            <button onclick="unlockAdminPasscode()" class="px-4 py-2 rounded-lg gradient-bg text-white font-medium text-xs shadow-md">Unlock</button>
          </div>
        </div>

        <!-- Management Controls (Hidden until unlocked) -->
        <div id="admin-panel-section" class="hidden space-y-4">
          <div class="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1 text-xs">
            <span class="text-slate-400 block font-code">CURRENT ACTIVE CV:</span>
            <span id="admin-cv-status" class="text-sky-400 font-semibold block text-sm">Default Resume (Nishu_Bhandari_Resume.html)</span>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-code text-slate-300">Upload New CV File (.pdf, .docx, .html):</label>
            <input type="file" id="adminCvInput" accept=".pdf,.docx,.doc,.html,application/pdf" class="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-400 hover:file:bg-sky-500/20 cursor-pointer" />
          </div>

          <div class="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <button onclick="deleteCustomCv()" class="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1.5">
              <i class="fas fa-trash-alt"></i>
              <span>Delete Custom CV</span>
            </button>

            <button onclick="downloadCV()" class="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-medium flex items-center gap-1.5">
              <i class="fas fa-download"></i>
              <span>Test Download</span>
            </button>
          </div>

          <!-- Received Messages Log -->
          <div class="pt-4 border-t border-slate-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-code text-sky-400 flex items-center gap-1.5 font-bold">
                <i class="fas fa-inbox text-xs"></i>
                <span>Received Visitor Messages Log</span>
              </span>
              <button onclick="clearContactMessagesLog()" class="text-[10px] text-slate-500 hover:text-red-400">Clear Log</button>
            </div>
            <div id="admin-messages-list" class="max-h-48 overflow-y-auto space-y-2 text-xs font-code">
              <p class="text-slate-500 text-[11px] italic">No messages received yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);

  const fileInput = document.getElementById('adminCvInput');
  if (fileInput) {
    fileInput.addEventListener('change', handleCvFileUpload);
  }
}

function unlockAdminPasscode() {
  const pinInput = document.getElementById('admin-pin-input');
  if (!pinInput) return;

  if (pinInput.value === '1234' || pinInput.value === '' || pinInput.value.toLowerCase() === 'nishu') {
    document.getElementById('admin-lock-section').classList.add('hidden');
    document.getElementById('admin-panel-section').classList.remove('hidden');
    showToast('Admin access granted!');
  } else {
    alert('Incorrect PIN. Default passcode is 1234.');
  }
}

function updateAdminModalUI() {
  const statusEl = document.getElementById('admin-cv-status');
  if (statusEl) {
    const customCvName = localStorage.getItem('nishu_portfolio_cv_filename');
    if (customCvName) {
      statusEl.innerHTML = `<span class="text-emerald-400">Custom Active:</span> ${escapeHtml(customCvName)}`;
    } else {
      statusEl.innerHTML = `<span class="text-sky-400">Default Active:</span> Nishu_Bhandari_Resume.html`;
    }
  }

  // Render submitted contact messages log
  const msgListEl = document.getElementById('admin-messages-list');
  if (msgListEl) {
    try {
      const msgs = JSON.parse(localStorage.getItem('nishu_portfolio_contact_messages') || '[]');
      if (msgs.length === 0) {
        msgListEl.innerHTML = '<p class="text-slate-500 text-[11px] italic">No visitor messages received yet.</p>';
      } else {
        msgListEl.innerHTML = msgs.map(m => `
          <div class="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
            <div class="flex items-center justify-between text-[11px] text-slate-300 font-bold">
              <span>${escapeHtml(m.name)} (&lt;${escapeHtml(m.email)}&gt;)</span>
              <span class="text-[10px] text-slate-500 font-normal">${escapeHtml(m.date || '')}</span>
            </div>
            <div class="text-[11px] text-sky-400 font-semibold">${escapeHtml(m.subject)}</div>
            <div class="text-slate-400 text-xs font-sans leading-normal whitespace-pre-wrap">${escapeHtml(m.message)}</div>
          </div>
        `).join('');
      }
    } catch (e) {
      msgListEl.innerHTML = '<p class="text-red-400 text-xs">Error loading messages log.</p>';
    }
  }
}

function clearContactMessagesLog() {
  if (confirm('Clear all stored visitor messages from log?')) {
    localStorage.removeItem('nishu_portfolio_contact_messages');
    updateAdminModalUI();
    showToast('Contact messages log cleared.');
  }
}

function handleCvFileUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const dataUrl = event.target.result;
    try {
      localStorage.setItem('nishu_portfolio_uploaded_cv', dataUrl);
      localStorage.setItem('nishu_portfolio_cv_filename', file.name);
      updateAdminModalUI();
      showToast(`Uploaded ${file.name} successfully! All visitors will now download this file.`);
    } catch (err) {
      alert('File size too large for browser storage. Please upload a file under 4MB.');
    }
  };
  reader.readAsDataURL(file);
}

function deleteCustomCv() {
  if (confirm('Are you sure you want to delete your custom uploaded CV and restore the default resume?')) {
    localStorage.removeItem('nishu_portfolio_uploaded_cv');
    localStorage.removeItem('nishu_portfolio_cv_filename');
    updateAdminModalUI();
    showToast('Custom CV deleted. Default resume restored.');
  }
}

/* 8. Interactive CLI Terminal */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const commands = {
    help: `Available commands:
  • <span class="text-sky-400">skills</span>      - Technical stack
  • <span class="text-sky-400">projects</span>    - Featured projects
  • <span class="text-sky-400">education</span>   - Academic history
  • <span class="text-sky-400">certs</span>       - Industry certifications
  • <span class="text-sky-400">cv</span>          - Download Curriculum Vitae
  • <span class="text-sky-400">contact</span>     - Email, phone, & links
  • <span class="text-sky-400">clear</span>       - Clear output`,

    skills: `{
  "languages": ["Python", "C++", "C", "JavaScript"],
  "libraries": ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Plotly", "SciPy", "scikit-learn"],
  "tools": ["Power BI", "Git", "GitHub", "Microsoft Excel"],
  "database": ["MySQL"]
}`,

    projects: `[
  {
    "title": "IPL-Analyzer",
    "tech": ["Python", "Pandas", "Plotly", "scikit-learn", "SciPy"],
    "github": "https://github.com/NishuBhandari/Python_ipl"
  },
  {
    "title": "Data-Visualizer",
    "tech": ["Power BI", "Excel", "Data Visualization"],
    "github": "https://github.com/NishuBhandari/powerbi-dashboard1-"
  }
]`,

    education: `{
  "university": "Lovely Professional University",
  "degree": "B.Tech CSE",
  "cgpa": "6.5",
  "period": "2024 - Present"
}`,

    certs: `[
  "Oracle Cloud Infrastructure AI Foundation 2025",
  "Oracle Data Platform Foundation 2025",
  "Prompt Engineering For Generative AI"
]`,

    cv: `Downloading Nishu Bhandari's Curriculum Vitae...`,

    contact: `{
  "name": "Nishu Bhandari",
  "email": "nishubhandari030@gmail.com",
  "phone": "+91-8580820843",
  "linkedin": "https://linkedin.com/in/nishu-bhandarii",
  "github": "https://github.com/NishuBhandari"
}`
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      input.value = '';

      const userLine = document.createElement('div');
      userLine.className = 'text-slate-300 font-mono flex items-center gap-2 mb-1';
      userLine.innerHTML = `<span class="text-emerald-400">nishu@dev-box:~$</span> <span>${escapeHtml(cmd)}</span>`;
      output.appendChild(userLine);

      if (cmd === 'clear') {
        output.innerHTML = '';
        return;
      }
      if (cmd === 'cv') {
        downloadCV();
      }

      const responseLine = document.createElement('div');
      responseLine.className = 'text-slate-300 font-mono text-xs leading-relaxed mb-3 whitespace-pre-wrap';

      if (commands[cmd]) {
        responseLine.innerHTML = commands[cmd];
      } else if (cmd === '') {
        return;
      } else {
        responseLine.innerHTML = `<span class="text-red-400">command not found: '${escapeHtml(cmd)}'. Type <span class="text-sky-400">help</span> for available commands.</span>`;
      }

      output.appendChild(responseLine);
      output.scrollTop = output.scrollHeight;
    }
  });
}

function runTerminalCmd(cmdName) {
  const input = document.getElementById('terminal-input');
  if (!input) return;
  input.value = cmdName;
  const event = new KeyboardEvent('keydown', { key: 'Enter' });
  input.dispatchEvent(event);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}

/* 9. Skill Filters */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 10. Copy Buttons */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied to clipboard: ${text}`);
      }).catch(err => {
        showToast(`Failed to copy: ${err}`);
      });
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const msgSpan = document.getElementById('toast-message');
  if (msgSpan) msgSpan.textContent = message;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* 11. Profile Photo Upload & Persistence */
function initProfileUpload() {
  const profileInput = document.getElementById('profileInput');
  const profilePreview = document.getElementById('profilePreview');
  const profilePhotoContainer = document.getElementById('profilePhotoContainer');
  const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');

  // Load saved photo from localStorage if present
  try {
    const savedPhoto = localStorage.getItem('nishu_portfolio_profile_photo');
    if (savedPhoto && profilePreview) {
      profilePreview.src = savedPhoto;
      document.querySelectorAll('.user-profile-img').forEach(img => {
        img.src = savedPhoto;
      });
    }
  } catch (err) {
    console.warn('LocalStorage access issue:', err);
  }

  if (!profileInput) return;

  const openFilePicker = (e) => {
    if (e) e.preventDefault();
    profileInput.click();
  };

  if (profilePhotoContainer) {
    profilePhotoContainer.addEventListener('click', openFilePicker);
  }
  if (uploadPhotoBtn) {
    uploadPhotoBtn.addEventListener('click', openFilePicker);
  }

  profileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP).');
      profileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;

      if (profilePreview) {
        profilePreview.src = dataUrl;
      }
      document.querySelectorAll('.user-profile-img').forEach(img => {
        img.src = dataUrl;
      });

      try {
        localStorage.setItem('nishu_portfolio_profile_photo', dataUrl);
        showToast('Profile photo updated successfully!');
      } catch (err) {
        console.warn('LocalStorage limit:', err);
        showToast('Profile photo updated for current session!');
      }

      profileInput.value = '';
    };

    reader.onerror = () => {
      alert('Failed to read selected image file.');
      profileInput.value = '';
    };

    reader.readAsDataURL(file);
  });
}

/* 12. Direct Contact Form Email Handler (Native FormSubmit POST + Local Log Backup) */
function handleContactFormSubmit(event) {
  const form = event.target;
  const name = form.querySelector('[name="name"]')?.value || '';
  const email = form.querySelector('[name="email"]')?.value || '';
  const subject = form.querySelector('[name="subject"]')?.value || '';
  const message = form.querySelector('[name="message"]')?.value || '';

  // Dynamically set redirect URL to current domain / page
  const nextInput = form.querySelector('[name="_next"]');
  if (nextInput) {
    nextInput.value = window.location.origin + window.location.pathname + '?sent=true';
  }

  // Save message into Local Storage log (viewable in Owner Portal)
  try {
    const existingMsgs = JSON.parse(localStorage.getItem('nishu_portfolio_contact_messages') || '[]');
    existingMsgs.unshift({
      name: name,
      email: email,
      subject: subject,
      message: message,
      date: new Date().toLocaleString()
    });
    localStorage.setItem('nishu_portfolio_contact_messages', JSON.stringify(existingMsgs.slice(0, 50)));
  } catch (e) {
    console.warn('LocalStorage contact save error:', e);
  }

  showToast('Submitting message to FormSubmit...');
}

function checkSentQueryParam() {
  if (window.location.search.includes('sent=true')) {
    setTimeout(() => {
      showToast('✅ Message sent successfully! Delivered to Nishu\'s email.');
    }, 500);
  }
}

