const fs = require("fs");
const path = require("path");

function getBase64Image(filePath) {
  const image = fs.readFileSync(filePath);
  return Buffer.from(image).toString("base64");
}

const teguh = getBase64Image(path.join(__dirname, "teguh.jpg"));

// Menyimpan string base64 ke dalam file teks
const outputFilePath = path.join(__dirname, "teguh_base64.txt");
fs.writeFileSync(outputFilePath, teguh);

console.log(`Base64 image saved to ${outputFilePath}`);