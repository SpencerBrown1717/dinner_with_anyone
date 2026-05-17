/* Dinner With Anyone — shared interactive bits */
(function () {
  var topbar = document.querySelector('.topbar');
  var menuBtn = document.querySelector('.menu-btn');
  var mobile = document.querySelector('.mobile');

  if (menuBtn && mobile) {
    var menuId = mobile.id || 'mobile-nav';
    mobile.id = menuId;
    menuBtn.setAttribute('aria-controls', menuId);
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation menu');

    var setOpen = function (open) {
      mobile.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };

    menuBtn.addEventListener('click', function () {
      setOpen(!mobile.classList.contains('open'));
    });

    mobile.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---- Avatar demo: simulated state machine ----
  var stage = document.getElementById('avatar-stage');
  if (stage) {
    var stateLabel = stage.querySelector('[data-state-label]');
    var slideNum = document.getElementById('slide-num');
    var slides = document.querySelectorAll('#slide-list .slide');
    var transcript = document.getElementById('transcript');
    var timers = [];
    var responseIdx = 0;

    var responses = [
      {
        slide: 2,
        text: 'Start with the question your students would actually ask each other after class. The math is downstream of curiosity.'
      },
      {
        slide: 3,
        text: 'Strip the problem down until almost nothing is left. The thing that will not go away is the thing worth building the answer around.'
      },
      {
        slide: 4,
        text: 'Tell them: pick a frame of reference you have always trusted. Question it for one week. Write down what changes.'
      }
    ];

    var capitalize = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };

    var setState = function (s) {
      stage.dataset.state = s;
      if (stateLabel) stateLabel.textContent = capitalize(s);
    };

    var clearTimers = function () {
      timers.forEach(function (t) { clearTimeout(t); });
      timers = [];
    };

    var highlightSlide = function (n) {
      slides.forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-slide') === String(n));
      });
      if (slideNum) slideNum.textContent = n;
    };

    var appendTranscript = function (kind, text, label) {
      if (!transcript) return;
      var defaults = { user: 'Student', avatar: 'Albert Einstein-inspired avatar', system: 'System' };
      var row = document.createElement('div');
      row.className = 't-row ' + kind;
      var who = document.createElement('span');
      who.className = 'who';
      who.textContent = label || defaults[kind] || 'System';
      var p = document.createElement('p');
      p.textContent = text;
      row.appendChild(who);
      row.appendChild(p);
      transcript.appendChild(row);
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    var runResponse = function (userText) {
      clearTimers();
      if (userText) appendTranscript('user', userText);
      setState('listening');
      timers.push(setTimeout(function () {
        setState('thinking');
        timers.push(setTimeout(function () {
          var r = responses[responseIdx % responses.length];
          responseIdx += 1;
          setState('speaking');
          highlightSlide(r.slide);
          appendTranscript('avatar', r.text);
          timers.push(setTimeout(function () { setState('ready'); }, 4500));
        }, 1800));
      }, 1800));
    };

    var startBtn = stage.querySelector('[data-action="start"]');
    var textBtn = stage.querySelector('[data-action="text"]');
    var uploadBtn = stage.querySelector('[data-action="upload"]');
    var endBtn = stage.querySelector('[data-action="end"]');
    var regenBtn = document.querySelector('[data-action="regenerate"]');

    if (startBtn) startBtn.addEventListener('click', function () { runResponse(); });
    if (textBtn) textBtn.addEventListener('click', function () {
      runResponse('How would you explain this to my MBA class so they actually feel it?');
    });
    if (uploadBtn) uploadBtn.addEventListener('click', function () {
      appendTranscript('system', 'Uploaded: strategy_601_week_2.pdf · Ingested into professor avatar context.');
    });
    if (endBtn) endBtn.addEventListener('click', function () {
      clearTimers();
      setState('ready');
      appendTranscript('system', 'Session ended. Transcript saved for export.');
    });
    if (regenBtn) regenBtn.addEventListener('click', function () {
      regenBtn.textContent = 'Regenerating…';
      setTimeout(function () { regenBtn.textContent = 'Regenerate'; }, 1100);
    });
  }

  // ---- Pricing: monthly / annual toggle ----
  var toggle = document.querySelector('[data-billing-toggle]');
  if (toggle) {
    var buttons = toggle.querySelectorAll('button[data-period]');
    var setPeriod = function (period) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-period') === period ? 'true' : 'false');
      });
      document.querySelectorAll('[data-price]').forEach(function (el) {
        var v = el.getAttribute('data-' + period);
        if (v != null) el.textContent = v;
      });
      document.querySelectorAll('[data-per]').forEach(function (el) {
        el.textContent = period === 'annual' ? '/mo, billed annually' : '/mo';
      });
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { setPeriod(b.getAttribute('data-period')); });
    });
  }
})();

/* =========================================================
   Avatar Demo Proof Mode
   Static prototype only — no backend/API calls.
   ========================================================= */

(function () {
  const room = document.querySelector("[data-proof-room]");
  if (!room) return;

  const avatars = {
    einstein: {
      initials: "AE",
      name: "Albert Einstein",
      transcriptName: "Albert Einstein",
      subtitle:
        "Public-source historical avatar for physics, creativity, scientific intuition, and first-principles thinking.",
      userSample:
        "Explain relativity like I am preparing for an MBA class on systems thinking.",
      avatarSample:
        "Imagine that every decision is made from a frame of reference. The question is not only what you see, but where you are standing when you see it.",
      generatedTitle: "Frame of Reference",
      generatedCopy:
        "Gemini turns the conversation into a visual teaching frame: observer, system, assumption, reflection.",
      slides: [
        "Theory of Relativity",
        "Thought Experiments",
        "First Principles",
        "Student Reflection"
      ],
      sources: [
        ["Public biographies", "public"],
        ["Published writings", "public"],
        ["Wikipedia / public context", "public"],
        ["Uploaded curriculum", "class"],
        ["Teacher slides", "class"],
        ["Zoom transcripts", "class"]
      ],
      speakingLine:
        "If the model feels complicated, return to the frame. Ask what changes when the observer changes."
    },

    confucius: {
      initials: "C",
      name: "Confucius",
      transcriptName: "Confucius",
      subtitle:
        "Public-source historical avatar for ethics, learning, social order, leadership, and reflective practice.",
      userSample:
        "How should a leader teach a team without making people feel small?",
      avatarSample:
        "Begin by correcting yourself in public and others in private. A culture learns most from what leaders repeat calmly.",
      generatedTitle: "Leadership Through Ritual",
      generatedCopy:
        "Gemini structures the lesson around habits, role modeling, reflective questions, and ethical decision-making.",
      slides: [
        "Learning as Practice",
        "Ritual and Role Modeling",
        "Ethics in Leadership",
        "Reflection Prompt"
      ],
      sources: [
        ["Public biographies", "public"],
        ["Analects references", "public"],
        ["Historical context", "public"],
        ["Leadership curriculum", "class"],
        ["Teacher discussion guide", "class"],
        ["Student reflections", "class"]
      ],
      speakingLine:
        "The leader is not only the person who speaks. The leader is the person whose habits become the room."
    },

    chen: {
      initials: "PC",
      name: "Professor Chen",
      transcriptName: "Professor Chen",
      subtitle:
        "MBA Strategy Professor Avatar built from uploaded syllabus, slides, Zoom transcripts, readings, and assignments.",
      userSample:
        "I understand Porter's Five Forces, but I do not know how to apply it to AI startups.",
      avatarSample:
        "Good. Start with the force that feels invisible: supplier power. In AI, compute, data, and distribution often become the real suppliers.",
      generatedTitle: "Week 3 — Competitive Advantage",
      generatedCopy:
        "Gemini generates lecture slides, study prompts, and discussion questions from uploaded strategy material.",
      slides: [
        "Competitive Advantage",
        "Porter's Five Forces",
        "Case Discussion",
        "Student Reflection"
      ],
      sources: [
        ["strategy_syllabus.pdf", "class"],
        ["week_03_slides.pptx", "class"],
        ["zoom_transcript_week_3.vtt", "class"],
        ["case_reading_packet.pdf", "class"],
        ["Professor notes", "class"],
        ["Student check-ins", "class"]
      ],
      speakingLine:
        "In this case, the moat is not the model alone. It is distribution, workflow ownership, data feedback, and switching cost."
    },

    cleopatra: {
      initials: "CL",
      name: "Cleopatra",
      transcriptName: "Cleopatra",
      subtitle:
        "Public-source historical avatar for diplomacy, persuasion, power, coalition-building, and statecraft.",
      userSample:
        "How should a founder negotiate when they have less leverage than the other side?",
      avatarSample:
        "Do not arrive as the smaller party. Arrive as the missing piece in a larger map. Power is often a question of framing the table.",
      generatedTitle: "Diplomacy and Leverage",
      generatedCopy:
        "Gemini turns the conversation into negotiation frames, stakeholder maps, and reflection prompts.",
      slides: [
        "Political Leverage",
        "Coalition Building",
        "Narrative and Power",
        "Negotiation Reflection"
      ],
      sources: [
        ["Public biographies", "public"],
        ["Historical accounts", "public"],
        ["Ancient world context", "public"],
        ["Negotiation curriculum", "class"],
        ["Teacher slides", "class"],
        ["Student roleplay notes", "class"]
      ],
      speakingLine:
        "When leverage is weak, widen the frame. Make the negotiation about what only you can unlock."
    }
  };

  const els = {
    choices: document.querySelectorAll("[data-avatar-choice]"),
    status: document.querySelector("[data-avatar-status]"),
    initials: document.querySelector("[data-avatar-initials]"),
    name: document.querySelector("[data-avatar-name]"),
    subtitle: document.querySelector("[data-avatar-subtitle]"),
    transcriptAvatar: document.querySelector("[data-transcript-avatar]"),
    userSample: document.querySelector("[data-user-sample]"),
    avatarSample: document.querySelector("[data-avatar-sample]"),
    transcriptBox: document.querySelector("[data-transcript-box]"),
    slideTitles: document.querySelectorAll("[data-slide-title]"),
    slideCards: document.querySelectorAll(".proof-slide"),
    sourceChips: document.querySelector("[data-source-chips]"),
    generatedTitle: document.querySelector("[data-generated-title]"),
    generatedCopy: document.querySelector("[data-generated-copy]"),
    startVoice: document.querySelector("[data-start-voice]"),
    sendText: document.querySelector("[data-send-text]"),
    uploadMaterial: document.querySelector("[data-upload-material]"),
    endSession: document.querySelector("[data-end-session]"),
    regenerateSlides: document.querySelector("[data-regenerate-slides]")
  };

  let currentAvatarKey = "einstein";
  let timers = [];

  function clearTimers() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
  }

  function setStatus(label) {
    if (!els.status) return;
    els.status.innerHTML = `<span class="status-dot"></span>${label}`;
  }

  function setRoomState(state) {
    room.classList.remove("ready", "listening", "thinking", "speaking");
    room.classList.add(state);
  }

  function clearActiveSlides() {
    els.slideCards.forEach((card) => card.classList.remove("active"));
  }

  function activateSlide(index) {
    clearActiveSlides();
    const slide = els.slideCards[index] || els.slideCards[0];
    if (slide) slide.classList.add("active");
  }

  function renderSources(sources) {
    if (!els.sourceChips) return;

    els.sourceChips.innerHTML = sources
      .map(([label, type]) => {
        const safeType = type === "public" ? "public" : "class";
        return `<span class="source-chip ${safeType}">${label}</span>`;
      })
      .join("");
  }

  function resetTranscript(avatar) {
    if (!els.transcriptBox) return;

    els.transcriptBox.innerHTML = `
      <div class="transcript-line user">
        <strong>Student</strong>
        <p data-user-sample>${avatar.userSample}</p>
      </div>

      <div class="transcript-line avatar">
        <strong data-transcript-avatar>${avatar.transcriptName}</strong>
        <p data-avatar-sample>${avatar.avatarSample}</p>
      </div>
    `;
  }

  function appendTranscriptLine(role, speaker, text) {
    if (!els.transcriptBox) return;

    const line = document.createElement("div");
    line.className = `transcript-line ${role}`;
    line.innerHTML = `
      <strong>${speaker}</strong>
      <p>${text}</p>
    `;

    els.transcriptBox.appendChild(line);
    line.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderAvatar(key) {
    const avatar = avatars[key] || avatars.einstein;
    currentAvatarKey = key;

    els.choices.forEach((choice) => {
      choice.classList.toggle("active", choice.dataset.avatarChoice === key);
    });

    if (els.initials) els.initials.textContent = avatar.initials;
    if (els.name) els.name.textContent = avatar.name;
    if (els.subtitle) els.subtitle.textContent = avatar.subtitle;
    if (els.generatedTitle) els.generatedTitle.textContent = avatar.generatedTitle;
    if (els.generatedCopy) els.generatedCopy.textContent = avatar.generatedCopy;

    els.slideTitles.forEach((title, index) => {
      title.textContent = avatar.slides[index] || avatar.slides[0];
    });

    renderSources(avatar.sources);
    resetTranscript(avatar);
    activateSlide(0);

    clearTimers();
    setRoomState("ready");
    setStatus("Ready");
  }

  function startVoiceDemo() {
    const avatar = avatars[currentAvatarKey] || avatars.einstein;

    clearTimers();
    setRoomState("listening");
    setStatus("Listening");
    activateSlide(0);

    timers.push(window.setTimeout(() => {
      setRoomState("thinking");
      setStatus("Thinking");
      activateSlide(1);
    }, 1800));

    timers.push(window.setTimeout(() => {
      setRoomState("speaking");
      setStatus("Speaking");
      activateSlide(2);
      appendTranscriptLine("avatar", avatar.transcriptName, avatar.speakingLine);
    }, 3600));

    timers.push(window.setTimeout(() => {
      setRoomState("ready");
      setStatus("Ready");
      activateSlide(3);
    }, 7600));
  }

  function sendTextDemo() {
    const avatar = avatars[currentAvatarKey] || avatars.einstein;

    clearTimers();
    appendTranscriptLine(
      "user",
      "Student",
      "Can you turn that into one practical takeaway for class discussion?"
    );

    setRoomState("thinking");
    setStatus("Thinking");
    activateSlide(1);

    timers.push(window.setTimeout(() => {
      setRoomState("speaking");
      setStatus("Speaking");
      activateSlide(3);
      appendTranscriptLine(
        "avatar",
        avatar.transcriptName,
        "Yes. State the idea in one sentence, apply it to a real decision, then ask what evidence would change your mind."
      );
    }, 1200));

    timers.push(window.setTimeout(() => {
      setRoomState("ready");
      setStatus("Ready");
    }, 4600));
  }

  function uploadMaterialDemo() {
    renderAvatar("chen");
    appendTranscriptLine(
      "user",
      "Teacher",
      "Uploaded strategy_syllabus.pdf, week_03_slides.pptx, and zoom_transcript_week_3.vtt."
    );

    setRoomState("thinking");
    setStatus("Structuring class");
    activateSlide(0);

    timers.push(window.setTimeout(() => {
      setRoomState("speaking");
      setStatus("Professor avatar ready");
      activateSlide(1);
      appendTranscriptLine(
        "avatar",
        "Professor Chen",
        "I built a Week 3 lesson around competitive advantage, supplier power, switching costs, and AI startup defensibility."
      );
    }, 1600));

    timers.push(window.setTimeout(() => {
      setRoomState("ready");
      setStatus("Ready");
    }, 5200));
  }

  function regenerateSlidesDemo() {
    const avatar = avatars[currentAvatarKey] || avatars.einstein;

    clearTimers();
    setRoomState("thinking");
    setStatus("Regenerating slides");
    activateSlide(0);

    timers.push(window.setTimeout(() => {
      setRoomState("speaking");
      setStatus("Slides updated");
      activateSlide(2);
      appendTranscriptLine(
        "avatar",
        avatar.transcriptName,
        "I regenerated the slide sequence to move from concept, to example, to reflection."
      );
    }, 1300));

    timers.push(window.setTimeout(() => {
      setRoomState("ready");
      setStatus("Ready");
    }, 4300));
  }

  function endSession() {
    clearTimers();
    setRoomState("ready");
    setStatus("Ready");
    activateSlide(0);
  }

  els.choices.forEach((choice) => {
    choice.addEventListener("click", () => {
      renderAvatar(choice.dataset.avatarChoice);
    });
  });

  if (els.startVoice) els.startVoice.addEventListener("click", startVoiceDemo);
  if (els.sendText) els.sendText.addEventListener("click", sendTextDemo);
  if (els.uploadMaterial) els.uploadMaterial.addEventListener("click", uploadMaterialDemo);
  if (els.endSession) els.endSession.addEventListener("click", endSession);
  if (els.regenerateSlides) els.regenerateSlides.addEventListener("click", regenerateSlidesDemo);

  renderAvatar(currentAvatarKey);
})();
