const express = require("express");
const UserController = require("../controllers/user.controller");

const UserRouter = express.Router();

/* Recuperacion Password */
UserRouter.post("/forgotPassword", UserController.forgotPassword);
UserRouter.patch("/resetPassword/:token", UserController.resetPassword);

///api/auth
UserRouter.post("/register", UserController.register);
UserRouter.post("/login", UserController.login);
UserRouter.post("/logout", UserController.logout);
UserRouter.get("/correos", UserController.allUsers);

module.exports = UserRouter
