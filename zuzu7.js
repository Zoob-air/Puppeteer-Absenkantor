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
    const fs = require("fs");

    await page.exposeFunction("absensi", async (imagePath) => {
      // Baca file gambar dan konversikan ke base64 di Node.js
      const image = fs.readFileSync(imagePath);
      // const base64Image = `data:image/jpeg;base64,${image.toString("base64")}`;
      const base64Image = `
      data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCADwAUADAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDQjtSIGJyD6962m+fVIVru5TlgO4nA2Y45/nUdb9S+ZtWZE8fy7sDHcEZob1uHLzCHgcY25ov1Gk09A8kk5Lcjgn2pptC66kwtm2bshyegxyKzv71+pbbcfIybmLypOATnn05rdykzGxQuU3oVPzE9Ac5FclSDbujaMlsZkSeXKVPy54+lWm2tSZLXQuIFTkfKPStoS5VZCTaZo242gDt7d6zW+po5XVi6Y9u0ZwBknHamxQ91j1i3D5gTnselPRImyTdiO7g3x7SOo4I6UmwiuhlNHjbleOxxmsk7u6KlHTlepFdQ4AJHNbc2tyGIqE4OOvrxScrJpEb9C9aqZGAOCR6msoScTaK0NGGLcgP44z1/z/StuZmsanKrFkR9Sc4qWzG/cVY8npgn2p2W4OXu2H44wck564qW76ExbWpKiAuMjtjr0NTGPKVJ3VidYiTu+9itNjBxu7lqGL5B6H15q4uw7Wd0aNvblgCvfuaqOjMqnc2rHTi+AFye5rdNmMpN6nTaXoTy9Fyf1FXBuOxhK7Lk+iyRLgrx6HsK7o3qLU5W3B3RpeGfA1xrd0oMZ2dSQOKI0emyFPExirneanY2fg3TsFVD4z05rqkqcYnmqU609tDxzxV4hkvXfJ2qTkD8a8qtNydj6GjCKRwt/NuLc5PeuJx7HY5OKMK6LM+e3TFRqtjRS6oz5ogTnPy4654FJETb3KsyOzKMgDv2zWj0RUe7IiFTOT+tYxqcuiLerK0u5cgN1zz61Um5O7F5MrSTEryN3v0ppuxlondMrSAsRlgFPp3qJLm3HGVpHq0FiDblscnr/kVqpJ6MsxrmBt45DEfmah6AVpIQR1y`
      // console.log(base64Image)
      // console.log(typeof(base64Image))

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
