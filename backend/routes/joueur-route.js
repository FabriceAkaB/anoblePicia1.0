import express from "express";
import {
    getJoueurs,
    addJoueur,
    deleteJoueur,
} from "../controllers/joueursController.js";

const router = express.Router();

router.get("/", getJoueurs);
router.post("/", addJoueur);
router.delete("/:id", deleteJoueur);

export default router;
