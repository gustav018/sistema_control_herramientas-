const { UserModel } = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { all } = require('../routes/player.routes');
const sendEmail = require("../util/email");
const crypto = require("crypto");
module.exports = {
    register: (req, res) => {
        const user = new UserModel(req.body);
        user
            .save()
            .then(() => {
                res.json({ msg: "success!", user: user });
            })
            .catch(err => res.json(err));
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
                    res.status(400).json({ msg: "invalid login attempt" });
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
                                    })
                                    .json({ msg: "success!", user: userInfo, newJWT });
                            } else {
                                res.status(401).json({ msg: "invalid login attempt" });
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
    forgotPassword: async (req, res) => {
        try {
            const user = await UserModel.findOne({ email: req.body.email });
            if (!user) {
                res.status(404);
                return res.json({ email: { message: "No podemos encontrar al email proporcionado!" } });
            }
            const resetToken = user.createResetPasswordToken();
            await user.save({ validateBeforeSave: false });
            const resetUrl = `http://localhost:5173/resetPassword/${resetToken}`;
            const message = resetUrl;
            await sendEmail({
                email: user.email,
                subject: 'Solicitud de cambio de contraseña',
                message: message
            });
            return res.status(200).json({
                status: "success",
                message: "El link para cambiar su contraseña, fue mandado a su email!"
            });
        } catch (error) {
            return res.status(500).json({ message: "Ha ocurrido un error al mandar el email. Intentelo mas tarde." });
        }
    },
    resetPassword: async (req, res) => {
        const date = Date.now();
        try {
            const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
            const user = await UserModel.findOne({ passwordResetToken: token, passwordResetTokenExpire: { $gt: date } });
            if (!user) {
                return res.status(404).json({ message: "El link es invalido o ha expirado!" });
            }
            user.password = req.body.password;
            user.confirmPassword = req.body.confirmPassword;
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpire = undefined;
            user.passwordChangeAt = Date.now();
            await user.save({ validateBeforeSave: true });
            const newJWT = jwt.sign({ _id: user._id }, process.env.SECRETO, { expiresIn: "60min" });
            res.cookie("userToken", newJWT, process.env.SECRETO, { httpOnly: true });
            res.status(200).json({ message: "logged ok" });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: error });
        }
    }
}

