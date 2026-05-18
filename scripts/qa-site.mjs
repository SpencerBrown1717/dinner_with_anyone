import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173);
const baseURL = `http://127.0.0.1:${port}`;
const headless = process.env.HEADLESS !== "false";

const pages = [
  "index.html",
  "college.html",
  "experts.html",
  "education.html",
  "demo.html",
  "avatar-demo.html",
  "practice.html",
  "pilot.html",
  "outreach.html",
  "outreach-tracker.html",
  "how-it-works.html",
  "enterprise.html",
  "pricing.html",
  "contact.html"
];

const allowedMissing = new Set([
  "/assets/demo-walkthrough.mp4"
]);

const viewports = [
  {
    name: "mobile-small",
    width: 360,
    height: 740,
    isMobile: true,
    hasTouch: true
  },
  {
    name: "mobile-large",
    width: 430,
    height: 932,
    isMobile: true,
    hasTouch: true
  },
  {
    name: "tablet",
    width: 768,
    height: 1024,
    isMobile: false,
    hasTouch: true
  },
  {
    name: "desktop",
    width: 1440,
    height: 1000,
    isMobile: false,
    hasTouch: false
  },
  {
    name: "wide",
    width: 1920,
    height: 1080,
    isMobile: false,
    hasTouch: false
  }
];

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".mp4")) return "video/mp4";
  if (filePath.endsWith(".xml")) return "application/xml; charset=utf-8";
  if (filePath.endsWith(".txt")) return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, baseURL);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === "/") pathname = "/index.html";

    const safePath = path.normalize(path.join(root, pathname));
    if (!safePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType(safePath) });

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    fs.createReadStream(safePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizeInternalHref(href) {
  if (!href) return null;
  if (href.startsWith("#")) return null;
  if (href.startsWith("mailto:")) return null;
  if (href.startsWith("tel:")) return null;
  if (href.startsWith("http://") || href.startsWith("https://")) return null;

  const [withoutHash] = href.split("#");
  const [withoutQuery] = withoutHash.split("?");

  if (!withoutQuery || withoutQuery === "/") return "index.html";
  if (withoutQuery.endsWith("/")) return `${withoutQuery}index.html`.replace(/^\//, "");

  return withoutQuery.replace(/^\//, "");
}

async function collectPageIssues(pageName, page) {
  const issues = [];
  const pageErrors = [];
  const consoleErrors = [];
  const badResponses = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      const text = message.text();
      const sourceUrl = message.location()?.url || "";

      // Expected until the real walkthrough video lands in assets/.
      if (text.includes("demo-walkthrough.mp4")) return;
      if ([...allowedMissing].some((p) => sourceUrl.endsWith(p))) return;

      consoleErrors.push(text);
    }
  });

  page.on("response", (response) => {
    const status = response.status();
    const url = new URL(response.url());
    const pathname = url.pathname;

    if (allowedMissing.has(pathname) && status === 404) return;

    if (status >= 400) {
      badResponses.push(`${status} ${pathname}`);
    }
  });

  const response = await page.goto(`${baseURL}/${pageName}`, {
    waitUntil: "networkidle"
  });

  if (!response || response.status() !== 200) {
    issues.push(`Page did not return 200: ${pageName}`);
  }

  const title = await page.title();
  if (!title || title.trim().length < 3) {
    issues.push(`Missing or weak <title>: ${pageName}`);
  }

  const h1Count = await page.locator("h1").count();
  if (h1Count < 1) {
    issues.push(`Missing h1: ${pageName}`);
  }

  const links = await page.locator("a[href]").evaluateAll((anchors) =>
    anchors.map((a) => a.getAttribute("href"))
  );

  for (const href of links) {
    const internal = normalizeInternalHref(href);
    if (!internal) continue;

    const target = path.join(root, internal);
    if (!fs.existsSync(target)) {
      issues.push(`Broken internal link on ${pageName}: ${href}`);
    }
  }

  await page.waitForTimeout(200);

  for (const error of pageErrors) issues.push(`JS page error on ${pageName}: ${error}`);
  for (const error of consoleErrors) issues.push(`Console error on ${pageName}: ${error}`);
  for (const error of badResponses) issues.push(`Bad response on ${pageName}: ${error}`);

  return issues;
}

async function testAvatarDemo(page) {
  await page.goto(`${baseURL}/avatar-demo.html`, { waitUntil: "networkidle" });

  await page.locator("[data-avatar-choice='einstein']").click();
  await page.waitForTimeout(200);

  const name = await page.locator("[data-avatar-name]").innerText();
  assert(name.includes("Albert Einstein"), "Avatar picker did not switch to Albert Einstein.");

  await page.locator("[data-start-voice]").click();
  await page.waitForTimeout(2100);

  const statusAfterStart = await page.locator("[data-avatar-status]").innerText();
  assert(
    /Thinking|Speaking|Ready|Listening/.test(statusAfterStart),
    "Start voice chat did not update avatar status."
  );

  await page.locator("[data-send-text]").click();
  await page.waitForTimeout(1600);

  const transcript = await page.locator("[data-transcript-box]").innerText();
  assert(
    transcript.includes("practical takeaway") || transcript.includes("Yes."),
    "Send text did not append expected transcript content."
  );

  await page.locator("[data-upload-material]").click();
  await page.waitForTimeout(2200);

  const switched = await page.locator("[data-avatar-name]").innerText();
  assert(switched.includes("Professor Chen"), "Upload class material did not switch to Professor Chen.");

  await page.locator("[data-end-session]").click();
}

async function testContactPaths(page) {
  const paths = ["course", "department", "deployment", "teacher", "school", "avatar", "practice"];

  for (const pathName of paths) {
    await page.goto(`${baseURL}/contact.html?path=${pathName}`, { waitUntil: "networkidle" });

    const active = await page.locator(`[data-path-card="${pathName}"].active`).count();
    assert(active === 1, `Contact path did not highlight: ${pathName}`);

    const note = await page.locator("[data-selected-path-note]").innerText();
    assert(note.toLowerCase().includes("selected"), `Contact note did not update for: ${pathName}`);
  }
}

async function testForbiddenLanguage(page) {
  // Word-boundary \b prevents OpenAI from matching AI-* / AI-dash patterns.
  const forbiddenPatterns = [
    { name: "AI-powered", regex: /\bAI-powered\b/i },
    { name: "AI-driven", regex: /\bAI-driven\b/i },
    { name: "AI-avatar", regex: /\bAI-avatar\b/i },
    { name: "AI-tutor", regex: /\bAI-tutor\b/i },
    { name: "AI - / AI – / AI — (spaced dash)", regex: /\bAI\s+[-–—]/ }
  ];

  for (const pageName of pages) {
    await page.goto(`${baseURL}/${pageName}`, { waitUntil: "networkidle" });
    const body = await page.locator("body").innerText();

    for (const { name, regex } of forbiddenPatterns) {
      const match = body.match(regex);
      if (match) {
        const idx = match.index ?? 0;
        const start = Math.max(0, idx - 40);
        const snippet = body.slice(start, idx + match[0].length + 40).replace(/\s+/g, " ");
        throw new Error(
          `Forbidden phrase "${name}" on ${pageName}: …${snippet}…`
        );
      }
    }
  }
}

async function testDiscovery(page) {
  await page.goto(`${baseURL}/experts.html`, { waitUntil: "networkidle" });

  const markers = [
    "Search anyone with a Wikipedia page",
    "Source status",
    "Educational avatar inspired by public-source material",
    "Preview the avatars",
    "Wikipedia biography",
    "The avatar can only be as good as its source set"
  ];

  const body = await page.locator("body").innerText();
  for (const marker of markers) {
    assert(body.includes(marker), `Missing discovery marker on experts.html: "${marker}"`);
  }

  const previewCount = await page.locator(".avatar-preview-card").count();
  assert(
    previewCount >= 12,
    `Expected at least 12 avatar preview cards, got ${previewCount}`
  );

  const input = page.locator("[data-discovery-input]");
  await input.fill("Marie Curie");
  await input.dispatchEvent("input");
  await page.waitForTimeout(150);

  const nameAfter = await page.locator("[data-discovery-name]").innerText();
  assert(
    nameAfter.includes("Marie Curie"),
    `Discovery search did not update name: got "${nameAfter}"`
  );

  await input.fill("Spencer Brown");
  await input.dispatchEvent("input");
  await page.waitForTimeout(150);

  const statusAfter = await page.locator("[data-discovery-status]").innerText();
  assert(
    /verify|Static preview/i.test(statusAfter),
    `Discovery fallback message missing for unknown query: got "${statusAfter}"`
  );

  // Homepage search-anyone block markers
  await page.goto(`${baseURL}/index.html`, { waitUntil: "networkidle" });
  const homeBody = await page.locator("body").innerText();
  assert(
    homeBody.includes("Search anyone with a Wikipedia page"),
    "Missing homepage discovery marker."
  );
  assert(
    homeBody.includes("Browse avatars"),
    "Missing homepage 'Browse avatars' CTA."
  );
}

function testDiscoveryDocsExist() {
  const required = ["AVATAR_DISCOVERY.md", "WIKIPEDIA_SOURCE_POLICY.md"];
  for (const docName of required) {
    const docPath = path.join(root, docName);
    assert(fs.existsSync(docPath), `Required discovery doc missing: ${docName}`);
    const contents = fs.readFileSync(docPath, "utf8");
    assert(contents.length > 200, `Discovery doc appears empty: ${docName}`);
  }
}

async function testNavConsistency(page) {
  const expected = ["College", "Avatars", "Practice", "How it works", "Pricing", "Book a demo"];
  const forbiddenTop = ["Education", "Demo", "Avatar demo", "Enterprise", "Pilot"];

  for (const pageName of pages) {
    await page.goto(`${baseURL}/${pageName}`, { waitUntil: "networkidle" });
    const links = await page.locator(".links a").allInnerTexts();

    for (const label of expected) {
      assert(
        links.includes(label),
        `Top nav on ${pageName} missing "${label}". Got: ${JSON.stringify(links)}`
      );
    }

    for (const label of forbiddenTop) {
      assert(
        !links.includes(label),
        `Top nav on ${pageName} should not include "${label}" (footer-only). Got: ${JSON.stringify(links)}`
      );
    }
  }
}

async function testCollegePositioning(page) {
  const expectations = [
    {
      page: "index.html",
      markers: [
        "Turn every college course into a living professor avatar",
        "Professors upload lectures, books, slides, transcripts, assignments, and rubrics",
        "Built first for colleges",
        "How professors use it",
        "An executive-level mentor in every student's pocket"
      ]
    },
    {
      page: "college.html",
      markers: [
        "A professor in every student's pocket",
        "Upload the materials students already learn from",
        "Students learn by asking, practicing, and trying again",
        "Professors stay in control",
        "Better student support without lowering the bar"
      ]
    },
    {
      page: "education.html",
      markers: [
        "For professors, departments, and college programs",
        "What professors can upload",
        "What students can do with it",
        "Not answer-giving. Learning support."
      ]
    },
    {
      page: "avatar-demo.html",
      markers: [
        "Course Professor",
        "Grounded in uploaded lectures, books, slides, and assignments",
        "College use cases",
        "Course mode",
        "Office hours mode",
        "Exam prep mode",
        "Case discussion mode"
      ]
    },
    {
      page: "pricing.html",
      markers: [
        "Course Pilot",
        "Department",
        "College / School",
        "Private Deployment"
      ]
    }
  ];

  for (const { page: pageName, markers } of expectations) {
    await page.goto(`${baseURL}/${pageName}`, { waitUntil: "networkidle" });
    const body = await page.locator("body").innerText();
    for (const marker of markers) {
      assert(body.includes(marker), `Missing college-positioning marker on ${pageName}: "${marker}"`);
    }
  }
}

function testCollegeDocsExist() {
  const required = [
    "COLLEGE_PLATFORM.md",
    "COURSE_UPLOAD_WORKFLOW.md"
  ];

  for (const docName of required) {
    const docPath = path.join(root, docName);
    assert(fs.existsSync(docPath), `Required college doc missing: ${docName}`);
    const contents = fs.readFileSync(docPath, "utf8");
    assert(contents.length > 200, `College doc appears empty: ${docName}`);
  }
}

async function testNoVisibleDashes(page) {
  const forbiddenVisibleCharacters = ["\u2014", "\u2013"];

  for (const pageName of pages) {
    await page.goto(`${baseURL}/${pageName}`, { waitUntil: "networkidle" });
    const body = await page.locator("body").innerText();

    for (const char of forbiddenVisibleCharacters) {
      const idx = body.indexOf(char);
      if (idx !== -1) {
        const start = Math.max(0, idx - 40);
        const snippet = body
          .slice(start, idx + 1 + 40)
          .replace(/\s+/g, " ");
        const name = char === "\u2014" ? "em dash (\\u2014)" : "en dash (\\u2013)";
        throw new Error(
          `Forbidden ${name} on ${pageName}: \u2026${snippet}\u2026`
        );
      }
    }
  }
}

function testNoVisibleDashesInMarkdown() {
  const docs = fs
    .readdirSync(root)
    .filter((name) => name.endsWith(".md") && name !== "SLA.md");

  for (const name of docs) {
    const text = fs.readFileSync(path.join(root, name), "utf8");
    const idx = Math.max(text.indexOf("\u2014"), text.indexOf("\u2013"));
    if (idx !== -1) {
      const start = Math.max(0, idx - 40);
      const snippet = text.slice(start, idx + 1 + 40).replace(/\s+/g, " ");
      throw new Error(
        `Forbidden em/en dash in ${name}: \u2026${snippet}\u2026`
      );
    }
  }
}

async function testAvatarDemoClarity(page) {
  await page.goto(`${baseURL}/avatar-demo.html`, { waitUntil: "networkidle" });
  const body = await page.locator("body").innerText();

  const markers = [
    "Step into the conversation",
    "Choose who you want at the table",
    "Choose the mode",
    "Get better",
    "Live conversation",
    "Grounding",
    "Feedback",
    "The mouth matters",
    "The source matters",
    "The practice loop matters"
  ];

  for (const marker of markers) {
    assert(body.includes(marker), `Missing avatar demo clarity marker: "${marker}"`);
  }
}

async function testExpertLibrary(page) {
  await page.goto(`${baseURL}/experts.html`, { waitUntil: "networkidle" });

  const cardCount = await page.locator("[data-expert-card]").count();
  assert(
    cardCount >= 60,
    `Expert library has ${cardCount} cards, expected at least 60.`
  );

  const body = await page.locator("body").innerText();

  const requiredQuote = "If you could have dinner with anyone";
  assert(body.includes(requiredQuote), `Missing experts hero quote: "${requiredQuote}"`);

  const requiredNames = [
    "Hypatia",
    "Ibn Sina",
    "Rumi",
    "Murasaki Shikibu",
    "Katherine Johnson",
    "Wangari Maathai",
    "Nelson Mandela",
    "Frida Kahlo",
    "Chinua Achebe",
    "Ashoka",
    "Hatshepsut",
    "Bruce Lee"
  ];

  for (const name of requiredNames) {
    assert(body.includes(name), `Missing required diverse luminary on experts.html: "${name}"`);
  }

  await page.locator("[data-expert-filter='science']").click();
  await page.waitForTimeout(150);

  const visibleScience = await page.locator("[data-expert-card]:not([hidden])").count();
  assert(
    visibleScience >= 10,
    `Science filter showed ${visibleScience} cards, expected at least 10.`
  );

  const einsteinVisible = await page
    .locator("[data-expert-card]:not([hidden]) h3", { hasText: "Albert Einstein" })
    .count();
  assert(einsteinVisible === 1, "Science filter should keep Einstein visible.");

  const cleopatraHidden = await page
    .locator("[data-expert-card][hidden] h3", { hasText: "Cleopatra" })
    .count();
  assert(cleopatraHidden === 1, "Science filter should hide Cleopatra.");

  await page.locator("[data-expert-filter='all']").click();
  await page.waitForTimeout(150);

  const visibleAfterReset = await page.locator("[data-expert-card]:not([hidden])").count();
  assert(
    visibleAfterReset >= 60,
    `Reset to All showed ${visibleAfterReset} cards, expected 60.`
  );
}

async function testHomepageFirstImpression(page) {
  await page.goto(`${baseURL}/index.html`, { waitUntil: "networkidle" });
  const body = await page.locator("body").innerText();

  const markers = [
    "Have dinner with anyone who ever changed the world",
    "Explore 60 avatars",
    "60 minds at the table",
    "Grounded sources",
    "Private deployment"
  ];

  for (const marker of markers) {
    assert(body.includes(marker), `Missing homepage first-impression marker: "${marker}"`);
  }

  const mindPillCount = await page.locator(".minds-wall .mind-pill").count();
  assert(mindPillCount >= 20, `Homepage minds wall has ${mindPillCount} pills, expected at least 20.`);
}

async function testTrustContent(page) {
  const expectations = [
    {
      page: "avatar-demo.html",
      markers: [
        "Why mouth movement matters",
        "Why grounding matters"
      ]
    },
    {
      page: "how-it-works.html",
      markers: [
        "Realism breaks at the mouth",
        "Phoneme-aware lip sync",
        "Professors should know exactly what the avatar is allowed to say",
        "Strict mode",
        "Private deployment for sensitive learning environments",
        "On-prem deployment",
        "Private cloud",
        "No-training mode"
      ]
    },
    {
      page: "education.html",
      markers: [
        "Professor controls",
        "Strict grounding",
        "Students learn best when they can safely struggle",
        "Practice without embarrassment"
      ]
    },
    {
      page: "index.html",
      markers: [
        "Students learn best when they can safely struggle",
        "Confidence building"
      ]
    },
    {
      page: "enterprise.html",
      markers: [
        "Private deployment for sensitive learning environments",
        "On-prem deployment",
        "Private cloud",
        "No-training mode",
        "How we talk about security"
      ]
    },
    {
      page: "pricing.html",
      markers: [
        "Private deployment for sensitive learning environments",
        "On-prem deployment",
        "No-training mode"
      ]
    }
  ];

  for (const { page: pageName, markers } of expectations) {
    await page.goto(`${baseURL}/${pageName}`, { waitUntil: "networkidle" });
    const body = await page.locator("body").innerText();

    for (const marker of markers) {
      assert(
        body.includes(marker),
        `Missing trust content on ${pageName}: "${marker}"`
      );
    }
  }
}

async function testRoleplayModes(page) {
  await page.goto(`${baseURL}/avatar-demo.html`, { waitUntil: "networkidle" });

  await page.locator("[data-roleplay-mode='interview']").click();
  await page.waitForTimeout(150);

  const interviewResponse = await page.locator("[data-roleplay-response]").innerText();
  assert(
    /retention|hypotheses/i.test(interviewResponse),
    "Interview roleplay mode did not update response."
  );

  const interviewFeedback = await page.locator("[data-roleplay-feedback]").innerText();
  assert(
    /sharpen|structure|assumptions|metric/i.test(interviewFeedback),
    "Interview roleplay mode did not update feedback."
  );

  await page.locator("[data-roleplay-mode='sales']").click();
  await page.waitForTimeout(150);

  const salesResponse = await page.locator("[data-roleplay-response]").innerText();
  assert(
    /buyer|discovery|support cost/i.test(salesResponse),
    "Sales roleplay mode did not update response."
  );

  await page.locator("[data-roleplay-mode='negotiation']").click();
  await page.waitForTimeout(150);

  const negotiationResponse = await page.locator("[data-roleplay-response]").innerText();
  assert(
    /recruiter|salary|budget/i.test(negotiationResponse),
    "Negotiation roleplay mode did not update response."
  );

  const activeTabCount = await page.locator("[data-roleplay-mode='negotiation'].active").count();
  assert(activeTabCount === 1, "Negotiation roleplay tab was not marked active.");

  const groundingPanelCount = await page.locator(".grounding-panel").count();
  assert(groundingPanelCount >= 1, "Grounding panel missing on avatar demo.");
}

async function testTracker(page) {
  await page.goto(`${baseURL}/outreach-tracker.html`, { waitUntil: "networkidle" });

  await page.evaluate(() => {
    localStorage.removeItem("dwa_outreach_tracker_v1");
    localStorage.removeItem("dwa_launch_checklist_v1");
  });

  await page.reload({ waitUntil: "networkidle" });

  await page.locator("[name='name']").fill("Professor QA Test");
  await page.locator("[name='school']").fill("QA Business School");
  await page.locator("[name='email']").fill("qa@example.edu");
  await page.locator("[name='status']").selectOption("Sent");
  await page.locator("[name='notes']").fill("QA test contact.");
  await page.locator("[data-tracker-form] button[type='submit']").click();

  await page.waitForTimeout(300);

  // Each contact renders as <input value="..."> fields so we read innerHTML
  // (innerText skips form values).
  const rowMarkup = await page.locator("[data-tracker-body]").innerHTML();
  assert(rowMarkup.includes("Professor QA Test"), "Tracker did not add contact.");

  const total = await page.locator("[data-total-count]").innerText();
  assert(total === "1", "Tracker total count did not update.");

  await page.locator("[data-launch-check='video']").check();
  await page.reload({ waitUntil: "networkidle" });

  const checked = await page.locator("[data-launch-check='video']").isChecked();
  assert(checked, "Launch checklist did not persist.");

  await page.locator("[data-delete-contact]").click();
  await page.waitForTimeout(300);

  const totalAfterDelete = await page.locator("[data-total-count]").innerText();
  assert(totalAfterDelete === "0", "Tracker delete did not update count.");
}

async function checkNoHorizontalOverflow(page, pageName, viewportName) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      bodyScrollWidth: document.body.scrollWidth
    };
  });

  const maxAllowed = overflow.clientWidth + 4;

  assert(
    overflow.scrollWidth <= maxAllowed && overflow.bodyScrollWidth <= maxAllowed,
    `Horizontal overflow on ${pageName} at ${viewportName}: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}`
  );
}

async function checkTapTargets(page, pageName, viewportName) {
  const badTargets = await page.locator("a, button").evaluateAll((nodes) => {
    return nodes
      .map((node) => {
        const rect = node.getBoundingClientRect();
        const text = (node.textContent || node.getAttribute("aria-label") || "").trim();
        const style = window.getComputedStyle(node);
        const display = style.display;
        const visible =
          rect.width > 0 &&
          rect.height > 0 &&
          style.visibility !== "hidden" &&
          display !== "none";

        if (!visible) return null;

        // WCAG 2.5.8 exempts inline links inside flowing text from the
        // minimum target-size rule. We honor that exemption so we only
        // flag standalone interactive elements.
        if (display === "inline") return null;

        return {
          text: text.slice(0, 40),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      })
      .filter(Boolean)
      .filter((item) => item.width < 36 || item.height < 36)
      .slice(0, 8);
  });

  assert(
    badTargets.length === 0,
    `Small tap targets on ${pageName} at ${viewportName}: ${JSON.stringify(badTargets)}`
  );
}

async function checkHeroVisible(page, pageName, viewportName) {
  const h1 = page.locator("h1").first();
  await h1.scrollIntoViewIfNeeded();

  const box = await h1.boundingBox();
  assert(Boolean(box), `H1 is not visible on ${pageName} at ${viewportName}`);
  assert(box.height > 20, `H1 height too small on ${pageName} at ${viewportName}`);
}

async function checkPremiumUxElements(page, pageName, viewportName) {
  const progressExists = await page.locator(".scroll-progress").count();
  assert(progressExists === 1, `Missing scroll progress bar on ${pageName} at ${viewportName}`);

  if (viewportName.startsWith("mobile")) {
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(200);

    const stickyCount = await page.locator(".mobile-sticky-cta").count();
    assert(stickyCount <= 1, `Duplicate mobile sticky CTA on ${pageName} at ${viewportName}`);
  }
}

async function checkAvatarMobileExperience(page, viewport) {
  await page.goto(`${baseURL}/avatar-demo.html`, { waitUntil: "networkidle" });

  const pickerCount = await page.locator("[data-avatar-choice]").count();
  assert(pickerCount === 5, `Avatar picker missing options at ${viewport.name}`);

  await page.locator("[data-avatar-choice='cleopatra']").click();
  await page.waitForTimeout(200);

  const name = await page.locator("[data-avatar-name]").innerText();
  assert(name.includes("Cleopatra"), `Mobile avatar picker failed at ${viewport.name}`);

  const avatarFrame = await page.locator(".avatar-frame").boundingBox();
  assert(Boolean(avatarFrame), `Avatar frame not visible at ${viewport.name}`);

  if (viewport.width <= 430) {
    assert(
      avatarFrame.width <= viewport.width,
      `Avatar frame wider than viewport at ${viewport.name}`
    );

    assert(
      avatarFrame.height >= 240,
      `Avatar frame too short on mobile at ${viewport.name}`
    );
  }

  await page.locator("[data-start-voice]").click();
  await page.waitForTimeout(2100);

  const status = await page.locator("[data-avatar-status]").innerText();
  assert(
    /Listening|Thinking|Speaking|Ready/.test(status),
    `Avatar voice state failed on ${viewport.name}`
  );
}

async function collectResponsiveIssues(browser) {
  const issues = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: {
        width: viewport.width,
        height: viewport.height
      },
      isMobile: viewport.isMobile,
      hasTouch: viewport.hasTouch
    });

    const page = await context.newPage();

    for (const pageName of pages) {
      try {
        await page.goto(`${baseURL}/${pageName}`, { waitUntil: "networkidle" });
        await checkNoHorizontalOverflow(page, pageName, viewport.name);
        await checkHeroVisible(page, pageName, viewport.name);
        await checkPremiumUxElements(page, pageName, viewport.name);

        if (viewport.isMobile) {
          await checkTapTargets(page, pageName, viewport.name);
        }
      } catch (error) {
        issues.push(error.message);
      }
    }

    try {
      await checkAvatarMobileExperience(page, viewport);
    } catch (error) {
      issues.push(error.message);
    }

    await context.close();
  }

  return issues;
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({ headless });

  const allIssues = [];

  try {
    const page = await browser.newPage();

    for (const pageName of pages) {
      const issues = await collectPageIssues(pageName, page);
      allIssues.push(...issues);
      console.log(`Checked ${pageName}`);
    }

    await testAvatarDemo(page);
    console.log("Checked avatar demo interactions");

    await testContactPaths(page);
    console.log("Checked contact path highlighting");

    await testRoleplayModes(page);
    console.log("Checked roleplay mode switcher");

    await testTrustContent(page);
    console.log("Checked realism, upload trust, deployment, and student-safety content");

    await testExpertLibrary(page);
    console.log("Checked 60-avatar expert library + filter behavior");

    await testHomepageFirstImpression(page);
    console.log("Checked homepage first-impression markers and 60 minds wall");

    await testForbiddenLanguage(page);
    console.log("Checked forbidden AI-hyphen language on every public HTML page");

    await testAvatarDemoClarity(page);
    console.log("Checked avatar demo clarity markers");

    await testCollegePositioning(page);
    console.log("Checked college-first positioning on home, college, education, avatar-demo, pricing");

    testCollegeDocsExist();
    console.log("Checked COLLEGE_PLATFORM.md and COURSE_UPLOAD_WORKFLOW.md exist");

    await testNavConsistency(page);
    console.log("Checked top nav is consistent and premium on every page");

    await testDiscovery(page);
    console.log("Checked avatar discovery (search, preview gallery, homepage search-anyone)");

    testDiscoveryDocsExist();
    console.log("Checked AVATAR_DISCOVERY.md and WIKIPEDIA_SOURCE_POLICY.md exist");

    await testNoVisibleDashes(page);
    console.log("Checked zero em/en dashes on every public HTML page");

    testNoVisibleDashesInMarkdown();
    console.log("Checked zero em/en dashes in public markdown (SLA.md exempt)");

    await testTracker(page);
    console.log("Checked outreach tracker");

    await page.close();

    const responsiveIssues = await collectResponsiveIssues(browser);
    allIssues.push(...responsiveIssues);
    console.log("Checked responsive layouts across mobile, tablet, desktop, and wide screens");
  } finally {
    await browser.close();
    server.close();
  }

  if (allIssues.length) {
    console.error("\nQA failed:\n");
    for (const issue of allIssues) console.error(`- ${issue}`);
    process.exit(1);
  }

  console.log("\nQA passed. All front-end pages look healthy.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
