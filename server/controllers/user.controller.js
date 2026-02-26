const { UserModel } = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { all } = require('../routes/player.routes');

module.exports = {
    register: (req, res) => {
        const user = new UserModel(req.body);
        user
            .save()
            .then(() => {
                res.json({ msg: "success!", user: user });
            })
            .catch(err => {
                console.error("Register Error:", err);
                res.status(400).json(err);
            });
    },
    logout: (req, res) => {
        // clear the cookie from the response
        res.clearCookie("usertoken");
        res.status(200).json({
            message: "You have successfully logged out of our system",
        });
    },
    login: (req, res) => {
        UserModel.findOne({ email: req.body.email })
            .then(user => {
                if (user === null) {
                    res.status(401).json({ msg: "Usuario no encontrado" });
                } else {
                    if (req.body.password === undefined) {
                        res.status(400).json({ msg: "invalid login attempt" });
                    }
                    console.log(req.body)
                    bcrypt
                        .compare(req.body.password, user.password)
                        .then(passwordIsValid => {
                            console.log("passwordIsValid: ", passwordIsValid);
                            if (passwordIsValid) {
                                const userInfo = {
                                    _id: user._id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    email: user.email,
                                    sucursal: user.sucursal
                                };
                                console.log("userInfo: ", userInfo);

                                const secret = process.env.SECRETO || "mysecret";
                                const newJWT = jwt.sign(userInfo, secret)
                                console.log("newJWT: ", newJWT);
                                res
                                    .status(200)
                                    .cookie("usertoken", newJWT, {
                                        httpOnly: true,
                                        expires: new Date(Date.now() + 900000000),
                                        secure: true,       // <--- AGREGAR ESTO
                                        sameSite: 'none',   // <--- AGREGAR ESTO (en minúsculas y entre comillas)
                                    })
                                    .json({ msg: "success!", user: userInfo, newJWT });
                            } else {
                                console.log("Password invalid for user:", user.email);
                                res.status(401).json({ msg: "Contraseña incorrecta" });
                            }
                        })
                        .catch(err => res.status(401).json({ msg: "invalid login attempt", error: err }));
                }
            })
            .catch(err => res.status(401).json({ error: err }));
    },
    allUsers: (req, res) => {
        UserModel.find({}, { email: 1, _id: 1, firstName: 1, lastName: 1 })
            .then((allUsers) => res.status(200).json(allUsers))
            .catch((err) =>
                res.status(400).json({ message: "Something went wrong", error: err })
            );
    },
}