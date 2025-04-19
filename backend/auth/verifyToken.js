import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization;
//    
    if (!authToken || !authToken.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    try {
        const token = authToken.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;
        req.role = decoded.role;
        next();

    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token is expired" });
        }
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const restrict = (roles) => async (req, res, next) => {
    try {
       
        const userId = req.userId;
        let user = await User.findById(userId) || await Doctor.findById(userId);
        
        if (!user) {
            
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ success: false, message: "You're not authorized" });
        }

        next();  
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
