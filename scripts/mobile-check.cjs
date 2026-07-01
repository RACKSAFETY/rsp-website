/*
 * Mobile responsive check (Playwright).
 * Usage:  npm run build && npm run start   (in one terminal)
 *         npm run mobile-check             (in another)
 * Loads key pages at phone (390px) and tablet (768px) widths, reports any
 * horizontal overflow, and confirms the hamburger menu opens. Exits non-zero
 * if anything fails, so it can gate CI. Override the base URL with BASE_URL.
 */
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const PAGES = ['/', '/catalog', '/products/column-guards', '/contact', '/services', '/about', '/resources'];
const WIDTHS = [390, 768];
const TOLERANCE_PX = 8; // sub-pixel border/rounding noise is not a real overflow

(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 860 }, isMobile: w < 600, hasTouch: w < 600 });
    for (const path of PAGES) {
      const page = await ctx.newPage();
      try {
        await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 });
        await page.waitForTimeout(400);
        const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        const ok = over <= TOLERANCE_PX;
        if (!ok) failed++;
        console.log(`${ok ? 'PASS' : 'FAIL'}  ${String(w).padEnd(4)} ${path.padEnd(28)} overflow=${over}px`);
      } catch (e) {
        failed++;
        console.log(`ERROR ${w} ${path}: ${e.message}`);
      }
      await page.close();
    }
    await ctx.close();
  }
  // Hamburger menu opens on phone
  const ctx = await browser.newContext({ viewport: { width: 390, height: 860 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  const burger = await p.$('.rsp-nav-burger');
  let navOk = false;
  if (burger) {
    await burger.click();
    await p.waitForTimeout(300);
    navOk = await p.$eval('.rsp-nav-panel', (el) => getComputedStyle(el).display !== 'none').catch(() => false);
  }
  if (!navOk) failed++;
  console.log(`${navOk ? 'PASS' : 'FAIL'}  nav  hamburger menu opens`);

  await browser.close();
  console.log(failed ? `\n${failed} mobile check(s) failed.` : '\nAll mobile checks passed.');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
