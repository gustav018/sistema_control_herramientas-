const mongoose = require('mongoose');

const { HerramientaModel } = require("../models/herramienta.model");

const { ColaboradorModel } = require("../models/colaborador.model");
const { UserModel } = require("../models/user.model");
const moment = require('moment'); // Importa la librería moment.js para el manejo de fechas

module.exports = {

    getAllHerramientas: (req, res) => {
        HerramientaModel.find({})
            .populate("colaboradorId", "nombre apellido sucursal -_id")
            .populate("userId", "firstName lastName sucursal _id")
            .then((allHerramientas) => res.status(200).json(allHerramientas))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },


    getOneHerramientaById: (req, res) => {
        HerramientaModel.findOne({ _id: req.params.id })
            .populate("colaboradorId", "nombre apellido sucursal id")
            .populate("userId", "firstName lastName sucursal _id")
            .then((oneSingleHerramienta) => res.status(200).json({ herramienta: oneSingleHerramienta }))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },

    // Nuevo controlador para obtener herramientas vencidas o próximas a vencer
    getHerramientasVencidasOProximas: (req, res) => {
        const today = moment();
        const nextMonth = moment().add(31, 'days');

        HerramientaModel.find({
            userId: req.params.userId,
            proximaCalibracion: { $lte: nextMonth.toDate() }
        })
            .populate("colaboradorId", "nombre apellido sucursal -_id")
            .populate("userId", "firstName lastName sucursal _id")
            .then((herramientas) => {
                const herramientasVencidas = [];
                const herramientasProximasAVencer = [];

                herramientas.forEach(herramienta => {
                    if (moment(herramienta.proximaCalibracion).isBefore(today)) {
                        herramientasVencidas.push(herramienta);
                    } else if (moment(herramienta.proximaCalibracion).isBefore(nextMonth)) {
                        herramientasProximasAVencer.push(herramienta);
                    }
                });

                const todasHerramientas = {
                    herramientasVencidas,
                    herramientasProximasAVencer
                };

                res.status(200).json(todasHerramientas);
            })
            .catch((err) => {
                res.status(400).json({ message: "Something went wrong", error: err });
            });
    },
    getAllHerramientasByUserId: (req, res) => {
        HerramientaModel.find({ userId: req.params.userId })
            .populate("colaboradorId", "nombre apellido sucursal -_id")
            .populate("userId", "firstName lastName sucursal _id")
            .then((allHerramientas) => res.status(200).json(allHerramientas)) // Devuelve directamente el array
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },




    createNewHerramienta: (req, res) => {
        let newHerramientaCreated;
        HerramientaModel.create({
            ...req.body,
            userId: req.body.userId,
            colaboradorId: req.body.colaboradorId,
        })
            .then((newHerramienta) => {
                newHerramientaCreated = newHerramienta;
                console.log("New herramienta created:", newHerramienta);
                return ColaboradorModel.findOneAndUpdate(
                    { _id: req.body.colaboradorId },
                    { $push: { herramientas: newHerramienta._id } },
                    { new: true }
                );
            })
            .then((updatedColaborador) => {
                console.log("Updated colaborador:", updatedColaborador);
                return UserModel.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { herramientas: newHerramientaCreated._id } },
                    { new: true }
                );
            })
            .then((updatedUser) => {
                console.log("Updated user:", updatedUser);
                return HerramientaModel.findOne({ _id: newHerramientaCreated._id }).populate("colaboradorId").populate("userId");
            })
            .then((newHerramienta) => res.status(201).json(newHerramienta))
            .catch((err) =>
                res.status(500).json({ message: "Something went wrong", error: err })
            );
    },







    crearMasivo: async (req, res) => {
        try {
            const herramientasData = req.body;
            if (!Array.isArray(herramientasData) || herramientasData.length === 0) {
                return res.status(400).json({ message: "No se enviaron datos válidos" });
            }

            const herramientasToInsert = [];

            for (let item of herramientasData) {
                let colabId = null;
                if (item.responsable) {
                    const partes = item.responsable.trim().split(" ");
                    const nombre = partes[0] || "Desconocido";
                    const apellido = partes.length > 1 ? partes.slice(1).join(" ") : "S/A";

                    let colaborador = await ColaboradorModel.findOne({
                        nombre: new RegExp('^' + nombre + '$', 'i'),
                        apellido: new RegExp('^' + apellido + '$', 'i')
                    });

                    if (!colaborador) {
                        colaborador = await ColaboradorModel.create({
                            nombre: nombre,
                            apellido: apellido,
                            cedula: "S/N",
                            email: "sin@correo.com",
                            celular: "S/N"
                        });
                    }
                    colabId = colaborador._id;
                }

                herramientasToInsert.push({
                    identificacion: item.identificacion,
                    descripcion: item.descripcion,
                    ubicacion: item.ubicacion || "S/U",
                    calibradoPor: item.calibradoPor || "S/C",
                    certificado: item.certificado || "S/C",
                    frecuencia: item.frecuencia || "S/F",
                    ultimaCalibracion: item.ultimaCalibracion,
                    proximaCalibracion: item.proximaCalibracion,
                    colaboradorId: colabId,
                    userId: item.userId
                });
            }

            const inserted = await HerramientaModel.insertMany(herramientasToInsert);

            for (let h of inserted) {
                if (h.colaboradorId) {
                    await ColaboradorModel.updateOne({ _id: h.colaboradorId }, { $push: { herramientas: h._id } });
                }
                if (h.userId) {
                    await UserModel.updateOne({ _id: h.userId }, { $push: { herramientas: h._id } });
                }
            }

            res.status(201).json({ message: "Herramientas importadas con éxito", count: inserted.length });
        } catch (error) {
            console.error("Error importando:", error);
            res.status(500).json({ message: "Error al importar herramientas", error });
        }
    },

    updateOneHerramientaById: (req, res) => {
        HerramientaModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then((updatedHerramienta) => res.status(200).json({ herramienta: updatedHerramienta }))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
    updateGamesHerramientaById: (req, res) => {
        HerramientaModel.findOne({ _id: req.params.id })
            .then((oneSingleHerramienta) => {

                console.log("GAME:", req.params.game) // 0
                console.log("BODY", req.body) //{ status: 'Playing' }

                oneSingleHerramienta.games[req.params.game] = req.body.status
                oneSingleHerramienta.save()

                return res.status(200).json({ herramienta: oneSingleHerramienta })
            })
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
    deleteOneHerramientaById: (req, res) => {
        HerramientaModel.deleteOne({ _id: req.params.id })
            .then((result) => res.status(200).json({ result: result }))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
}