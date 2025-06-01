import jwt from 'jsonwebtoken';
import HttpError from '../util/httpError.js';
import dotenv from "dotenv";

dotenv.config();

const checkAdmin = (req, res, next) => {
    try {
        // D'abord vérifier que l'utilisateur est connecté
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed!');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ici on vérifie le rôle
        if (decoded.role.toLowerCase() !== 'admin') {
            const error = new HttpError('Accès refusé: réservé aux administrateurs.', 403);
            return next(error);
        }

        req.userID = decoded.userID;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        const error = new HttpError('Authentication failed!', 401);
        return next(error);
    }
};

export default checkAdmin;