//herramienta.model.js
const mongoose = require('mongoose');
/* Identificación	Descripción	Ubicación	Calibrado por	Certificado N°	
Frecuencia	Última Fecha de Calibración	Próxima Fecha
de Calibración	Responsable */

const HerramientaSchema = new mongoose.Schema({
    identificacion: {
        type: String,
        required: [true, "Identificacion es requerida"],
        minlength: [3, "La identificacion debe tener al menos 3 caracteres"],
    },
    descripcion: {
        type: String,
        required: [true, "La descripción es requerida"],
        minlength: [3, "La descripción debe tener al menos 3 caracteres"],
    },
    ubicacion: {
        type: String,
        required: [false, "La ubicación es requerida"],
        
    },

    calibradoPor: {
        type: String,
        required: [true, "El calibrado por es requerido"],
        minlength: [3, "El calibrado por debe tener al menos 3 caracteres"],
    },

    certificado: {
        type: String,
        required: [true, "El certificado es requerido"],
        minlength: [3, "El certificado debe tener al menos 3 caracteres"],
    },

    frecuencia: {
        type: String,
        required: [true, "La frecuencia es requerida"],
        minlength: [3, "La frecuencia debe tener al menos 3 caracteres"],
    },

    ultimaCalibracion: {
        type: Date,
        required: [true, "La fecha de la calibración es requerida"],
        minlength: [3, "La fecha de la calibración debe tener al menos 3 caracteres"],
    },

    proximaCalibracion: {
        type: Date,
        required: [true, "La fecha de la proxima calibración es requerida"],
        minlength: [3, "La fecha de la proxima calibración debe tener al menos 3 caracteres"],
    },

    colaboradorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Colaborador',
        required: [true, "El colaborador es requerido"],
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
}, { timestamps: true });

module.exports.HerramientaModel = mongoose.model('Herramienta', HerramientaSchema);
