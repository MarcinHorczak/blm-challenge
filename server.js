const express = require('express');
const path = require('path');
const port = process.env.PORT || 80;
const app = express();

const dir = path.join(__dirname, 'build');
app.use(express.static(dir));

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(dir, 'index.html'));
});

app.listen(port);