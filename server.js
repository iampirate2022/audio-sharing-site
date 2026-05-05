const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const audioDir = path.join(__dirname, 'audios');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const AudioInventory = [
  { file: 'palmtree-panic-p-mix-made-with-Voicemod.mp3', originalName: 'Palmtree Panic' },
  { file: 'candyland.mp3', originalName: 'Candyland' },
  { file: 'From The Start - Laufey.mp3', originalName: 'From The Start' },
  { file: 'juju - Wasted Summers.mp3', originalName: 'Wasted Summers' }
];
app.use(express.static(__dirname));
app.use('/audio-files', express.static(audioDir));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rileywebsite.html'));
});

app.get('/audios', (req, res) => {
  const audioFiles = AudioInventory
    .filter((item) => fs.existsSync(path.join(audioDir, item.file)))
    .map((item) => {
      const stats = fs.statSync(path.join(audioDir, item.file));
      return {
        file: item.file,
        url: `/audio-files/${encodeURIComponent(item.file)}`,
        originalName: item.originalName,
        size: stats.size,
        uploadedAt: stats.ctime
      };
    });

  res.json(audioFiles);
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Shared audio website running on http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
});