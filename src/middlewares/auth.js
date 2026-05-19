const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;

        const { token } = cookies;
        if (!token) {
            return res.status(401).send("Invalid Token ");
        }
        const decodedMessage = await jwt.verify(token, "SHruu@431");

        const { _id } = decodedMessage;

        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send("User not found");
        }
        req.user = user;
        next();

    }
    catch (err) {
        res.status(400).send("Unauthorized : " + err.message);
    }
}
module.exports = { userAuth }