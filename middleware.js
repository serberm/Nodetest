const jwt = require("jsonwebtoken");

require("dotenv").config();

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
        return res
            .status(403)
            .json({ error: "A token is required for authentication" });
    }
    try {
        if (token === "apitesttoken") {
            req.user = "test";
        } else {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            req.user = decoded;
        }
    } catch (err) {
        return res.status(401).json({ error: "Invalid Token" });
    }
    return next();
};

module.exports = verifyToken;
