const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, 'src/assets/js', name), 'utf8');
const id = require('../src/_data/site.json').ga4Id;

// DOM-only tests: resources are never loaded and every submission is intercepted.
function setup({ slug = '', query = '', host = 'https://bimport.jp', referrer = 'https://www.google.com/search?q=private-test', stored, blockedStorage, draft, disabled, endpoint = true, analytics = true, reply = { ok: true }, reject = false } = {}) {
  const html = fs.readFileSync(path.join(root, 'dist', slug, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { url: `${host}/${slug ? slug + '/' : ''}${query}`, referrer, runScripts: 'outside-only' });
  const w = dom.window;
  // Normal submission fixtures include more than five elapsed seconds.
  // Fast/expired clocks are exercised separately in intake-window.test.cjs.
  let now = Date.parse('2026-11-26T00:00:00Z');
  const NativeDate = w.Date;
  w.Date = class extends NativeDate { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } };
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.matchMedia = () => ({ matches: true });
  if (stored) w.localStorage.setItem('bimport_analytics_opt_out', '1');
  if (blockedStorage) Object.defineProperty(w, 'localStorage', { get() { throw new Error('blocked'); } });
  if (disabled) w['ga-disable-' + id] = true;
  const tag = w.document.querySelector('script[data-ga4-id]');
  if (draft) tag.setAttribute('data-draft', 'true');
  Object.defineProperty(w.document, 'currentScript', { value: tag });
  const config = w.document.getElementById('estimate-config');
  if (!endpoint) config.textContent = JSON.stringify({ ...JSON.parse(config.textContent), endpoint: '' });
  let posts = 0;
  w.fetch = async () => { posts++; if (reject) throw new Error('offline'); return { ok: true, json: async () => reply }; };
  if (analytics) w.eval(source('analytics.js'));
  w.eval(source(slug ? 'estimate-form.js' : 'home-estimate.js'));
  const form = w.document.getElementById('estimate-form');
  const events = () => Array.from(w.dataLayer || [], x => Array.from(x)).filter(x => x[0] === 'event');
  const input = (name, value) => {
    const el = form.querySelector(`[name="${name}"]`);
    el.value = value;
    el.dispatchEvent(new w.Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  };
  function complete() {
    if (!slug) {
      input('maker', 'other'); input('makerOther', 'PRIVATE-MAKER');
      input('model', 'other'); input('modelOther', 'PRIVATE-MODEL'); input('grade', 'PRIVATE-GRADE');
    } else {
      const radios = form.querySelectorAll('[name="bodyType"]');
      if (radios.length) radios[radios.length - 1].click();
      const grade = form.querySelector('[name="grade"]');
      input('grade', grade.options[grade.options.length - 1].value);
    }
    for (const name of ['year', 'mileage']) {
      const select = form.querySelector(`[name="${name}"]`);
      input(name, select.options[select.options.length - 1].value);
    }
    form.querySelector('[data-step="1"] [data-next]').click();
    input('name', 'PRIVATE-NAME'); input('phone', '090-0000-0000');
    form.querySelector('[data-step="2"] [data-next]').click();
    assert.equal(w.document.getElementById('estimate-step-num').textContent, '3');
    now += 6000;
  }
  const submit = () => form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  return { w, form, events, input, complete, submit, posts: () => posts, close: () => w.close() };
}
const settle = () => new Promise(resolve => setTimeout(resolve, 10));

for (const slug of ['', 'bmw-3-series']) {
  test(`${slug || 'home'}: success exactly once; clean page attribution; no form values`, async () => {
    const t = setup({ slug, query: '?phone=09000000000&name=PRIVATE-NAME#private' });
    try {
      assert.equal(t.events().length, 0);
      const config = Array.from(t.w.dataLayer, x => Array.from(x)).find(x => x[0] === 'config');
      assert.equal(config[1], id);
      assert.equal(config[2].page_location, `https://bimport.jp/${slug ? slug + '/' : ''}`);
      assert.equal(config[2].page_referrer, 'https://www.google.com/');
      assert.equal(config[2].page_type, slug ? 'vehicle_lp' : 'home');
      t.input('website', 'bot');
      assert.equal(t.events().length, 0);
      t.input('website', '');
      t.complete();
      // Back/forward edits must not inflate the funnel counts.
      t.form.querySelector('[data-step="3"] [data-prev]').click();
      t.form.querySelector('[data-step="2"] [data-next]').click();
      assert.deepEqual(t.events().map(e => e[1]), ['estimate_start', 'estimate_step', 'estimate_step']);
      t.submit(); t.submit(); await settle(); t.submit();
      assert.equal(t.posts(), 1);
      assert.equal(t.events().filter(e => e[1] === 'generate_lead').length, 1);
      assert.equal(t.w.document.getElementById('estimate-done').hidden, false);
      const sent = JSON.stringify(t.w.dataLayer);
      for (const secret of ['PRIVATE-', '09000000000', '090-0000-0000', 'private-test']) assert.equal(sent.includes(secret), false);
    } finally { t.close(); }
  });
  for (const variant of [{ reply: { ok: false } }, { reject: true }]) {
    test(`${slug || 'home'}: no lead on ${variant.reject ? 'network failure' : 'server rejection'}`, async () => {
      const t = setup({ slug, ...variant });
      try { t.complete(); t.submit(); await settle(); assert.equal(t.events().some(e => e[1] === 'generate_lead'), false); assert.equal(t.form.hidden, false); assert.equal(t.w.document.getElementById('estimate-submit').disabled, false); } finally { t.close(); }
    });
  }
  test(`${slug || 'home'}: no lead on test response`, async () => {
    const t = setup({ slug, reply: { ok: true, test: true } });
    try { t.complete(); t.submit(); await settle(); assert.equal(t.events().some(e => e[1] === 'generate_lead'), false); } finally { t.close(); }
  });
  test(`${slug || 'home'}: analytics unavailable does not break form`, async () => {
    const t = setup({ slug, analytics: false });
    try { t.complete(); t.submit(); await settle(); assert.equal(t.posts(), 1); assert.equal(t.form.hidden, true); } finally { t.close(); }
  });
  test(`${slug || 'home'}: honeypot submission is not a lead even if server replies ok`, async () => {
    const t = setup({ slug });
    try { t.complete(); t.input('website', 'bot'); t.submit(); await settle(); assert.equal(t.events().some(e => e[1] === 'generate_lead'), false); } finally { t.close(); }
  });
}
for (const options of [{ host: 'http://localhost:8096' }, { host: 'https://preview.example.com' }, { stored: true }, { query: '?analytics=off' }, { query: '?analytics=off', blockedStorage: true }, { disabled: true }, { draft: true }]) {
  test(`excluded traffic ${JSON.stringify(options)} loads no Google tag`, () => {
    const t = setup(options);
    try { t.complete(); assert.equal(t.w.document.querySelector('script[src*="googletagmanager.com"]'), null); assert.equal(t.w.dataLayer, undefined); } finally { t.close(); }
  });
}
test('debug success is separate from the real lead key event', async () => {
  const t = setup({ query: '?analytics_debug=1' });
  try { t.complete(); t.submit(); await settle(); assert.equal(t.events().filter(e => e[1] === 'estimate_test_complete').length, 1); assert.equal(t.events().some(e => e[1] === 'generate_lead'), false); } finally { t.close(); }
});
test('empty endpoint demo is never counted as a successful lead', async () => {
  const t = setup({ endpoint: false });
  try { t.complete(); t.submit(); await settle(); assert.equal(t.posts(), 0); assert.equal(t.form.hidden, false); assert.equal(t.events().some(e => e[1] === 'generate_lead'), false); } finally { t.close(); }
});
test('visitor can resume analytics after opting out', () => {
  const t = setup({ stored: true, query: '?analytics=on' });
  try { assert.equal(t.w.localStorage.getItem('bimport_analytics_opt_out'), null); assert.equal(t.w.document.querySelectorAll('script[src*="googletagmanager.com"]').length, 1); } finally { t.close(); }
});

// Reviewed marketing labels are explicit, bounded and independent of URL sanitization.
function campaignConfig(t) {
  const row = Array.from(t.w.dataLayer || [], x => Array.from(x)).find(x => x[0] === 'config');
  return row && Object.fromEntries(Object.entries(row[2]).filter(([key]) => key.startsWith('campaign_')));
}
for (const platform of ['instagram', 'tiktok', 'youtube', 'x']) {
  test(`reviewed social profile metadata: ${platform}`, () => {
    const t = setup({ query: `?source=${platform}&utm_source=${platform}&utm_medium=organic_social&utm_campaign=consultation_checklist_20261124#contact` });
    try {
      assert.deepEqual(campaignConfig(t), { campaign_source: platform, campaign_medium: 'organic_social', campaign_name: 'consultation_checklist_20261124' });
      const config = Array.from(t.w.dataLayer, x => Array.from(x)).find(x => x[0] === 'config')[2];
      assert.equal(config.page_location, 'https://bimport.jp/');
      assert.equal(config.page_referrer, 'https://www.google.com/');
      assert.equal(Array.from(t.w.dataLayer, x => Array.from(x)).filter(x => x[0] === 'config').length, 1);
    } finally { t.close(); }
  });
}
for (const campaign of ['consultation_checklist_20261124', 'gbp_posts']) {
  for (const id of ['checklist-1', 'checklist-2', 'checklist-3', 'checklist-4', 'checklist-5', 'checklist-6']) {
    test(`reviewed per-content metadata: ${campaign}/${id}`, () => {
      const src = campaign === 'gbp_posts' ? 'google' : 'x', medium = src === 'google' ? 'organic' : 'organic_social';
      const t = setup({ query: `?source=${src}&utm_source=${src}&utm_medium=${medium}&utm_campaign=${campaign}&content=${id}&utm_content=${id}` });
      try { assert.deepEqual(campaignConfig(t), {campaign_source: src, campaign_medium: medium, campaign_name: campaign, campaign_content: id}); } finally { t.close(); }
    });
  }
}
test('reviewed GBP profile does not invent content attribution', () => {
  const t = setup({query: '?source=google&utm_source=google&utm_medium=organic&utm_campaign=gbp_profile'});
  try { assert.deepEqual(campaignConfig(t), {campaign_source: 'google', campaign_medium: 'organic', campaign_name: 'gbp_profile'}); } finally { t.close(); }
});
const safeCampaign = 'utm_source=x&utm_medium=organic_social&utm_campaign=consultation_checklist_20261124';
const rejectedCampaigns = [
  safeCampaign+'&utm_source=x', safeCampaign+'&utm_medium=organic_social',
  safeCampaign+'&utm_campaign=consultation_checklist_20261124',
  safeCampaign+'&source=x&source=x', safeCampaign+'&source=youtube',
  safeCampaign+'&content=checklist-1', safeCampaign+'&utm_content=',
  safeCampaign+'&utm_content=PRIVATE-CONTENT', safeCampaign+'&utm_content=09000000000',
  safeCampaign+'&utm_content=checklist-7',
  'utm_source=google&utm_medium=organic&utm_campaign=gbp_posts&utm_content=checklist-7',
  'utm_source=instagram&utm_medium=organic_social&utm_campaign=consultation_checklist_20261124&utm_content=checklist-4',
  safeCampaign+'&utm_content=checklist-1&utm_content=checklist-1',
  safeCampaign+'&content=checklist-2&utm_content=checklist-1',
  'utm_source=instagram&utm_medium=organic_social&utm_campaign=consultation_checklist_20261124&utm_content=checklist-1',
  'utm_source=google&utm_medium=organic&utm_campaign=gbp_profile&utm_content=checklist-1',
  'utm_source=PRIVATE-NAME&utm_medium=organic_social&utm_campaign=consultation_checklist_20261124',
  'utm_source=x&utm_medium=PRIVATE-MEDIUM&utm_campaign=consultation_checklist_20261124',
  'utm_source=x&utm_medium=organic_social&utm_campaign=PRIVATE-NAME',
  'utm_source=x&utm_medium=organic_social&utm_campaign=constructor',
  'utm_source=x&utm_medium=organic_social&utm_campaign=__proto__',
];
rejectedCampaigns.forEach((query, index) => test(`ambiguous or unreviewed campaign excluded: ${index+1}`, () => {
  const t = setup({query: '?'+query});
  try {
    assert.deepEqual(campaignConfig(t), {});
    for (const value of ['PRIVATE-', '09000000000', '__proto__']) assert.equal(JSON.stringify(t.w.dataLayer).includes(value), false);
  } finally { t.close(); }
}));
test('extra URL/form data never becomes campaign metadata', () => {
  const t = setup({query: '?'+safeCampaign+'&phone=09000000000&name=PRIVATE-NAME&utm_term=PRIVATE-TERM&email=PRIVATE-MAIL#PRIVATE-HASH'});
  try {
    assert.deepEqual(campaignConfig(t), {campaign_source: 'x', campaign_medium: 'organic_social', campaign_name: 'consultation_checklist_20261124'});
    assert.equal(JSON.stringify(t.w.dataLayer).includes('PRIVATE-'), false);
    assert.equal(JSON.stringify(t.w.dataLayer).includes('09000000000'), false);
  } finally { t.close(); }
});
for (const excluded of [{draft: true}, {stored: true}]) test(`reviewed campaign respects measurement exclusion: ${Object.keys(excluded)[0]}`, () => {
  const t = setup({...excluded, query: '?'+safeCampaign});
  try { assert.equal(t.w.dataLayer, undefined); } finally { t.close(); }
});

for(const referrer of [
 'https://bimport.jp/assessment/photos/SYNTHETIC_PRIVATE_GRANT?token=SYNTHETIC_QUERY',
 'https://bimport.jp/admin/customer/SYNTHETIC_PRIVATE_NAME?phone=SYNTHETIC_PHONE',
 'https://bimport.jp/bmw-x1/?query=SYNTHETIC_PRIVATE_QUERY',
])test('same-site referrer never forwards a private or public page path: '+referrer.split('?')[0],()=>{
 const t=setup({referrer});try{
  const config=Array.from(t.w.dataLayer,x=>Array.from(x)).find(x=>x[0]==='config')[2];
  assert.equal(config.page_referrer,'https://bimport.jp/');
  assert.equal(JSON.stringify(t.w.dataLayer).includes('SYNTHETIC_'),false);
 }finally{t.close();}
});
