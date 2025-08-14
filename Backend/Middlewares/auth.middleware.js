const jwt = require("jsonwebtoken")

const Authentication = () => {
    return async (req, res, next) => {
        try {
            const token = await req.headers?.authorization?.split(" ")[1]
            if (!token) {
                return res.status(404).json({ message: "Token not found." })
            }
            const decoded = jwt.verify(token, process.env.SECURED_KEY)
            if (!decoded) {
                return res.status(404).json({ message: "Unauthorized" })
            }
            if (!decoded) {
                return res.json({ message: "Error" });
            }
            req.userID = decoded.userID;
            next();
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ message: "An unexpected error occurred. Please try again later.", error })
        }
    }
}

module.exports = { Authentication }