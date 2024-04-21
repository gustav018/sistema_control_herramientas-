const { PlayerModel } = require("../models/player.model");

module.exports = {

    getAllPlayers: (req, res) => {
        PlayerModel.find()
            .then((allPlayers) => res.status(200).json(allPlayers))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
    getOnePlayerById: (req, res) => {
        PlayerModel.findOne({ _id: req.params.id })
            .then((oneSinglePlayer) => res.status(200).json({ player: oneSinglePlayer }))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },

    createNewPlayer: (req, res) => {
        PlayerModel.create(req.body)
            .then((newlyCreatedPlayer) => res.status(201).json({ player: newlyCreatedPlayer }))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
    updateOnePlayerById: (req, res) => {
        PlayerModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then((updatedPlayer) => res.status(200).json({ player: updatedPlayer }))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
    updateGamesPlayerById: (req, res) => {
        PlayerModel.findOne({ _id: req.params.id })
        .then((oneSinglePlayer) => {

            console.log("GAME:", req.params.game) // 0
            console.log("BODY",  req.body) //{ status: 'Playing' }

            oneSinglePlayer.games[req.params.game] = req.body.status
            oneSinglePlayer.save()

            return res.status(200).json({ player: oneSinglePlayer })
        })
        .catch((err) =>
            res.status(400).json({ message: "Something went wrong", error: err })
        );
    },
    deleteOnePlayerById: (req, res) => {
        PlayerModel.deleteOne({ _id: req.params.id })
            .then((result) => res.status(200).json({ result: result }))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
}