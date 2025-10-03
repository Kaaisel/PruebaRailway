// index.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

const app = express();

// CORS: permitir tu frontend de Vercel
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Mejor poner el dominio de tu frontend
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware para JSON
app.use(express.json());

// Pool de conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Middleware para debug de opciones CORS
app.options("*", cors());

// Endpoint de login
app.post("/login", async (req, res) => {
  const { nombre, cont } = req.body;

  // Validar que llegan datos
  if (!nombre || !cont) {
    console.warn("Faltan credenciales:", req.body);
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  // Validar tipo de dato
  const contNumber = Number(cont);
  if (isNaN(contNumber)) {
    console.warn("Contraseña debe ser numérica:", cont);
    return res.status(400).json({ error: "Contraseña inválida" });
  }

  try {
    // Ejecutar query
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE nombre = ? AND cont = ?",
      [nombre, contNumber]
    );

    console.log("Resultado SQL:", rows);

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

// Ruta raíz para pruebas
app.get("/", (req, res) => {
  res.send("Backend corriendo correctamente");
});

// Iniciar servidor localmente (Vercel ignora esto)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
