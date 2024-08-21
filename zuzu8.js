const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Path ke file dalam folder 'images' dengan nama '1708686358.png'
const filePath = path.join(__dirname, 'images', '1708686358.png');

// Membuat FormData
const formData = new FormData();
formData.append('webcam', fs.createReadStream(filePath));

// Mengirim permintaan POST dengan axios
axios.post('https://www.vankasystem.net/absensi/ajax/selfi', formData, {
    headers: {
        ...formData.getHeaders() // Menambahkan header yang diperlukan oleh FormData
    }
})
.then(response => {
    console.log('Success:', response.data);
})
.catch(error => {
    console.error('Error:', error);
});
