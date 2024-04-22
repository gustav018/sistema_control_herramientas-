const mongoose = require('mongoose');

const { HerramientaModel } = require("../models/herramienta.model");

const {ColaboradorModel} = require("../models/colaborador.model");
const {UserModel} = require("../models/user.model");


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
            .populate("colaboradorId", "nombre apellido sucursal -_id")
            .populate("userId", "firstName lastName sucursal _id")
            .then((oneSingleHerramienta) => res.status(200).json({ herramienta: oneSingleHerramienta }))
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
            console.log("BODY",  req.body) //{ status: 'Playing' }

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