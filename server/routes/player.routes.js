const express = require("express");

const PlayerController = require("../controllers/player.controller");
const { authenticate } = require("../config/jwt.config");

const PlayerRouter = express.Router();

//api/player/
PlayerRouter.post("/", PlayerController.createNewPlayer);
PlayerRouter.get("/", authenticate, PlayerController.getAllPlayers);
PlayerRouter.get("/:id", authenticate,  PlayerController.getOnePlayerById);
PlayerRouter.put("/:id",authenticate, PlayerController.updateOnePlayerById);
PlayerRouter.patch("/:id/:game",authenticate, PlayerController.updateGamesPlayerById);
PlayerRouter.delete("/:id",authenticate, PlayerController.deleteOnePlayerById);


module.exports = PlayerRouter;