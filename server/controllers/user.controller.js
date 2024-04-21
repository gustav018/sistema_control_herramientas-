const { UserModel } = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    }
}