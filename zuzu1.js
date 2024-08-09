const puppeteer = require('puppeteer');

(async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ headless: false });
  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://www.vankasystem.net', ['geolocation']);

  const page = await browser.newPage();

  // Set the geolocation
  await page.setGeolocation({ latitude: 37.7749, longitude: -122.4194 }); // Ganti dengan koordinat yang diinginkan

  // Navigate to the login page
  await page.goto('https://www.vankasystem.net/absensi/login');

  // Wait for the form to load and fill in the username and password
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', 'Teguh'); // Ganti 'your-username' dengan username yang benar
  await page.type('input[name="password"]', '12345678'); // Ganti 'your-password' dengan password yang benar

  // Click the submit button
  await page.click('button[type="submit"]');

  // Wait for navigation to complete after form submission
  await page.waitForNavigation();

  // Take a screenshot of the resulting page
  await page.screenshot({ path: 'screenshot.png' });

  // Close the browser
//   await browser.close();
})();
