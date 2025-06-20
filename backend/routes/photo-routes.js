import express from "express";
import photosController from "../controllers/photo-controller.js";

const router = express.Router();

router.get("/matchs", photosController.getMatchs);
router.post("/match/:matchName/init", photosController.initMatchJson);
router.get("/match/:matchName", photosController.getPhotosByMatch);
router.post("/update", photosController.updatePhotoAssign);
router.get("/", photosController.getPhotos);
router.get("/:pid", photosController.getPhotoById);
router.post("/", photosController.createPhoto);
router.patch("/:pid", photosController.updatePhoto);
router.delete("/:pid", photosController.deletePhoto);

export default router;
