// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, "Secret_Key-7973", (error, decoded) => {
        if (error) {
            return res.status(403).json({ error: "Forbidden: Invalid token" });
        }

        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware or route
    });
};