// index.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// CORS: permitir solo tu frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Pool de conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ruta raíz para pruebas
app.get("/", (req, res) => {
  res.send("Backend corriendo correctamente");
});

// Endpoint login
app.post("/login", async (req, res) => {
  const { nombre, cont } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE nombre = ? AND cont = ?",
      [nombre, cont]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const usuario = rows[0];
    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      t_usuario: usuario.t_usuario
    });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Export para Vercel
module.exports = app;

// Solo para pruebas locales
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}
