const puppeteer = require('puppeteer');


(async () => {
// const browser = await puppeteer.launch({headless: false});
// // Store the endpoint to be able to reconnect to the browser.
// const browserWSEndpoint = browser.wsEndpoint();
// console.log(browserWSEndpoint)

let dor = "ws://127.0.0.1:58496/devtools/browser/1d734032-495f-438b-9ab7-1af5000d83b6"
// Disconnect puppeteer from the browser.
// await browser.disconnect();

// Use the endpoint to reestablish a connection
const browser2 = await puppeteer.connect({dor});
// Close the browser.
// await browser2.close();
const context = browser2.defaultBrowserContext();
  await context.overridePermissions('https://www.vankasystem.net', ['geolocation']);

  const page = await browser2.newPage();

  // Set the viewport to the full screen size
  const { width, height } = await page.evaluate(() => {
    return { width: window.screen.availWidth, height: window.screen.availHeight };
  });
  await page.setViewport({ width, height });

  // Set the geolocation
  await page.setGeolocation({ latitude: 37.7749, longitude: -122.4194 }); // Ganti dengan koordinat yang diinginkan

  // Navigate to the login page
  await page.goto('https://www.vankasystem.net/absensi/login', {waitUntil: 'networkidle0'});

  // Wait for the form to load and fill in the username and password
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', 'Teguh'); // Ganti 'your-username' dengan username yang benar
  await page.type('input[name="password"]', '12345678'); // Ganti 'your-password' dengan password yang benar

  // Click the submit button
  await page.click('button[type="submit"]');

  // Wait for navigation to complete after form submission
  await page.waitForNavigation();

  // Handle the pop-up dialog
//   const popup = await page.waitForSelector('button[type="button"]'); // Sesuaikan selector jika diperlukan
//   if (popup) {
//     await page.click('button[type="button"]'); // Sesuaikan selector jika diperlukan
//   }

  await page.waitForSelector('#btn-absensi');
  await page.click('#btn-absensi');
  // Take a screenshot of the resulting page
  await page.screenshot({ path: 'screenshot.png' });
})();
