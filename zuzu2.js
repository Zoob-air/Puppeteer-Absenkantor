const puppeteer = require('puppeteer');

(async () => {
  // Launch a new Firefox browser instance in full-screen mode
//   const wsChromeEndpointurl= "ws://127.0.0.1:9222/devtools/page/7A8DA4B05F6F2C0896A01F47FCAA7163"
//   const wsChromeEndpointurl= "ws://127.0.0.1:9222/devtools/page/03300223FA8C798D398E212176BDC8C0"
  const wsChromeEndpointurl= "127.0.0.1:9222"
  const browser = await puppeteer.launch({
    // product: 'firefox',
    product: 'chrome',
    headless: false,
    // browserWSEndpoint: "ws://127.0.0.1:9222",
    // executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Jalur ke Firefox di Windows
    // executablePath: "C:\\Program Files\\Mozilla Firefox\\firefox.exe", // Jalur ke Firefox di Windows
    args: ['--start-maximized', '--disable-notifications'] // Menambahkan argumen untuk memulai dalam mode layar penuh
  });

  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://www.vankasystem.net', ['geolocation']);

  const page = await browser.newPage();

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
  await page.type('input[name="password"]', 'K@mb1ng1234'); // Ganti 'your-password' dengan password yang benar

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

  // Close the browser
  await browser.close();
})();
