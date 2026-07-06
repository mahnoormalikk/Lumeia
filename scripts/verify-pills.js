// Verify the rebuilt benefit-pills + guarantee line on the STAGING theme.
// node scripts/verify-pills.js
const { chromium, devices } = require('playwright');
const THEME = '187684028796';
const PASSWORD = 'lumeianumber1';
const BASE = 'https://itslumeia.com';

const probe = () => {
  const pills = [...document.querySelectorAll('.lumeia-pills .lumeia-pill')];
  const cont = document.querySelector('.lumeia-pills__list');
  const gi = document.querySelector('.list-item-block');
  const cs = el => el ? getComputedStyle(el) : null;
  const txt = pills[0]?.querySelector('.lumeia-pill__text');
  const tcs = cs(txt);
  return {
    pillCount: pills.length,
    pillTexts: pills.map(p => p.querySelector('.lumeia-pill__text')?.textContent.trim()),
    listFlexDir: cont ? cs(cont).flexDirection : 'NO-CONTAINER',
    listFlexWrap: cont ? cs(cont).flexWrap : '',
    listJustify: cont ? cs(cont).justifyContent : '',
    listAlign: cont ? cs(cont).alignItems : '',
    pillBg: pills[0] ? cs(pills[0]).backgroundColor : 'NO-PILL',
    pillRadius: pills[0] ? cs(pills[0]).borderTopLeftRadius : '',
    pillPad: pills[0] ? cs(pills[0]).padding : '',
    textFont: tcs ? tcs.fontFamily : 'NO-TEXT',
    textColor: tcs ? tcs.color : '',
    textTransform: tcs ? tcs.textTransform : '',
    guaranteePresent: !!gi,
    guaranteeText: gi ? gi.textContent.replace(/\s+/g,' ').trim() : null,
    guaranteeIconImg: gi ? !!gi.querySelector('.list-item__icon svg, .list-item__icon img') : null,
    htmlLang: document.documentElement.lang,
    htmlDir: document.documentElement.dir,
  };
};

(async () => {
  const browser = await chromium.launch();
  const runs = [
    { label: 'EN desktop', path: '/', device: null },
    { label: 'AR desktop', path: '/ar', device: null },
    { label: 'EN mobile',  path: '/', device: 'iPhone 13' },
    { label: 'AR mobile',  path: '/ar', device: 'iPhone 13' },
  ];
  for (const r of runs) {
    const ctx = await browser.newContext(r.device ? { ...devices[r.device] } : { viewport: { width: 1280, height: 900 } });
    await ctx.request.post(`${BASE}/password`, { form: { form_type: 'storefront_password', utf8: '✓', password: PASSWORD } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}${r.path}?preview_theme_id=${THEME}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const res = await page.evaluate(probe);
    console.log('\n===== ' + r.label + ' =====');
    console.log(JSON.stringify(res, null, 1));
    // small element screenshot of the pills (safe size)
    const el = await page.$('.lumeia-pills');
    if (el) await el.screenshot({ path: `scripts/pills-${r.label.replace(' ','-')}.png` }).catch(()=>{});
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
