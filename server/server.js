const express = require("express");
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const moment = require('moment');


require('dotenv').config();

app.use(cookieParser());

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:5173', 'http://54.163.165.61', '*'],
  methods: 'GET, POST, PUT, PATCH, DELETE',
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/mongoose.config");

const PlayerRouter = require("./routes/player.routes");
app.use("/api/player", PlayerRouter);

const ColaboradorRouter = require("./routes/colaborador.routes");
app.use("/api/colaborador", ColaboradorRouter);

const HerramientaRouter = require("./routes/herramienta.routes");
app.use("/api/herramienta", HerramientaRouter);

const UserRouter = require("./routes/user.routes");
app.use("/api/auth", UserRouter);

// Configurar transporte de correo con Ethereal Mail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // Usar SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Lista de usuarios (deberías obtener esto de tu base de datos)
const getUsers = async () => {
  const fetch = await import('node-fetch');
  const response = await fetch.default('http://127.0.0.1:8000/api/auth/correos');
  const users = await response.json();
  return users.map(user => ({ id: user._id, email: user.email, name: `${user.firstName} ${user.lastName}` }));
};

// Programar tarea para enviar correos cada x tiempo 
//(por ejemplo, cada minuto ='* * * * *' )
const dia = 29; // Día del mes en que deseas ejecutar la tarea
const hora = '22'; // Hora en formato de 24 horas
const minuto = '27'; // Minuto en que deseas ejecutar la tarea
////`${minuto} ${hora} ${dia} * *`
cron.schedule(`${minuto} ${hora} ${dia} * *`, async () => {
  const users = await getUsers();
  users.forEach(user => {
    // Obtener herramientas del usuario
    import('node-fetch').then(fetch => {
      fetch.default(`http://127.0.0.1:8000/api/herramienta/notificaciones/${user.id}`)
        .then(response => response.json())
        .then(data => {
          // Crear filas de las tablas
          let rowsVencidas = '';
          let rowsProximas = '';

          if (data.herramientasVencidas.length > 0) {
            rowsVencidas = data.herramientasVencidas.map(herramienta =>
              `<tr style="border: 1px solid black;">
                <td style="border: 1px solid black;">${herramienta.identificacion}</td>
                <td style="border: 1px solid black;">${herramienta.descripcion}</td>
                <td style="border: 1px solid black;">${herramienta.calibradoPor}</td>
                <td style="border: 1px solid black;">${herramienta.certificado}</td>
                <td style="border: 1px solid black;">${herramienta.frecuencia}</td>
                <td style="border: 1px solid black;">${moment(herramienta.ultimaCalibracion).format('DD/MM/YYYY')}</td>
                <td style="border: 1px solid black;">${moment(herramienta.proximaCalibracion).format('DD/MM/YYYY')}</td>
              </tr>`
            ).join('');
          } else {
            rowsVencidas = '<tr style="border: 1px solid black;"><td colspan="7">No tienes herramientas vencidas.</td></tr>';
          }

          if (data.herramientasProximasAVencer.length > 0) {
            rowsProximas = data.herramientasProximasAVencer.map(herramienta =>
              `<tr style="border: 1px solid black;">
                <td style="border: 1px solid black;">${herramienta.identificacion}</td>
                <td style="border: 1px solid black;">${herramienta.descripcion}</td>
                <td style="border: 1px solid black;">${herramienta.calibradoPor}</td>
                <td style="border: 1px solid black;">${herramienta.certificado}</td>
                <td style="border: 1px solid black;">${herramienta.frecuencia}</td>
                <td style="border: 1px solid black;">${moment(herramienta.ultimaCalibracion).format('DD/MM/YYYY')}</td>
                <td style="border: 1px solid black;">${moment(herramienta.proximaCalibracion).format('DD/MM/YYYY')}</td>
              </tr>`
            ).join('');
          } else {
            rowsProximas = '<tr style="border: 1px solid black;"><td colspan="7">No tienes herramientas próximas a vencer.</td></tr>';
          }

          // Crear tablas HTML
          const tableVencidas = `
            <table style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr style="border: 1px solid black;">
                  <th style="border: 1px solid black;">Identificación</th>
                  <th style="border: 1px solid black;">Descripción</th>
                  <th style="border: 1px solid black;">Calibrado por</th>
                  <th style="border: 1px solid black;">Certificado</th>
                  <th style="border: 1px solid black;">Frecuencia</th>
                  <th style="border: 1px solid black;">Última calibración</th>
                  <th style="border: 1px solid black;">Próxima calibración</th>
                </tr>
              </thead>
              <tbody>
                ${rowsVencidas}
              </tbody>
            </table>
          `;

          const tableProximas = `
            <table style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr style="border: 1px solid black;">
                  <th style="border: 1px solid black;">Identificación</th>
                  <th style="border: 1px solid black;">Descripción</th>
                  <th style="border: 1px solid black;">Calibrado por</th>
                  <th style="border: 1px solid black;">Certificado</th>
                  <th style="border: 1px solid black;">Frecuencia</th>
                  <th style="border: 1px solid black;">Última calibración</th>
                  <th style="border: 1px solid black;">Próxima calibración</th>
                </tr>
              </thead>
              <tbody>
                ${rowsProximas}
              </tbody>
            </table>
          `;

          // Preparar contenido del correo
          const mailOptions = {
            from: '"Control de Herramientas" <herramientas@gustavofleitas.com>',
            to: user.email,
            subject: "Notificación de herramientas Mensual",
            html: `<strong>Hola ${user.name},</strong><br>Tienes las siguientes herramientas vencidas a tu cargo: ${tableVencidas} <br> Y las siguientes herramientas están próximas a vencer: ${tableProximas}`,
          };

          // Enviar correo
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error al enviar el correo:', error);
            } else {
              console.log('Correo enviado:', info.messageId);
            }
          });
        })
        .catch(error => console.error('Error al obtener herramientas:', error));
    });
  });
});

const PORT = process.env.PUERTO || 8000;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
