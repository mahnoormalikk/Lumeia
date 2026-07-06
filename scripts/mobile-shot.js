// Mobile screenshot of the DEV theme, so Claude can self-verify mobile layout.
// Setup once:  npm i -D playwright && npx playwright install chromium
// Use:         node scripts/mobile-shot.js <path> <out.png> [scrollY]
//   node scripts/mobile-shot.js /products/complete-collagen cc-mobile.png
//   node scripts/mobile-shot.js / home-mobile.png 1600
// Screenshots the VIEWPORT only (not full page) to stay under the image-size limit;
// pass a scrollY to capture lower sections in separate shots.
const { chromium, devices } = require('playwright');

(async () => {
  const path = process.argv[2] || '/';
  const out = process.argv[3] || 'mobile.png';
  const scrollY = parseInt(process.argv[4] || '0', 10);
  const DEV_THEME = '187485421948';
  const PASSWORD = 'lumeianumber1';
  const BASE = 'https://itslumeia.com';

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();

  // Authenticate by posting the storefront password (sets the session cookie), like a form submit.
  await ctx.request.post(`${BASE}/password`, {
    form: { form_type: 'storefront_password', utf8: '✓', password: PASSWORD }
  });

  await page.goto(`${BASE}${path}?preview_theme_id=${DEV_THEME}`, { waitUntil: 'networkidle' });
  if (scrollY) { await page.evaluate(y => window.scrollTo(0, y), scrollY); await page.waitForTimeout(1000); }
  await page.screenshot({ path: out });
  await browser.close();
  console.log('saved', out);
})().catch(e => { console.error(e); process.exit(1); });
