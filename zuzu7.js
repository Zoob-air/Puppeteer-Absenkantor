const puppeteer = require("puppeteer");

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
    // await page.type('input[name="username"]', "Fikri");
    // await page.type('input[name="password"]', "12345678");
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

    await page.exposeFunction("randomPicture", async () => {
      const mypictures = [
        "1724131171.png",
        "1708052252.png",
        "1708686358.png",
        "1709258931.png",
        "1709518168.png",
        "1709550829.png",
        "1709867274.png",
        "1710729449.png",
        "1710761084.png",
        "1710848697.png",
        "1710987038.png",
      ];
      const randomIndex = Math.floor(Math.random() * mypictures.length);
      return mypictures[randomIndex];
    });

    await page.exposeFunction("absensi", async (image) => {

        const data=JSON.stringify({
          maps_absen: "-6.1745003, 106.7896633",
          base64image: image, // Kirim gambar dalam format base64
        })
        console.log(data)
        const response = await fetch(
          "https://www.vankasystem.net/absensi/ajax/absenajaxnew",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: data,
          }
        );
        return response.json(); // Mengembalikan hasil response dalam format JSON

    });

    // Memanggil fungsi absensi dengan path gambar
    const result = await page.evaluate(async () => {
      return await window.absensi(await window.randomPicture());
    });

    console.log(result);

    await page.screenshot({ path: "screenshot.png" });
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
})();
