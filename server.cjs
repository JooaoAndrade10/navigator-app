
const express = require('express');
const geocodeRouter = require('./routes/geocode');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Servidor Navigator funcionando.' });
});

app.use('/api/geocode', geocodeRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Navigator disponível na porta ${PORT}`);
});
