const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require("express");
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const moment = require('moment');

// --- MIDDLEWARES ---
app.use(cookieParser());

// Configuración de CORS corregida para producción
const corsOptions = {
  credentials: true,
  origin: true, // Habilitar cualquier origen temporalmente para depuración
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- BASE DE DATOS ---
require("./config/mongoose.config");

// --- RUTAS ---
app.get("/", (req, res) => {
  res.json({
    status: "active",
    message: "Sistema de Control de Herramientas - API activa",
    timestamp: new Date().toISOString(),
    endpoints: {
      players: "/api/player",
      colaboradores: "/api/colaborador",
      herramientas: "/api/herramienta",
      auth: "/api/auth"
    }
  });
});

app.use("/api/player", require("./routes/player.routes"));
app.use("/api/colaborador", require("./routes/colaborador.routes"));
app.use("/api/herramienta", require("./routes/herramienta.routes"));
app.use("/api/auth", require("./routes/user.routes"));

// --- CONFIGURACIÓN DE CORREO ---
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- LÓGICA DE NOTIFICACIONES (CRON) ---

const getUsers = async () => {
  const fetch = await import('node-fetch');
  // Corregido: Uso de BASE_URL con backticks
  const response = await fetch.default(`${process.env.BASE_URL}/api/auth/correos`);
  const users = await response.json();
  return users.map(user => ({ 
    id: user._id, 
    email: user.email, 
    name: `${user.firstName} ${user.lastName}` 
  }));
};

// Programar tarea mensual (Día 29 a las 22:27)
const dia = 29;
const hora = '22';
const minuto = '27';

cron.schedule(`${minuto} ${hora} ${dia} * *`, async () => {
  console.log("Iniciando tarea cron de notificaciones...");
  try {
    const users = await getUsers();
    const fetchModule = await import('node-fetch');

    for (const user of users) {
      // Corregido: Eliminada la IP 127.0.0.1 y reemplazada por BASE_URL
      const response = await fetchModule.default(`${process.env.BASE_URL}/api/herramienta/notificaciones/${user.id}`);
      const data = await response.json();

      // Generar filas para herramientas vencidas
      let rowsVencidas = data.herramientasVencidas.length > 0 
        ? data.herramientasVencidas.map(h => `
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black;">${h.identificacion}</td>
              <td style="border: 1px solid black;">${h.descripcion}</td>
              <td style="border: 1px solid black;">${h.calibradoPor}</td>
              <td style="border: 1px solid black;">${h.certificado}</td>
              <td style="border: 1px solid black;">${h.frecuencia}</td>
              <td style="border: 1px solid black;">${moment(h.ultimaCalibracion).format('DD/MM/YYYY')}</td>
              <td style="border: 1px solid black;">${moment(h.proximaCalibracion).format('DD/MM/YYYY')}</td>
            </tr>`).join('')
        : '<tr style="border: 1px solid black;"><td colspan="7">No tienes herramientas vencidas.</td></tr>';

      // Generar filas para herramientas próximas a vencer
      let rowsProximas = data.herramientasProximasAVencer.length > 0
        ? data.herramientasProximasAVencer.map(h => `
            <tr style="border: 1px solid black;">
              <td style="border: 1px solid black;">${h.identificacion}</td>
              <td style="border: 1px solid black;">${h.descripcion}</td>
              <td style="border: 1px solid black;">${h.calibradoPor}</td>
              <td style="border: 1px solid black;">${h.certificado}</td>
              <td style="border: 1px solid black;">${h.frecuencia}</td>
              <td style="border: 1px solid black;">${moment(h.ultimaCalibracion).format('DD/MM/YYYY')}</td>
              <td style="border: 1px solid black;">${moment(h.proximaCalibracion).format('DD/MM/YYYY')}</td>
            </tr>`).join('')
        : '<tr style="border: 1px solid black;"><td colspan="7">No tienes herramientas próximas a vencer.</td></tr>';

      const tableStyle = 'style="border-collapse: collapse; width: 100%; margin-bottom: 20px;"';
      const headerStyle = 'style="border: 1px solid black; background-color: #f2f2f2;"';

      const htmlContent = `
        <div style="font-family: Arial, sans-serif;">
          <p><strong>Hola ${user.name},</strong></p>
          <p>Este es el resumen mensual de herramientas a tu cargo:</p>
          
          <h3>Herramientas Vencidas</h3>
          <table ${tableStyle}>
            <thead>
              <tr>
                <th ${headerStyle}>ID</th><th ${headerStyle}>Descripción</th><th ${headerStyle}>Calibrado</th>
                <th ${headerStyle}>Certificado</th><th ${headerStyle}>Frec.</th><th ${headerStyle}>Última</th><th ${headerStyle}>Próxima</th>
              </tr>
            </thead>
            <tbody>${rowsVencidas}</tbody>
          </table>

          <h3>Herramientas Próximas a Vencer</h3>
          <table ${tableStyle}>
            <thead>
              <tr>
                <th ${headerStyle}>ID</th><th ${headerStyle}>Descripción</th><th ${headerStyle}>Calibrado</th>
                <th ${headerStyle}>Certificado</th><th ${headerStyle}>Frec.</th><th ${headerStyle}>Última</th><th ${headerStyle}>Próxima</th>
              </tr>
            </thead>
            <tbody>${rowsProximas}</tbody>
          </table>
        </div>`;

      const mailOptions = {
        from: '"Control de Herramientas" <herramientas@gustavofleitas.com>',
        to: user.email,
        subject: "Notificación Mensual de Control de Herramientas",
        html: htmlContent,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(`Error enviando a ${user.email}:`, error);
        else console.log(`Correo enviado a ${user.email}:`, info.messageId);
      });
    }
  } catch (err) {
    console.error("Error en el proceso de cron:", err);
  }
});

// --- LISTENER ---
// Railway inyecta automáticamente la variable PORT
const PORT = process.env.PORT || process.env.PUERTO || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto: ${PORT}`);
  console.log(`🔗 Base URL configurada: ${process.env.BASE_URL}`);
});