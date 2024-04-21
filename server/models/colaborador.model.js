//colaborador.model.js
const mongoose = require('mongoose');

const ColaboradorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "Nombre es requerido"],
        minlength: [3, "El nombre debe tener al menos 3 caracteres"],
    },
    apellido: {
        type: String,
        required: [true, "Apellidos es requerido"],
        minlength: [3, "Los apellidos deben tener al menos 3 caracteres"],
    },
    cedula: {
        type: String,
        minlength: [3, "La cedula debe tener al menos 3 caracteres"],
    },
    email: {
        type: String,
        required: [false, ""],
        minlength: [3, "El email debe tener al menos 3 caracteres"],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email"
        }
    },
    celular: {
        type: String,
        required: [false, ""],
        minlength: [3, "El celular debe tener al menos 3 caracteres"],
    },
    
}, { timestamps: true });

module.exports.ColaboradorModel = mongoose.model('Colaborador', ColaboradorSchema);
