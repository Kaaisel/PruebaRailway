// index.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors({ origin: "*" })); // Ajusta a tu Angular si quieres seguridad
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Endpoint login
app.post("/login", async (req, res) => {
  const { nombre, cont } = req.body; // nombre y contraseña enviados desde Angular

  if (!nombre || !cont) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE nombre = ? AND cont = ?",
      [nombre, cont]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Usuario encontrado
    const usuario = rows[0];
    // Devuelve los datos relevantes
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



app.get("/", (req, res) => {
  res.send("Backend corriendo correctamente");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
