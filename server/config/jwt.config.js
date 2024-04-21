const jwt = require("jsonwebtoken");
const secret = process.env.SECRETO || "mysecret";
module.exports.secret = secret;

module.exports.authenticate = (req, res, next) => {
    jwt.verify(req.cookies.usertoken, secret, (err, payload) => {
        if (err) {
            res.status(401).json({ verified: false, msg: "El token no es válido!" });
        } else {
            next();
        }
    });
}