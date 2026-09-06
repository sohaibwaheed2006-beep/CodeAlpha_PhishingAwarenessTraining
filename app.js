/* =============================================
   PHISHGUARD — app.js
   Interactive Logic: Slides, Quiz, Examples, Progress
   ============================================= */

'use strict';

// ============ QUIZ DATA ============
const QUIZ_QUESTIONS = [
  {
    category: "Email Recognition",
    question: "You receive an email from 'support@paypa1.com' asking you to verify your PayPal account. What should you do?",
    options: [
      "Click the link in the email to verify",
      "Reply to the email with your credentials",
      "Delete the email — 'paypa1' uses a '1' instead of 'l', which is typosquatting",
      "Forward it to your contacts to warn them first"
    ],
    correct: 2,
    explanation: "The domain 'paypa1.com' replaces the letter 'l' with the number '1' — this is called typosquatting. Always check the sender's full email domain carefully. The legitimate PayPal domain is 'paypal.com'. Never click links in suspicious emails; go directly to the website instead."
  },
  {
    category: "URL Analysis",
    question: "Which of the following URLs is the SAFEST to enter your banking credentials on?",
    options: [
      "http://bankofamerica.com/login",
      "https://bankofamerica.secure-login.net/verify",
      "https://www.bankofamerica.com/login",
      "https://login.bankofamerica.accounts-verify.com"
    ],
    correct: 2,
    explanation: "Only 'https://www.bankofamerica.com/login' is legitimate. Option A uses HTTP (no encryption). Option B's real domain is 'secure-login.net' — 'bankofamerica' is just a subdomain. Option D's real domain is 'accounts-verify.com'. The actual domain is always the last part before the first single slash (/)."
  },
  {
    category: "Social Engineering",
    question: "Your company's 'IT department' calls you unexpectedly saying they need your password to fix a security issue on your account. What do you do?",
    options: [
      "Give them the password — they're IT, they need it to help you",
      "Refuse. IT departments NEVER need your password to fix issues",
      "Give them a temporary version of your password",
      "Ask them to send an email, then provide it"
    ],
    correct: 1,
    explanation: "Legitimate IT departments NEVER need your actual password — they have administrative access to systems without it. Asking for your password is a major red flag for vishing (voice phishing). Always verify caller identity by hanging up and calling the official IT helpdesk number yourself."
  },
  {
    category: "Best Practices",
    question: "What is the BEST way to protect against phishing attacks even if you accidentally click a malicious link?",
    options: [
      "Use the same strong password everywhere for easy management",
      "Enable Multi-Factor Authentication (MFA) on all accounts",
      "Only use email on trusted devices",
      "Change your password every week"
    ],
    correct: 1,
    explanation: "Multi-Factor Authentication (MFA) is your most powerful defense. Even if an attacker obtains your password through phishing, they still cannot access your account without the second factor (authentication app, hardware key, etc.). This single control can stop the majority of account takeover attacks."
  },
  {
    category: "Spear Phishing",
    question: "You receive an email that correctly mentions your name, job title, and your manager's name asking you to urgently wire $5,000. The email appears to be from your CEO. What should you do?",
    options: [
      "Complete the transfer — it's urgent and from the CEO",
      "Reply to the email to confirm it's legitimate",
      "Ignore it — CEOs never send emails about finances",
      "Verify through a SEPARATE channel — call your CEO or manager directly"
    ],
    correct: 3,
    explanation: "This is a 'CEO fraud' or Business Email Compromise (BEC) attack. Attackers research target companies on LinkedIn and elsewhere to craft convincing spear-phishing emails. Always verify unusual financial requests via a separate channel (phone call using a known number). The email address may be spoofed even if the display name looks correct."
  },
  {
    category: "Email Recognition",
    question: "A legitimate email from your bank would typically:",
    options: [
      "Ask you to confirm your full password for security verification",
      "Address you by your full name and never ask for sensitive data via email",
      "Include urgent language warning your account will close in 24 hours",
      "Provide a different login URL to a 'secure' portal"
    ],
    correct: 1,
    explanation: "Legitimate banks and financial institutions address you by your full name (not 'Dear Customer'), never ask for passwords or PINs via email, and direct you to their official app or website for any account actions. They won't send emergency ultimatums or redirect you to unfamiliar login pages."
  },
  {
    category: "Fake Websites",
    question: "A website has a green padlock (🔒) and shows 'HTTPS' in the address bar. This means:",
    options: [
      "The website is completely safe and legitimate",
      "The website belongs to a verified, trusted company",
      "Your connection is encrypted, but the site could still be a phishing site",
      "You are guaranteed never to be phished on this site"
    ],
    correct: 2,
    explanation: "HTTPS and the padlock icon ONLY mean your connection to the site is encrypted — it does NOT prove the site is legitimate or trustworthy. Phishing sites routinely use free SSL certificates (from Let's Encrypt) to display the padlock. You must also verify the actual domain name is correct."
  },
  {
    category: "Social Engineering",
    question: "You get an email: 'You have won a $500 Amazon gift card! 847 others claimed theirs. Don't miss out — verify your address to claim.' Which psychological tactics is this using?",
    options: [
      "Fear and urgency only",
      "Authority and reciprocity",
      "Greed, social proof, and urgency",
      "Familiarity and trust only"
    ],
    correct: 2,
    explanation: "This uses three classic tactics: (1) Greed — the reward of a $500 gift card, (2) Social Proof — '847 others claimed theirs' suggests the action is safe and popular, and (3) Urgency — 'Don't miss out' creates FOMO. Recognizing stacked manipulation tactics is a key defense skill."
  },
  {
    category: "Best Practices",
    question: "Which of these actions is MOST effective at identifying a phishing email link before clicking?",
    options: [
      "Check if the email came at a reasonable time of day",
      "Hover your cursor over the link to preview the actual destination URL",
      "Look for the sender's profile picture",
      "Check if the email has a company logo"
    ],
    correct: 1,
    explanation: "Hovering over a hyperlink (without clicking) reveals the actual destination URL in your browser's status bar. The displayed link text can say anything ('Click here to login to amazon.com') while pointing to a completely different malicious domain. Always check the real URL before clicking."
  },
  {
    category: "Incident Response",
    question: "You realize you just clicked a phishing link and may have entered your credentials. What should you do FIRST?",
    options: [
      "Wait to see if anything suspicious happens to your account",
      "Delete the email and hope for the best",
      "Immediately change your password and enable MFA on the affected account",
      "Scan your computer for viruses (this is the only step needed)"
    ],
    correct: 2,
    explanation: "Time is critical! The moment you suspect credential compromise: (1) Immediately change your password on the affected account, (2) Enable or change your MFA method, (3) Report the incident to your IT/security team, (4) Check for any unauthorized activity, (5) Run a malware scan. Acting fast can prevent attackers from locking you out of your own account."
  }
];

// ============ STATE ============
let currentSlide = 0;
const totalSlides = 5;
let quizStarted = false;
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let quizCompleted = false;

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  initSlides();
  initExamples();
  initQuiz();
  initScrollProgress();
  initTooltips();
  initHeroButtons();
  initSwipeGestures();
  initKeyboardNavigation();
  initMobileDock();
  updateModuleProgress();
});

// ============ HERO BUTTONS ============
function initHeroButtons() {
  document.getElementById('startTraining').addEventListener('click', () => {
    document.getElementById('slides').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('goToQuiz').addEventListener('click', () => {
    document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
  });
}

// ============ MODULE PROGRESS ============
function updateModuleProgress() {
  const slidePct = Math.round(((currentSlide + 1) / totalSlides) * 60);
  const quizPct = quizCompleted ? 40 : (quizStarted ? Math.round((currentQuestion / QUIZ_QUESTIONS.length) * 40) : 0);
  const total = Math.min(slidePct + quizPct, 100);
  document.getElementById('progressFill').style.width = total + '%';
  document.getElementById('progressPct').textContent = total + '%';
}

// ============ SLIDES ============
function initSlides() {
  const tabs = document.querySelectorAll('.slide-tab');
  const dotsContainer = document.getElementById('slideDots');

  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  // Tab clicks
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => goToSlide(i));
  });

  // Prev / Next
  document.getElementById('prevSlide').addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('nextSlide').addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    } else {
      document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Go to quiz from slide 4 CTA
  document.getElementById('goToQuizFromSlide').addEventListener('click', () => {
    document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
  });

  goToSlide(0);
}

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;

  // Update slides
  document.querySelectorAll('.slide').forEach((s, i) => {
    s.classList.toggle('active', i === index);
  });

  // Update tabs
  document.querySelectorAll('.slide-tab').forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });

  // Update dots
  document.querySelectorAll('.slide-dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });

  // Update buttons
  document.getElementById('prevSlide').disabled = index === 0;
  const nextBtn = document.getElementById('nextSlide');
  nextBtn.textContent = '';
  if (index === totalSlides - 1) {
    nextBtn.innerHTML = 'Start Quiz <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>';
  } else {
    nextBtn.innerHTML = 'Next <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>';
  }

  currentSlide = index;
  updateModuleProgress();
}

// ============ EXAMPLES ============
function initExamples() {
  document.querySelectorAll('.example-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.example-card');
      const full = card.querySelector('.example-full');
      const isOpen = full.classList.contains('open');

      if (isOpen) {
        full.classList.remove('open');
        full.style.display = 'none';
        btn.textContent = 'Read More';
      } else {
        full.style.display = 'block';
        requestAnimationFrame(() => full.classList.add('open'));
        btn.textContent = 'Read Less';
      }
    });
  });
}

// ============ QUIZ ============
function initQuiz() {
  document.getElementById('startQuiz').addEventListener('click', startQuiz);
  document.getElementById('retakeQuiz').addEventListener('click', resetQuiz);
  document.getElementById('reviewAnswers').addEventListener('click', reviewAnswers);
  document.getElementById('nextQuestion').addEventListener('click', showNextQuestion);
}

function startQuiz() {
  quizStarted = true;
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  quizCompleted = false;

  document.getElementById('quizStart').style.display = 'none';
  document.getElementById('quizQuestions').style.display = 'block';
  document.getElementById('quizResults').style.display = 'none';

  renderQuestion(0);
  updateModuleProgress();
}

function renderQuestion(index) {
  const q = QUIZ_QUESTIONS[index];
  document.getElementById('qNum').textContent = index + 1;
  document.getElementById('liveScore').textContent = score;
  document.getElementById('qCategory').textContent = q.category;
  document.getElementById('qText').textContent = q.question;

  // Progress bar
  const pct = (index / QUIZ_QUESTIONS.length) * 100;
  document.getElementById('quizProgressFill').style.width = pct + '%';

  // Options
  const optionsEl = document.getElementById('qOptions');
  optionsEl.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.id = `option-${i}`;
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => selectAnswer(i, q.correct, q.explanation));
    optionsEl.appendChild(btn);
  });

  // Hide feedback & next
  const fb = document.getElementById('qFeedback');
  fb.style.display = 'none';
  fb.className = 'question-feedback';
  fb.textContent = '';
  document.getElementById('nextQuestion').style.display = 'none';
  document.getElementById('nextQuestion').textContent = index < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Results →';
}

function selectAnswer(selected, correct, explanation) {
  // Disable all buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
  });

  const isCorrect = selected === correct;
  if (isCorrect) score++;

  // Color the buttons
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    if (i === correct) btn.classList.add('correct');
    if (i === selected && !isCorrect) btn.classList.add('wrong');
  });

  // Show feedback
  const fb = document.getElementById('qFeedback');
  fb.style.display = 'block';
  fb.className = 'question-feedback ' + (isCorrect ? 'feedback-correct' : 'feedback-wrong');
  fb.innerHTML = (isCorrect ? '✅ <strong>Correct!</strong> ' : '❌ <strong>Incorrect.</strong> ') + explanation;

  // Store answer
  userAnswers.push({ selected, correct, isCorrect, question: QUIZ_QUESTIONS[currentQuestion].question, explanation });

  // Show next button
  document.getElementById('nextQuestion').style.display = 'block';
  document.getElementById('liveScore').textContent = score;
  updateModuleProgress();
}

function showNextQuestion() {
  currentQuestion++;
  if (currentQuestion < QUIZ_QUESTIONS.length) {
    renderQuestion(currentQuestion);
  } else {
    showResults();
  }
}

function showResults() {
  quizCompleted = true;
  document.getElementById('quizQuestions').style.display = 'none';
  document.getElementById('quizResults').style.display = 'block';

  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
  const passed = pct >= 80;

  // Header
  const header = document.getElementById('resultsHeader');
  if (passed) {
    header.innerHTML = `<div style="font-size:56px;margin-bottom:12px">🏆</div><h3 style="color:#6ee7b7">Congratulations! You Passed!</h3><p>Excellent work. You've demonstrated strong phishing awareness skills.</p>`;
  } else {
    header.innerHTML = `<div style="font-size:56px;margin-bottom:12px">📚</div><h3 style="color:#fca5a5">Keep Learning!</h3><p>You scored below 80%. Review the training slides and try again.</p>`;
  }

  // Score ring
  const circumference = 2 * Math.PI * 50;
  const fill = document.getElementById('ringFill');
  fill.style.stroke = passed ? '#10b981' : '#ef4444';
  fill.style.strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
  document.getElementById('scoreBig').textContent = pct + '%';
  document.getElementById('scoreBig').style.color = passed ? '#6ee7b7' : '#fca5a5';

  // Breakdown
  const wrong = QUIZ_QUESTIONS.length - score;
  document.getElementById('resultsBreakdown').innerHTML = `
    <div class="breakdown-item breakdown-correct">
      <span class="breakdown-num">${score}</span>
      <span class="breakdown-lbl">Correct</span>
    </div>
    <div class="breakdown-item breakdown-wrong">
      <span class="breakdown-num">${wrong}</span>
      <span class="breakdown-lbl">Incorrect</span>
    </div>
    <div class="breakdown-item breakdown-pct">
      <span class="breakdown-num">${pct}%</span>
      <span class="breakdown-lbl">Score</span>
    </div>
  `;

  // Certificate
  const cert = document.getElementById('certificate');
  if (passed) {
    cert.style.display = 'block';
    document.getElementById('certDate').textContent = 'Date: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('certScore').textContent = `Score: ${pct}% (${score}/${QUIZ_QUESTIONS.length})`;
    cert.style.animation = 'fadeInUp 0.8s ease';
  }

  updateModuleProgress();
}

function resetQuiz() {
  document.getElementById('quizStart').style.display = 'block';
  document.getElementById('quizQuestions').style.display = 'none';
  document.getElementById('quizResults').style.display = 'none';
  quizStarted = false;
  quizCompleted = false;
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  updateModuleProgress();
}

function reviewAnswers() {
  document.getElementById('quizQuestions').style.display = 'block';
  document.getElementById('quizResults').style.display = 'none';

  currentQuestion = 0;
  renderQuestion(0);

  // Show all answers reviewed
  let delay = 0;
  userAnswers.forEach((ans, i) => {
    setTimeout(() => {
      renderQuestion(i);
      // Show the selected answer colors
      document.querySelectorAll('.option-btn').forEach((btn, j) => {
        btn.disabled = true;
        if (j === ans.correct) btn.classList.add('correct');
        if (j === ans.selected && !ans.isCorrect) btn.classList.add('wrong');
      });
      const fb = document.getElementById('qFeedback');
      fb.style.display = 'block';
      fb.className = 'question-feedback ' + (ans.isCorrect ? 'feedback-correct' : 'feedback-wrong');
      fb.innerHTML = (ans.isCorrect ? '✅ <strong>Correct!</strong> ' : '❌ <strong>Incorrect.</strong> ') + ans.explanation;

      if (i < userAnswers.length - 1) {
        document.getElementById('nextQuestion').style.display = 'block';
        document.getElementById('nextQuestion').textContent = 'Next →';
      } else {
        document.getElementById('nextQuestion').style.display = 'block';
        document.getElementById('nextQuestion').textContent = 'Back to Results →';
        document.getElementById('nextQuestion').onclick = showResults;
      }
    }, delay);
    delay += 300;
  });
}

// ============ SCROLL PROGRESS ============
function initScrollProgress() {
  const examples = document.getElementById('examples');
  const quiz = document.getElementById('quiz');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateModuleProgress();
      }
    });
  }, { threshold: 0.1 });

  if (examples) observer.observe(examples);
  if (quiz) observer.observe(quiz);
}

// ============ TOOLTIPS (Email flags with Touch Support) ============
function initTooltips() {
  const tooltip = document.getElementById('tooltip');
  let activeTouchEl = null;

  document.querySelectorAll('.ef-bad, .ef-flag, .ef-bad-link').forEach(el => {
    const tip = el.getAttribute('data-tip') || el.closest('[data-tip]')?.getAttribute('data-tip');
    if (!tip) return;

    el.addEventListener('mouseenter', (e) => {
      tooltip.textContent = tip;
      tooltip.classList.add('visible');
      positionTooltip(e);
    });

    el.addEventListener('mousemove', positionTooltip);

    el.addEventListener('mouseleave', () => {
      if (!activeTouchEl) tooltip.classList.remove('visible');
    });

    // Touch tap support for mobile devices
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      tooltip.textContent = tip;
      tooltip.classList.add('visible');
      const rect = el.getBoundingClientRect();
      const x = Math.max(16, Math.min(rect.left, window.innerWidth - 290));
      const y = rect.bottom + 8;
      tooltip.style.left = x + 'px';
      tooltip.style.top = Math.min(y, window.innerHeight - 100) + 'px';
      activeTouchEl = el;
    });
  });

  document.addEventListener('click', (e) => {
    if (activeTouchEl && !e.target.closest('[data-tip]')) {
      tooltip.classList.remove('visible');
      activeTouchEl = null;
    }
  });

  function positionTooltip(e) {
    const x = e.clientX + 14;
    const y = e.clientY + 14;
    tooltip.style.left = Math.min(x, window.innerWidth - 280) + 'px';
    tooltip.style.top = Math.min(y, window.innerHeight - 120) + 'px';
  }
}

// ============ MOBILE SWIPE GESTURES ============
function initSwipeGestures() {
  const container = document.querySelector('.slides-container');
  if (!container) return;

  let touchStartX = 0;
  let touchStartY = 0;

  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].screenX;
      touchStartY = e.touches[0].screenY;
    }
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ensure horizontal swipe
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
        if (diffX < 0 && currentSlide < totalSlides - 1) {
          // Swipe Left -> Next
          goToSlide(currentSlide + 1);
        } else if (diffX > 0 && currentSlide > 0) {
          // Swipe Right -> Prev
          goToSlide(currentSlide - 1);
        }
      }
    }
  }, { passive: true });
}

// ============ DESKTOP KEYBOARD NAVIGATION ============
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowRight') {
      if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    } else if (quizStarted && !quizCompleted) {
      const optMap = {
        '1': 0, '2': 1, '3': 2, '4': 3,
        'a': 0, 'b': 1, 'c': 2, 'd': 3,
        'A': 0, 'B': 1, 'C': 2, 'D': 3
      };
      if (optMap[e.key] !== undefined) {
        const optionButtons = document.querySelectorAll('.option-btn');
        if (optionButtons[optMap[e.key]] && !optionButtons[optMap[e.key]].disabled) {
          optionButtons[optMap[e.key]].click();
        }
      }
    }
  });
}

// ============ MOBILE DOCK OBSERVER ============
function initMobileDock() {
  const dockLinks = document.querySelectorAll('.dock-link');
  const sections = ['hero', 'slides', 'examples', 'quiz']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dockLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-nav') === id);
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(sec => observer.observe(sec));
}

// ============ SMOOTH APPEAR ON SCROLL ============
const appearObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.example-card, .tactic-card, .info-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  appearObserver.observe(el);
});
