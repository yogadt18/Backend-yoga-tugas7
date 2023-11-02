const express = require('express');
const fs = require('fs');

const app = express();
const port = 9000;

// Middleware untuk membaca data dari form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyediakan halaman HTML untuk input data
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Menangani POST request untuk menyimpan data ke file JSON
app.post('/saveData', (req, res) => {
  const newData = {
    nama: req.body.nama,
    alamat: req.body.alamat,
    pekerjaan: req.body.pekerjaan,
  };

  // Baca data yang sudah ada dari file JSON
  fs.readFile('data.json', (err, data) => {
    if (err) {
      // Jika file tidak ada, buat file baru dengan data awal
      fs.writeFile('data.json', JSON.stringify([newData]), (err) => {
        if (err) {
          console.error('Gagal menyimpan data ke file JSON');
        }
      });
    } else {
      // Jika file sudah ada, tambahkan data baru ke dalamnya
      const existingData = JSON.parse(data);
      existingData.push(newData);

      fs.writeFile('data.json', JSON.stringify(existingData), (err) => {
        if (err) {
          console.error('Gagal menyimpan data ke file JSON');
        }
      });
    }
  });

  res.redirect('/');
});

// Menampilkan data dari file JSON di browser
app.get('/getData', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error('Gagal membaca data dari file JSON');
    } else {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
});

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
