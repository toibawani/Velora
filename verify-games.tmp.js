const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const errors = [];
  const p = await b.newPage();
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  await p.addInitScript(() => localStorage.setItem('velora_onboarding_done','1'));
  await p.goto('http://localhost:5599/', { waitUntil: 'networkidle' });
  await p.getByText('Create account', { exact: true }).click();
  await p.waitForTimeout(1200);
  await p.getByLabel(/full name/i).fill('Verifier');
  await p.getByLabel(/email/i).fill('v@example.com');
  await p.locator('#register-password').fill('Password123!');
  await p.getByRole('button', { name: /^create account$/i }).last().click();
  await p.waitForTimeout(3000);
  await p.getByText('Games', { exact: true }).first().click();
  await p.waitForTimeout(2000);
  console.log('HUB VISIBLE CARDS:', JSON.stringify((await p.getByRole('button').allInnerTexts()).filter(t=>t.trim()).slice(0,18)));
  await p.screenshot({ path: '/tmp/games-classic.png' });
  for (const t of ['brain','sims']) {
    await p.getByRole('button', { name: new RegExp(t==='brain'?'brain games':'physics simulations','i') }).first().click();
    await p.waitForTimeout(1500);
    await p.screenshot({ path: '/tmp/games-'+t+'.png' });
  }
  console.log('ERRORS:', errors.length ? errors : 'none');
  await b.close();
})();
