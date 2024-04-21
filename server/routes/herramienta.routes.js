const express = require("express");

const HerramientaController = require("../controllers/herramienta.controller");
const { authenticate } = require("../config/jwt.config");

const HerramientaRouter = express.Router();

//api/herramienta/
HerramientaRouter.post("/", HerramientaController.createNewHerramienta);
HerramientaRouter.get("/", authenticate, HerramientaController.getAllHerramientas);
HerramientaRouter.get("/:id", authenticate,  HerramientaController.getOneHerramientaById);
HerramientaRouter.put("/:id",authenticate, HerramientaController.updateOneHerramientaById);
HerramientaRouter.patch("/:id/:game",authenticate, HerramientaController.updateGamesHerramientaById);
HerramientaRouter.delete("/:id",authenticate, HerramientaController.deleteOneHerramientaById);


module.exports = HerramientaRouter;