const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

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
  await page.setGeolocation({ latitude: 37.7749, longitude: -122.4194 });

  try {
    await page.goto("https://www.vankasystem.net/absensi/login", {
      waitUntil: "networkidle0",
    });

    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', "Teguh");
    await page.type('input[name="password"]', "K@mb1ng1234");
    // await page.type('input[name="username"]', "zubair");
    // await page.type('input[name="password"]', "P@ssw0rdK@mb1ng123");

    await Promise.all([
      page.$eval("form", (form) => form.submit()),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    page.on("console", (msg) => console.log(msg.text()));
    await page.exposeFunction("absensi", async () => {
        const response = await fetch(
          "https://www.vankasystem.net/absensi/ajax/absenajaxnew",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              maps_absen: "-6.1745003, 106.7896633",
              // base64image: "kamprt"
            }),
          }
        );
        return response.json(); // Mengembalikan hasil response dalam format JSON
      });

    await page.evaluate(async () => {
      // use window.md5 to compute hashes
      const myString = "PUPPETEER";
      const myHash = await window.absensi();
      console.log("hello world");
      console.log(`md5 of ${myString} is ${JSON.stringify(myHash)}`);
    });

    await page.screenshot({ path: "screenshot.png" });
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // await browser.close();
  }
})();
