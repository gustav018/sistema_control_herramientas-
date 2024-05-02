const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs/promises");

const sendEmail = async (options) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            },
        });

        // lee el archivo que contiene el template
        const templateFile = await fs.readFile("./view/email.hbs", "utf-8");
        const template = handlebars.compile(templateFile);

        // compila el template con las opciones que se le dieron
        const html = template(options);

        const emailOptions = {
            from: 'Control de Calibraciones',
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: html //Aqui se manda el template
        };

        // Send the email
        await transporter.sendMail(emailOptions);

        console.log("El Email se ha enviado correctamente");
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw error;
    }
};

module.exports = sendEmail;