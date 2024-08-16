const puppeteer = require("puppeteer");
const crypto = require("crypto");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    product: "chrome",
    headless: false,
    args: ["--start-maximized", "--disable-notifications"],
  });

  const page = await browser.newPage();
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://www.vankasystem.net", [
    "geolocation",
    "camera",
  ]);

  const { width, height } = await page.evaluate(() => {
    return {
      width: window.screen.availWidth,
      height: window.screen.availHeight,
    };
  });
  await page.setViewport({ width, height });
  await page.setGeolocation({ latitude: -6.1745003, longitude: 106.7896633 }); // Ganti dengan koordinat yang diinginkan

  try {
    await page.goto("https://www.vankasystem.net/absensi/login", {
      waitUntil: "networkidle0",
    });

    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', "Teguh");
    await page.type('input[name="password"]', "K@mb1ng1234");
    // await page.type('input[name="username"]', "zubair");
    // await page.type('input[name="password"]', "P@ssw0rdK@mb1ng123");

    // Submit the form and wait for navigation
    await Promise.all([
      page.$eval("form", (form) => form.submit()), // Submit the form
      page.waitForNavigation({ waitUntil: "networkidle0" }), // Wait for navigation
    ]);

    page.on("console", (msg) => console.log(msg.text()));
    const fs = require("fs");

    await page.exposeFunction("absensi", async (imagePath) => {
      // Baca file gambar dan konversikan ke base64 di Node.js
      const image = fs.readFileSync(imagePath);
      const base64Image = image.toString("base64");
      console.log(base64Image)

      const response = await page.evaluate(async (base64Image) => {
        const response = await fetch(
          "https://www.vankasystem.net/absensi/ajax/absenajaxnew",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              maps_absen: "-6.1745003, 106.7896633",
              base64image: base64Image, // Kirim gambar dalam format base64
            }),
          }
        );
        return response.json(); // Mengembalikan hasil response dalam format JSON
      }, base64Image); // Kirimkan base64Image ke dalam page.evaluate

      return response;
    });

    // Memanggil fungsi absensi dengan path gambar
    const result = await page.evaluate(async () => {
      return await window.absensi("C:\\Users\\Mas\\Pictures\\1723173050.png");
    });

    console.log(result);

    // await page.evaluate("console.log('hello'")
    // await page.addScriptTag({ content: `document.querySelector('h1').innerHTML = "Hello, world!"`});

    // await page.evaluate(() => {
    //     $("#capture").click(); // Ini akan memicu event click
    //   });

    // Ensure that the page has navigated before proceeding
    // await page.waitForSelector('#btn-absensi');
    // await page.click('#btn-absensi');

    // // Wait for 2 seconds before interacting with the modal
    // // Wait for 2 seconds using a Promise
    // await new Promise(resolve => setTimeout(resolve, 2000));

    // // Click the capture button inside the modal
    // await page.waitForSelector('#capture');
    // await page.click('#capture');

    await page.screenshot({ path: "screenshot.png" });
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
})();
