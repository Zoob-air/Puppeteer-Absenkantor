const puppeteer = require("puppeteer");
const axios = require("axios");
const FormData = require("form-data");
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
    const cookies = await page.cookies();
    const cookieString = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    console.log(cookies);

    const randomPicture = () => {
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
    };

    const uploadPic = async (name) => {
      try {
        // Path ke file dalam folder 'images' dengan nama '1708686358.png'
        const filePath = path.join(__dirname, "images", name);

        // Membuat FormData
        const formData = new FormData();
        formData.append("webcam", fs.createReadStream(filePath));

        // Mengirim permintaan POST dengan axios
        const response = await axios.post(
          "https://www.vankasystem.net/absensi/ajax/selfi",
          formData,
          {
            headers: {
              ...formData.getHeaders(), // Menambahkan header yang diperlukan oleh FormData
            },
          }
        );

        // Mengembalikan data respons
        return response.data;
      } catch (error) {
        console.error("Error:", error);
        throw error; // Opsional: untuk meneruskan error ke pemanggil fungsi
      }
    };

    // console.log("kambing", await uploadPic(randomPicture()))

    await page.exposeFunction("absensi", async (image, cookieString) => {
      const data = JSON.stringify({
        maps_absen: "-6.1855254, 106.8023633",
        base64image: image, // Kirim gambar dalam format base64
      });
      console.log(data);
      console.log("cookieString", cookieString);
      const response = await fetch(
        "https://www.vankasystem.net/absensi/ajax/absenajaxnew",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/javascript, */*; q=0.01",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Cookie: cookieString,
            Origin: "https://www.vankasystem.net",
            Priority: "u=1, i",
          },
          body: data,
        }
      );
      return response.json(); // Mengembalikan hasil response dalam format JSON
    });

    // Memanggil fungsi absensi dengan path gambar
    const result = await page.evaluate(async (data) => {
      return await window.absensi(data.uploadPic, data.cookieString);
    }, {uploadPic: await uploadPic(randomPicture()),cookieString});

    // console.log(result);

    // await page.screenshot({ path: "screenshot.png" });
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // await browser.close();
  }
})();
