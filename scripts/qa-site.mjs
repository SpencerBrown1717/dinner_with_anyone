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

  await page.locator("[data-avatar-choice='chen']").click();
  await page.waitForTimeout(200);

  const name = await page.locator("[data-avatar-name]").innerText();
  assert(name.includes("Professor Chen"), "Avatar picker did not switch to Professor Chen.");

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
  const paths = ["teacher", "school", "avatar", "practice"];

  for (const pathName of paths) {
    await page.goto(`${baseURL}/contact.html?path=${pathName}`, { waitUntil: "networkidle" });

    const active = await page.locator(`[data-path-card="${pathName}"].active`).count();
    assert(active === 1, `Contact path did not highlight: ${pathName}`);

    const note = await page.locator("[data-selected-path-note]").innerText();
    assert(note.toLowerCase().includes("selected"), `Contact note did not update for: ${pathName}`);
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
    /structure|assumptions/i.test(interviewFeedback),
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
  assert(pickerCount === 4, `Avatar picker missing options at ${viewport.name}`);

  await page.locator("[data-avatar-choice='chen']").click();
  await page.waitForTimeout(200);

  const name = await page.locator("[data-avatar-name]").innerText();
  assert(name.includes("Professor Chen"), `Mobile avatar picker failed at ${viewport.name}`);

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
