import jwt from 'jsonwebtoken';
import HttpError from '../util/httpError.js';
import dotenv from "dotenv";

dotenv.config();
const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed!');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userID = decoded.userID;
        next()
    } catch (err) {
        const error = new HttpError('Authentication failed!', 401);
        return next(error)
    }
};


export default checkAuth;