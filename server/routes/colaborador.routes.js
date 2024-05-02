const express = require("express");

const ColaboradorController = require("../controllers/colaborador.controller");
const { authenticate } = require("../config/jwt.config");

const ColaboradorRouter = express.Router();

//api/colaborador/
ColaboradorRouter.post("/", ColaboradorController.createNewColaborador);
ColaboradorRouter.get("/", authenticate, ColaboradorController.getAllColaboradors);
ColaboradorRouter.get("/:id", authenticate,  ColaboradorController.getOneColaboradorById);
ColaboradorRouter.put("/:id",authenticate, ColaboradorController.updateOneColaboradorById);
///api/colaborador/:id/:game ------->> ****ver*****
ColaboradorRouter.patch("/:id/:game",authenticate, ColaboradorController.updateGamesColaboradorById);
ColaboradorRouter.delete("/:id",authenticate, ColaboradorController.deleteOneColaboradorById);


module.exports = ColaboradorRouter;