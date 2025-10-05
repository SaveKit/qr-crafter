// backend/index.js
const express = require('express');
const QRCode = require('qrcode');
const cors = require('cors'); // นำเข้า cors

const app = express();
const port = process.env.PORT || 4000; // ใช้สำหรับตอน Deploy

// ใช้งาน cors middleware
app.use(cors());

app.get('/api/generate', async (req, res) => {
  const { data, size = '256x256' } = req.query; // กำหนดขนาด default

  if (!data) {
    return res.status(400).json({ error: 'Data is required' });
  }

  const qrWidth = parseInt(size.split('x')[0], 10);

  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: isNaN(qrWidth) ? 256 : qrWidth,
      margin: 1,
      errorCorrectionLevel: 'H'
    });

    // ส่งกลับเป็น PNG Buffer
    const imageBuffer = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(imageBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});