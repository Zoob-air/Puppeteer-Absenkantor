const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware untuk parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/absensi/ajax/absenajaxnew', (req, res) => {
  const { maps_absen, base64image } = req.body;

  console.log('Received data:');
  console.log('Maps Absen:', maps_absen);
  console.log('Base64 Image:', base64image);

  // Kirim respons kembali ke klien
  res.json({
    status: 'success',
    message: 'Data received successfully',
    receivedData: {
      maps_absen,
      base64image
    }
  });
});

// Menjalankan server pada port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
