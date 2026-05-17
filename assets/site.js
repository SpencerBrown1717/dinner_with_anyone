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

/* =========================================================
   Buyer path highlighting for contact page
   ========================================================= */

(function () {
  const pathCards = document.querySelectorAll("[data-path-card]");
  const note = document.querySelector("[data-selected-path-note]");

  if (!pathCards.length) return;

  const copy = {
    teacher: "Selected: Teacher / professor. The demo will focus on uploading class material and creating a professor avatar.",
    school: "Selected: School or MBA program. The demo will focus on cohort pilots, private-server options, and teacher insight reports.",
    avatar: "Selected: Famous / expert avatar. The demo will focus on public-source avatars, voice interaction, and branded expert experiences.",
    practice: "Selected: Practice / roleplay. The demo will focus on interview prep, sales practice, negotiation roleplay, and feedback loops."
  };

  const params = new URLSearchParams(window.location.search);
  const selected = params.get("path");

  if (selected) {
    pathCards.forEach((card) => {
      card.classList.toggle("active", card.dataset.pathCard === selected);
    });

    if (note && copy[selected]) {
      note.textContent = copy[selected];
    }
  }
})();

/* =========================================================
   Outreach message copy button
   ========================================================= */

(function () {
  const button = document.querySelector("[data-copy-outreach]");
  const message = document.querySelector("[data-outreach-message]");

  if (!button || !message) return;

  button.addEventListener("click", async () => {
    const text = message.textContent.trim();
    const original = button.textContent;

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1800);
    } catch (error) {
      button.textContent = "Select text to copy";
      window.setTimeout(() => {
        button.textContent = original;
      }, 2200);
    }
  });
})();

/* =========================================================
   Demo video auto-loader
   Shows fallback until assets/demo-walkthrough.mp4 exists.
   ========================================================= */

(function () {
  const shells = document.querySelectorAll("[data-demo-video-shell]");
  if (!shells.length) return;

  shells.forEach(async (shell) => {
    const video = shell.querySelector("[data-demo-video]");
    if (!video) return;

    const src = video.dataset.demoSrc;
    if (!src) return;

    try {
      const response = await fetch(src, { method: "HEAD", cache: "no-store" });
      if (!response.ok) return;

      video.src = src;
      shell.classList.add("video-ready");
    } catch (error) {
      // Keep fallback visible.
    }
  });
})();

/* =========================================================
   Launch checklist + outreach tracker
   Browser localStorage only. No backend.
   ========================================================= */

(function () {
  const form = document.querySelector("[data-tracker-form]");
  const body = document.querySelector("[data-tracker-body]");
  const exportButton = document.querySelector("[data-export-tracker]");
  const seedButton = document.querySelector("[data-seed-tracker]");
  const clearButton = document.querySelector("[data-clear-tracker]");
  const copyButton = document.querySelector("[data-copy-tracker-message]");
  const copyMessage = document.querySelector("[data-tracker-message]");
  const checks = document.querySelectorAll("[data-launch-check]");

  const totalCount = document.querySelector("[data-total-count]");
  const sentCount = document.querySelector("[data-sent-count]");
  const replyCount = document.querySelector("[data-reply-count]");
  const demoCount = document.querySelector("[data-demo-count]");

  if (!form || !body) return;

  const STORAGE_KEY = "dwa_outreach_tracker_v1";
  const CHECKLIST_KEY = "dwa_launch_checklist_v1";

  const statuses = [
    "Not sent",
    "Sent",
    "Opened / replied",
    "Demo booked",
    "Not interested",
    "Follow up"
  ];

  function readContacts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function writeContacts(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }

  function readChecklist() {
    try {
      return JSON.parse(localStorage.getItem(CHECKLIST_KEY)) || {};
    } catch (error) {
      return {};
    }
  }

  function writeChecklist(checklist) {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function csvEscape(value) {
    const string = String(value || "");
    return `"${string.replaceAll('"', '""')}"`;
  }

  function updateCounts(contacts) {
    if (totalCount) totalCount.textContent = contacts.length;
    if (sentCount) {
      sentCount.textContent = contacts.filter((item) =>
        ["Sent", "Opened / replied", "Demo booked", "Not interested", "Follow up"].includes(item.status)
      ).length;
    }
    if (replyCount) {
      replyCount.textContent = contacts.filter((item) =>
        ["Opened / replied", "Demo booked", "Follow up"].includes(item.status)
      ).length;
    }
    if (demoCount) {
      demoCount.textContent = contacts.filter((item) => item.status === "Demo booked").length;
    }
  }

  function statusOptions(selected) {
    return statuses
      .map((status) => {
        const isSelected = status === selected ? "selected" : "";
        return `<option ${isSelected}>${status}</option>`;
      })
      .join("");
  }

  function renderContacts() {
    const contacts = readContacts();
    updateCounts(contacts);

    if (!contacts.length) {
      body.innerHTML = `
        <tr>
          <td colspan="8" class="tracker-empty">
            No contacts yet. Add 10 professors or MBA program leads above.
          </td>
        </tr>
      `;
      return;
    }

    body.innerHTML = contacts
      .map((contact) => `
        <tr data-contact-id="${contact.id}">
          <td>
            <input data-field="name" value="${escapeHtml(contact.name)}" aria-label="Name" />
          </td>
          <td>
            <input data-field="school" value="${escapeHtml(contact.school)}" aria-label="School" />
          </td>
          <td>
            <input data-field="email" value="${escapeHtml(contact.email)}" aria-label="Email" />
          </td>
          <td>
            <select data-field="status" aria-label="Status">
              ${statusOptions(contact.status)}
            </select>
          </td>
          <td>
            <input data-field="sentDate" type="date" value="${escapeHtml(contact.sentDate)}" aria-label="Sent date" />
          </td>
          <td>
            <input data-field="followUpDate" type="date" value="${escapeHtml(contact.followUpDate)}" aria-label="Follow-up date" />
          </td>
          <td>
            <textarea data-field="notes" aria-label="Notes">${escapeHtml(contact.notes)}</textarea>
          </td>
          <td>
            <button class="row-delete" type="button" data-delete-contact="${contact.id}">
              Delete
            </button>
          </td>
        </tr>
      `)
      .join("");
  }

  function updateContact(id, field, value) {
    const contacts = readContacts();
    const next = contacts.map((contact) => {
      if (contact.id !== id) return contact;
      return { ...contact, [field]: value };
    });

    writeContacts(next);
    updateCounts(next);
  }

  function deleteContact(id) {
    const contacts = readContacts().filter((contact) => contact.id !== id);
    writeContacts(contacts);
    renderContacts();
  }

  function addContact(data) {
    const contacts = readContacts();

    contacts.unshift({
      id: String(Date.now()),
      name: data.get("name") || "",
      school: data.get("school") || "",
      email: data.get("email") || "",
      status: data.get("status") || "Not sent",
      sentDate: data.get("sentDate") || "",
      followUpDate: data.get("followUpDate") || "",
      notes: data.get("notes") || ""
    });

    writeContacts(contacts);
    renderContacts();
  }

  function exportCsv() {
    const contacts = readContacts();
    const header = ["Name", "School", "Email", "Status", "Sent date", "Follow-up date", "Notes"];

    const rows = contacts.map((contact) => [
      contact.name,
      contact.school,
      contact.email,
      contact.status,
      contact.sentDate,
      contact.followUpDate,
      contact.notes
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "dinner-with-anyone-outreach.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function seedContacts() {
    const existing = readContacts();
    if (existing.length && !window.confirm("Add sample contacts to your existing tracker?")) return;

    const samples = [
      {
        id: String(Date.now() + 1),
        name: "Professor Example 1",
        school: "MBA Strategy Program",
        email: "",
        status: "Not sent",
        sentDate: "",
        followUpDate: "",
        notes: "Good fit: strategy class, case-method discussion, 20–30 students."
      },
      {
        id: String(Date.now() + 2),
        name: "Program Lead Example",
        school: "Executive Education",
        email: "",
        status: "Not sent",
        sentDate: "",
        followUpDate: "",
        notes: "Potential pilot: leadership communication or innovation cohort."
      },
      {
        id: String(Date.now() + 3),
        name: "AI Education Contact",
        school: "Business School",
        email: "",
        status: "Not sent",
        sentDate: "",
        followUpDate: "",
        notes: "Ask for feedback on professor avatar and student insight report."
      }
    ];

    writeContacts([...samples, ...existing]);
    renderContacts();
  }

  function clearContacts() {
    const ok = window.confirm("Clear all outreach tracker contacts from this browser?");
    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);
    renderContacts();
  }

  function initChecklist() {
    const checklist = readChecklist();

    checks.forEach((check) => {
      const key = check.dataset.launchCheck;
      check.checked = Boolean(checklist[key]);
      check.closest("label")?.classList.toggle("done", check.checked);

      check.addEventListener("change", () => {
        const next = readChecklist();
        next[key] = check.checked;
        writeChecklist(next);
        check.closest("label")?.classList.toggle("done", check.checked);
      });
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addContact(new FormData(form));
    form.reset();
  });

  body.addEventListener("input", (event) => {
    const field = event.target.dataset.field;
    if (!field) return;

    const row = event.target.closest("[data-contact-id]");
    if (!row) return;

    updateContact(row.dataset.contactId, field, event.target.value);
  });

  body.addEventListener("click", (event) => {
    const id = event.target.dataset.deleteContact;
    if (!id) return;

    deleteContact(id);
  });

  if (exportButton) exportButton.addEventListener("click", exportCsv);
  if (seedButton) seedButton.addEventListener("click", seedContacts);
  if (clearButton) clearButton.addEventListener("click", clearContacts);

  if (copyButton && copyMessage) {
    copyButton.addEventListener("click", async () => {
      const original = copyButton.textContent;
      try {
        await navigator.clipboard.writeText(copyMessage.textContent.trim());
        copyButton.textContent = "Copied";
      } catch (error) {
        copyButton.textContent = "Select text to copy";
      }

      window.setTimeout(() => {
        copyButton.textContent = original;
      }, 1800);
    });
  }

  initChecklist();
  renderContacts();
})();

/* =========================================================
   Premium UX Polish
   ========================================================= */

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll progress bar
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? Math.min(100, Math.max(0, (scrollTop / max) * 100)) : 0;
    progress.style.width = `${percent}%`;

    const topbar = document.querySelector(".topbar");
    if (topbar) topbar.classList.toggle("is-scrolled", scrollTop > 8);
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  // Reveal animations
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      ".section .card, .section h2, .section .lead, .section .muted, .avatar-choice, .proof-slide, .pilot-step-card, .insight-card, .arch-node, .buyer-path-card"
    );

    revealTargets.forEach((el, index) => {
      el.classList.add("reveal");
      if (index % 3 === 1) el.classList.add("reveal-delay-1");
      if (index % 3 === 2) el.classList.add("reveal-delay-2");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12
      }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  // Mobile sticky CTA
  const shouldAddMobileCta =
    !document.body.classList.contains("no-mobile-cta") &&
    document.querySelector("a[href='contact.html'], a[href='contact.html?path=teacher'], a[href='pilot.html']");

  if (shouldAddMobileCta) {
    const sticky = document.createElement("div");
    sticky.className = "mobile-sticky-cta";
    sticky.innerHTML = `
      <div>
        <strong>Ready to see it?</strong>
        <span>Book a demo or pilot one class.</span>
      </div>
      <a class="btn primary" href="contact.html?path=teacher">Book</a>
    `;
    document.body.appendChild(sticky);
    document.body.classList.add("has-mobile-cta");

    function updateStickyCta() {
      const isMobile = window.innerWidth <= 760;
      const show = isMobile && window.scrollY > 520;
      sticky.classList.toggle("is-visible", show);
    }

    window.addEventListener("scroll", updateStickyCta, { passive: true });
    window.addEventListener("resize", updateStickyCta);
    updateStickyCta();
  }

  // Button ripple-lite feedback
  document.addEventListener("pointerdown", (event) => {
    const button = event.target.closest(".btn, button");
    if (!button || reduceMotion) return;

    button.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(.982)" },
        { transform: "scale(1)" }
      ],
      {
        duration: 180,
        easing: "cubic-bezier(.2,.8,.2,1)"
      }
    );
  });
})();

/* =========================================================
   Avatar Demo Cinematic Mode
   ========================================================= */

(function () {
  const room = document.querySelector("[data-proof-room]");
  if (!room) return;

  const section = room.closest(".section");
  if (!section) return;

  const wrap = section.querySelector(".wrap");
  if (!wrap) return;

  const toolbar = document.createElement("div");
  toolbar.className = "avatar-demo-toolbar";
  toolbar.innerHTML = `
    <button class="cinematic-toggle" type="button" data-cinematic-toggle>
      Enter cinematic mode
    </button>
  `;

  wrap.insertBefore(toolbar, wrap.firstElementChild);

  const button = toolbar.querySelector("[data-cinematic-toggle]");

  function setMode(active) {
    document.body.classList.toggle("cinematic-mode", active);
    button.textContent = active ? "Exit cinematic mode" : "Enter cinematic mode";

    if (active) {
      room.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  button.addEventListener("click", () => {
    setMode(!document.body.classList.contains("cinematic-mode"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("cinematic-mode")) {
      setMode(false);
    }
  });
})();

/* =========================================================
   Roleplay mode switcher (avatar-demo and practice pages)
   ========================================================= */

(function () {
  const tabs = document.querySelectorAll("[data-roleplay-mode]");
  if (!tabs.length) return;

  const titleEl = document.querySelector("[data-roleplay-title]");
  const promptEl = document.querySelector("[data-roleplay-prompt]");
  const responseEl = document.querySelector("[data-roleplay-response]");
  const feedbackEl = document.querySelector("[data-roleplay-feedback]");
  const groundingEl = document.querySelector("[data-roleplay-grounding]");
  const nextEl = document.querySelector("[data-roleplay-next]");
  const helperEl = document.querySelector("[data-mode-helper]");

  const roleplayModes = {
    teach: {
      title: "Teach me",
      helper: "Explain the idea patiently, then check understanding.",
      prompt:
        "I do not understand switching costs from this week's lecture.",
      response:
        "Let's slow it down. From the uploaded Week 3 transcript, switching costs mean the friction that makes a customer less likely to leave after adopting a workflow. Before I give examples, tell me — what would make it annoying for a company to switch away from a tool it already uses every day?",
      feedback:
        "Concept clarity, examples, follow-up questions.",
      grounding:
        "Source: Week 3 transcript. Boundary: no specific startup example found in uploaded material.",
      next:
        "Reply with one concrete switching-cost example from your own life, then ask the avatar to compare."
    },
    interview: {
      title: "Interview me",
      helper: "Ask hard questions and score the answer.",
      prompt:
        "I'm preparing for a product strategy interview. Ask me a hard question.",
      response:
        "Good. You are leading a tutoring product. Students love the first session, but week-two retention is falling. Give me three hypotheses, the evidence you would check, and the first experiment you would run.",
      feedback:
        "Strong direction. Sharpen it: separate user behavior from product friction, name the metric you would move first, and say what result would change your mind.",
      grounding:
        "Source: public interview-prep frameworks and product-strategy patterns.",
      next:
        "Try again in 60 seconds with a clearer three-part structure: hypothesis · evidence · experiment."
    },
    sales: {
      title: "Sell to me",
      helper: "Play the skeptical buyer and push back.",
      prompt:
        "I'm practicing a sales discovery call for an enterprise training product.",
      response:
        "I'll play the buyer. I do not care about new technology. I care about reducing ramp time for my sales team. Ask me a discovery question that earns the right to continue.",
      feedback:
        "Good opening. Make it more business-specific: ask about current ramp time, the cost of missed quota, and who owns training outcomes.",
      grounding:
        "Source: public sales playbooks (discovery, MEDDPICC, SPIN). No customer-specific data used.",
      next:
        "Ask one quantified discovery question, then summarize the buyer's pain back to them."
    },
    negotiation: {
      title: "Negotiate with me",
      helper: "Make the student frame the ask and tradeoffs clearly.",
      prompt:
        "I'm negotiating a job offer. Help me practice.",
      response:
        "I'll play the recruiter. You want a higher salary, but I have budget constraints. Make your opening ask — and tell me what tradeoffs you are willing to consider.",
      feedback:
        "Strong opening. Now add leverage: name one competing offer or constraint, then propose a specific tradeoff (equity, sign-on, start date, or scope).",
      grounding:
        "Source: public negotiation frameworks (anchors, BATNA, ZOPA). No private compensation data used.",
      next:
        "Practice the opening ask one more time with a clear anchor number and one tradeoff."
    },
    quiz: {
      title: "Quiz me",
      helper: "Test recall, application, and evidence.",
      prompt:
        "Quiz me on this week's lecture.",
      response:
        "Define switching costs in your own words, then apply the idea to a startup that depends on workflow lock-in.",
      feedback:
        "Concept mastery, application, evidence.",
      grounding:
        "Source: uploaded course material from Week 3.",
      next:
        "Answer in two sentences: one definition, one applied example."
    }
  };

  function setMode(key) {
    const mode = roleplayModes[key] || roleplayModes.teach;

    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.roleplayMode === key);
      tab.setAttribute("aria-pressed", tab.dataset.roleplayMode === key ? "true" : "false");
    });

    if (titleEl) titleEl.textContent = mode.title;
    if (promptEl) promptEl.textContent = mode.prompt;
    if (responseEl) responseEl.textContent = mode.response;
    if (feedbackEl) feedbackEl.textContent = mode.feedback;
    if (groundingEl) groundingEl.textContent = mode.grounding;
    if (nextEl) nextEl.textContent = mode.next;
    if (helperEl) helperEl.textContent = mode.helper;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setMode(tab.dataset.roleplayMode));
  });

  const initial = document.querySelector("[data-roleplay-mode].active")?.dataset.roleplayMode || "teach";
  setMode(initial);
})();

/* =========================================================
   Expert library filter (experts.html)
   ========================================================= */

(function () {
  const filters = document.querySelectorAll("[data-expert-filter]");
  const cards = document.querySelectorAll("[data-expert-card]");
  if (!filters.length || !cards.length) return;

  const countEl = document.querySelector("[data-expert-count]");
  const totalCount = cards.length;

  function applyFilter(category) {
    let visible = 0;

    cards.forEach((card) => {
      const cats = (card.dataset.category || "").split(/\s+/).filter(Boolean);
      const match = category === "all" || cats.includes(category);
      card.hidden = !match;
      if (match) visible += 1;
    });

    filters.forEach((btn) => {
      const isActive = btn.dataset.expertFilter === category;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (countEl) {
      if (category === "all") {
        countEl.textContent = `Showing all ${totalCount} avatars.`;
      } else {
        const label = filters[0]?.parentElement?.querySelector(
          `[data-expert-filter="${category}"]`
        )?.dataset.label || category;
        countEl.textContent = `Showing ${visible} ${label.toLowerCase()} ${
          visible === 1 ? "avatar" : "avatars"
        }.`;
      }
    }
  }

  filters.forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.expertFilter));
  });

  const initial =
    document.querySelector("[data-expert-filter].active")?.dataset.expertFilter || "all";
  applyFilter(initial);
})();
