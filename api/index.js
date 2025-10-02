const express = require('express');
const app = express();

// Usar el puerto que asigna la plataforma o 3000 por defecto
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Hola mundo desde Node!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
