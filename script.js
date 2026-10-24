/**
 * ELNONN // THE OFFICIAL PERSONAL DOSSIER
 * Interactive Engine: Web Audio Synth, Compatibility Algorithm, Case Studies & WhatsApp Bridge
 */

// --- 1. Sound Engine (Web Audio API) ---
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('dossier_muted') === 'true';
    this.initContext();
  }

  initContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext && !this.ctx) {
      this.ctx = new AudioContext();
    }
  }

  ensureContext() {
    if (!this.ctx) this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('dossier_muted', this.muted);
    return this.muted;
  }

  // Crisp mechanical typewriter click
  click() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Rubber stamp thump sound
  stamp() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Camera Shutter / Lightbox click
  camera() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(2200, this.ctx.currentTime);
    osc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Ahwa tea glass clink / Notification Bell
  ahwaPing() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1860, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Celebratory Fanfare
  success() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.1);
      osc.stop(this.ctx.currentTime + idx * 0.1 + 0.35);
    });
  }
}

const sfx = new SoundFX();

// --- 2. Live Cairo Clock & Status ---
function initLiveClock() {
  const clockEl = document.getElementById('cairoClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const options = {
      timeZone: 'Africa/Cairo',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const cairoTime = new Intl.DateTimeFormat('en-US', options).format(now);
    clockEl.textContent = `CAIRO: ${cairoTime} (GMT+3)`;
  }
  update();
  setInterval(update, 1000);
}

// --- 3. Theme Management ---
function initTheme() {
  const saved = localStorage.getItem('dossier_theme') || 'kraft';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeBtnLabel(saved);
}

function cycleTheme() {
  const themes = ['kraft', 'cyber', 'noir'];
  const current = document.documentElement.getAttribute('data-theme') || 'kraft';
  const nextIdx = (themes.indexOf(current) + 1) % themes.length;
  const next = themes[nextIdx];
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('dossier_theme', next);
  updateThemeBtnLabel(next);
  sfx.stamp();
}

function updateThemeBtnLabel(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  const labels = {
    kraft: '📁 KRAFT DOSSIER',
    cyber: '📟 CYBER TERMINAL',
    noir: '🗞️ EDITORIAL NOIR'
  };
  btn.textContent = labels[theme] || '📁 THEME';
}

// --- 4. Hero Polaroid 3D Tilt Physics ---
function initPolaroidTilt() {
  const card = document.getElementById('heroPolaroid');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 16;
    const rotateY = (x / rect.width) * 16;
    card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `rotate(-1.5deg)`;
  });

  card.addEventListener('click', () => {
    sfx.stamp();
  });
}

// --- 5. Interactive Ahwa & Sleep Mood Widget ---
function initAhwaWidget() {
  const card = document.getElementById('ahwaCard');
  const moodText = document.getElementById('elnonnMoodText');
  if (!card || !moodText) return;

  const moods = [
    'فاصل وبفكر أنام كمان 10 ساعات 😴',
    'قاعد ع القهوة بشرب شاي وحجر شيشة قص وسجاير ☕💨🚬',
    'مستني ماتش الأهلي عشان نحتفل بالبطولة المعتادة 🦅🔴',
    'سهران بسحل في كود ومشروع جديد 💻',
    'سهرة جيمنج ودسكورد لحد الفجر 🎮',
    'الووو؟ اااه طب تمام.. مقفل دماغي دلوقتي 🕶️'
  ];

  card.addEventListener('click', () => {
    sfx.ahwaPing();
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    moodText.textContent = randomMood;
    card.style.transform = 'scale(0.97)';
    setTimeout(() => {
      card.style.transform = '';
    }, 120);
  });
}

// --- 6. Infinite Buffering "Love %" Easter Egg ---
function initLoveBuffer() {
  const box = document.getElementById('loveBufferingBox');
  const percentText = document.getElementById('lovePercent');
  const statusMsg = document.getElementById('loveStatusMsg');
  if (!box || !percentText) return;

  let retries = 0;
  const logs = [
    'جاري فحص هل هي بتحب القطط ولا لأ... (لو بتحبهم بنقفل)',
    'تحذير: النون نايم حالياً، المحاولة تفشل تلقائياً...',
    'جاري شرب شاي بنعناع لتهدئة الأوفرثينكينج...',
    'الووو؟ اااه طب تمام.. السيستم بيهنج...',
    'خطأ 404: العناد والغيرة فوق المعدل الطبيعي...'
  ];

  box.addEventListener('click', () => {
    sfx.stamp();
    retries++;
    percentText.textContent = `${Math.min(retries * 2, 4)}% (لسه بحمل...)`;
    const log = logs[retries % logs.length];
    if (statusMsg) {
      statusMsg.textContent = log;
    }
  });
}

// --- 7. Secret Romantic Note Reveal ---
function initSecretRomantic() {
  const trigger = document.getElementById('secretRomanticTrigger');
  const noteBox = document.getElementById('secretRomanticNote');
  if (!trigger || !noteBox) return;

  trigger.addEventListener('click', () => {
    sfx.click();
    if (noteBox.style.display === 'block') {
      noteBox.style.display = 'none';
      trigger.textContent = '🔒 دوسي هنا عشان تشوفي نوتة سرية مني';
    } else {
      noteBox.style.display = 'block';
      trigger.textContent = '🔓 نوتة شخصية مكشوفة';
    }
  });
}

// --- 8. Compatibility Calculator (Elnonn Edition) ---
function initCompatibilityTester() {
  const checkboxes = document.querySelectorAll('.compat-check');
  const scoreNum = document.getElementById('compatScoreNum');
  const verdictText = document.getElementById('compatVerdict');
  if (!checkboxes.length || !scoreNum) return;

  function recalculate() {
    sfx.click();
    let checkedCount = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) checkedCount++;
    });

    const total = checkboxes.length;
    const basePercent = Math.round((checkedCount / total) * 100);
    const finalScore = checkedCount === 0 ? 0 : Math.min(100, basePercent + (checkedCount >= 4 ? 12 : 5));

    scoreNum.textContent = `${finalScore}%`;

    if (finalScore === 0) {
      verdictText.textContent = 'لسه ما اخترتيش أي حاجة.. جربي شوفي هتعرفي تسلكي ولا هتهربي من أول أسبوع 😂';
    } else if (finalScore < 50) {
      verdictText.textContent = '⚠️ النتيجة مقلقة.. شكلك مش هتستحملي نومي الكثير وقعدتي ع القهوة وعصبيتي!';
    } else if (finalScore < 85) {
      verdictText.textContent = '✨ نسبة ممتازة جداً! هتعرفي تسلكي معايا وهنعزمك على شاي بنعناع ع القهوة.';
    } else {
      verdictText.textContent = '🚨 إنذار طوارئ: أنتي متوافقة بنسبة خرافية مع النون! لازم تقدمي بروبوزال تحت فوراً!';
      sfx.success();
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', recalculate);
  });
}

// --- 9. Case Studies Lightbox / Modal ---
const caseStudyData = {
  real: {
    title: 'Elnonn in Real Life',
    subtitle: 'CODE: CASE-01-ELNONN-CITY',
    img: './assets/me_real.jpg',
    tag: 'REALITY AUDIT',
    desc: 'الصورة الحقيقية ليا في الشارع بالليل.. بستايل الشارع الواسع والروقان. بعيداً عن السوشيال ميديا والتصنع، دا شكلي ودا جوي.',
    witness: '"أنا بحب أكون على طبيعتي ومش بحب أتصنع علشان أعجب حد.. اللي يعجبه يعجبه واللي ميعجبوش اااه طب تمام."'
  },
  sleep: {
    title: 'The Sleep Coma (غيبوبة النوم)',
    subtitle: 'CODE: CASE-02-SLEEP-MODE',
    img: '',
    tag: 'CHRONIC SLEEP',
    desc: 'حالة غيبوبة معتمدة: ممكن أنام بالـ 12 والـ 14 ساعة ورا بعض.. الموبايل صامت، الدنيا بتولع برة، وأنا في أحلامي السعيدة ولا داري بالكون.',
    witness: '"لو بعتي مسدج ومردتش، 90% أنا نايم.. متقلقيش وماتفتكريش إني متجاهلك."'
  },
  ahwa: {
    title: 'El Ahwa Protocol (الشاي والشيشة القص)',
    subtitle: 'CODE: CASE-03-AHWA-RITUAL',
    img: '',
    tag: 'DAILY SANCTUARY',
    desc: 'القعدة ع القهوة البلدي مع الشاي وحجر الشيشة القص المتولع ع الفحم.. الطقس المقدس اللي بيفصلني عن ضغط الكود ومشاكل الدنيا.',
    witness: '"شرط أساسي: اللي هتبقى مع النون تكون بتعرف ترص حجر شيشة قص وترقص له وتروق على دماغه 💃💨."'
  },
  gaming: {
    title: 'الجيمنج وسهرات البي سي',
    subtitle: 'CODE: CASE-04-GAMING-RIG',
    img: './assets/ev_pc.jpg',
    tag: 'GAMING HAVEN',
    desc: 'شاشات وكيبورد ولعب وسهرات مع الديسكورد.. المكان اللي بفرغ فيه عصبيتي وبقضي فيه أحسن أوقات بالليل.',
    witness: '"لو بتلعبي جيمز هنكون أحسن اتنين صحاب ومرتبطين في التاريخ."'
  },
  catchphrase: {
    title: 'جملتي الشهيرة: اااه طب تمام.. والووو؟',
    subtitle: 'CODE: CASE-05-SIGNATURE-PHRASE',
    img: '',
    tag: 'CORE PHILOSOPHY',
    desc: 'الجملة الرسمية اللي بقولها لما أزهق، أو لما حد يتكلم كلام مش عاجبني، أو لما أكون مسحول في الكود: "اااه طب تمام".. وكلمة "الووو؟" لما حد يتنح.',
    witness: '"الجملة دي اختصار لراحة البال وتجنب وجع الدماغ."'
  },
  binge: {
    title: 'الأفلام والمسلسلات في نص الليل',
    subtitle: 'CODE: CASE-06-BINGE-WATCHING',
    img: '',
    tag: 'NIGHT CINEMA',
    desc: 'عشقي للأفلام والمسلسلات.. ممكن أقعد بالليل في الضلمة أخلص مسلسل كامل بدون ما أرمش مع سناك خفيف.',
    witness: '"نفسي في واحدة نقعد نتفرج سوا على مسلسلات بدون ما ترغي كتير في نص المشهد الحماسي."'
  },
  ahly: {
    title: 'Al Ahly SC (نادي القرن والأهلي فوق الجميع 🦅)',
    subtitle: 'CODE: CASE-07-AL-AHLY-SC',
    img: '',
    tag: 'CHAMPIONS CULTURE',
    desc: 'عشقي للأهلي مش مجرد تشجيع كورة.. دا انتماء ودم بيجري في العروق. وقت ماتش الأهلي البيت كله بيقف على رجل واحدة، والبطولات بالنسبة لنا روتين سنوي طبيعي!',
    witness: '"لو الأهلي اتعادل بس (وده نادراً ما يحصل) مفيش حد يجرؤ يكلمني.. ولو كسب بنحتفل للصبح ونولعها!"'
  }
};

function initCaseStudiesModal() {
  const modal = document.getElementById('evidenceModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const cards = document.querySelectorAll('.case-card');
  const modalImgContainer = document.getElementById('modalImgContainer');
  const modalCaseImg = document.getElementById('modalCaseImg');
  if (!modal) return;

  function openCase(key) {
    const data = caseStudyData[key];
    if (!data) return;

    sfx.camera();
    if (data.img) {
      modalCaseImg.src = data.img;
      modalImgContainer.style.display = 'block';
    } else {
      modalImgContainer.style.display = 'none';
    }

    document.getElementById('modalCaseTag').textContent = data.tag;
    document.getElementById('modalCaseTitle').textContent = data.title;
    document.getElementById('modalCaseSub').textContent = data.subtitle;
    document.getElementById('modalCaseDesc').textContent = data.desc;
    document.getElementById('modalCaseWitness').textContent = data.witness;

    modal.classList.add('active');
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-case');
      openCase(key);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sfx.click();
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      sfx.click();
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

// --- 10. Fallback Particle Confetti ---
function fireConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// --- 11. Proposal Form Submission & WhatsApp Bridge ---
function initProposalForm() {
  const form = document.getElementById('proposalForm');
  const receiptModal = document.getElementById('receiptModal');
  const closeReceiptBtn = document.getElementById('closeReceiptBtn');
  const whatsappSendBtn = document.getElementById('whatsappSendBtn');
  if (!form || !receiptModal) return;

  let currentSubmissionData = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('applicantName').value.trim();
    const handle = document.getElementById('applicantHandle').value.trim();
    const jokeTolerance = document.getElementById('jokeTolerance').value;
    const pizzaCrust = document.getElementById('pizzaCrust').value;
    const pitch = document.getElementById('applicantPitch').value.trim();

    const selectedGoals = [];
    document.querySelectorAll('input[name="goals"]:checked').forEach(cb => {
      selectedGoals.push(cb.value);
    });

    if (!name) {
      alert('لازم تكتبي اسمك يا فنانة! 😂');
      return;
    }

    currentSubmissionData = {
      name,
      handle: handle || 'مش كاتبة (مجهولة)',
      jokeTolerance,
      pizzaCrust,
      pitch: pitch || 'مفيش كلام.. بس معجبة بالسايت',
      goals: selectedGoals.length ? selectedGoals.join(' + ') : 'نتعرف وخلاص'
    };

    sfx.success();
    fireConfetti();

    // Populate Receipt
    document.getElementById('receiptApplicantName').textContent = currentSubmissionData.name;
    document.getElementById('receiptGoals').textContent = currentSubmissionData.goals;
    document.getElementById('receiptTolerance').textContent = `${currentSubmissionData.jokeTolerance}%`;
    document.getElementById('receiptPizza').textContent = currentSubmissionData.pizzaCrust;
    document.getElementById('receiptPitch').textContent = `"${currentSubmissionData.pitch}"`;

    receiptModal.classList.add('active');
  });

  if (closeReceiptBtn) {
    closeReceiptBtn.addEventListener('click', () => {
      sfx.click();
      receiptModal.classList.remove('active');
    });
  }

  if (whatsappSendBtn) {
    whatsappSendBtn.addEventListener('click', () => {
      if (!currentSubmissionData) return;
      sfx.stamp();

      const messageText = `مسا مسا يا نون! 👋
أنا شفت الويب سايت والـ Dossier بتاعك من المرج سيتي وجيت أقدم بروبوزال رسمي:
📌 الاسم: ${currentSubmissionData.name}
📱 أكونتي/رقمي: ${currentSubmissionData.handle}
🎯 الخطة سوا: ${currentSubmissionData.goals}
😂 نسبة تحمل "اااه طب تمام": ${currentSubmissionData.jokeTolerance}%
🦅 الأهلي والشيشة والسجاير: ${currentSubmissionData.pizzaCrust}
💌 رسالتي ليك: "${currentSubmissionData.pitch}"

مستعدة لقعدة القهوة مع الشاي والشيشة القص والسجاير، ومستعدة أشجع الأهلي وأرقص لك وأروق عليك! 😉🦅💨💃`;

      const encoded = encodeURIComponent(messageText);
      const waUrl = `https://wa.me/?text=${encoded}`;
      window.open(waUrl, '_blank');
    });
  }
}

// --- 12. Global Audio & Button Bindings ---
function initGlobalInteractions() {
  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = sfx.toggleMute();
      soundBtn.textContent = isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
      if (!isMuted) sfx.click();
    });
    soundBtn.textContent = sfx.muted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
  }

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', cycleTheme);
  }

  document.querySelectorAll('.brutalist-btn, .badge-tag, .hud-nav a').forEach(el => {
    el.addEventListener('mouseenter', () => {
      sfx.click();
    });
  });
}

// --- Initialize Everything On DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initTheme();
  initPolaroidTilt();
  initAhwaWidget();
  initLoveBuffer();
  initSecretRomantic();
  initCompatibilityTester();
  initCaseStudiesModal();
  initProposalForm();
  initGlobalInteractions();
});
