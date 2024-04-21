const { ColaboradorModel } = require("../models/colaborador.model");

module.exports = {

    getAllColaboradors: (req, res) => {
        ColaboradorModel.find()
            .then((allColaboradors) => res.status(200).json(allColaboradors))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
    getOneColaboradorById: (req, res) => {
        ColaboradorModel.findOne({ _id: req.params.id })
            .then((oneSingleColaborador) => res.status(200).json({ colaborador: oneSingleColaborador }))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },

    createNewColaborador: (req, res) => {
        ColaboradorModel.create(req.body)
            .then((newlyCreatedColaborador) => res.status(201).json({ colaborador: newlyCreatedColaborador }))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
    updateOneColaboradorById: (req, res) => {
        ColaboradorModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then((updatedColaborador) => res.status(200).json({ colaborador: updatedColaborador }))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
    updateGamesColaboradorById: (req, res) => {
        ColaboradorModel.findOne({ _id: req.params.id })
        .then((oneSingleColaborador) => {

            console.log("GAME:", req.params.game) // 0
            console.log("BODY",  req.body) //{ status: 'Playing' }

            oneSingleColaborador.games[req.params.game] = req.body.status
            oneSingleColaborador.save()

            return res.status(200).json({ colaborador: oneSingleColaborador })
        })
        .catch((err) =>
            res.status(400).json({ message: "Something went wrong", error: err })
        );
    },
    deleteOneColaboradorById: (req, res) => {
        ColaboradorModel.deleteOne({ _id: req.params.id })
            .then((result) => res.status(200).json({ result: result }))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
}