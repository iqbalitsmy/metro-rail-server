const jwt = require("jsonwebtoken")
const jwtSecret =
    "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd"


// ------- admin authorization-------
exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "Not authorized" })
            } else {
                if (decodedToken.role !== "admin") {
                    return res.status(401).json({ message: "Not authorized" })
                } else {
                    next()
                }
            }
        })
    } else {
        return res
            .status(401)
            .json({ message: "Not authorized, token not available" })
    }
}


// ------- user authorization-------
exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                console.log(err)
                return res.status(401).json({ message: "Not authorized" })
            } else {
                if ((decodedToken.role === "Basic") || (decodedToken.role === "basic") || (decodedToken.role === "admin")) {
                    req.id = decodedToken.id;
                    next()
                } else {
                    return res.status(401).json({ message: "Not authorized" })
                }
            }
        })
    } else {
        console.log("Not authorized, token not available")
        return res
            .status(401)
            .json({ message: "Not authorized, token not available" })
    }
}