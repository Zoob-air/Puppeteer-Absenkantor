const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.vankasystem.net/absensi/login');
  await page.screenshot({ path: 'vanka.png' });

  await browser.close();
})();
