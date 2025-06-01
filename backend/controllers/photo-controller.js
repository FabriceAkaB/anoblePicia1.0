import { Photo } from "../models/photo.js";
import { listPhotosFromMatch, listMatchs } from "../util/wasabi.js"; // Assurez-vous que ce chemin est correct
import { generatePresignedUrl } from "../util/generatePresignedUrl.js";
import dotenv from 'dotenv';
dotenv.config(); // à faire tout en haut de ton fichier

const getPhotos = async (req, res, next) => {
  try {
    const photos = await Photo.find({});
    if (!photos || photos.length === 0) {
      return res.status(404).json({ message: "Aucune photo trouvée" });
    }
    res.status(200).json({
      photos: photos.map((p) => p.toObject({ getters: true })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération des photos" });
  }
};

const getPhotoById = async (req, res, next) => {
  const photoId = req.params.pid;
  try {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: "Photo non trouvée" });
    }
    res.status(200).json({ photo: photo.toObject({ getters: true }) });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération de la photo" });
  }
};

const createPhoto = async (req, res, next) => {
  const { filename, wasabiUrl, joueurs } = req.body;
  const newPhoto = new Photo({
    filename,
    wasabiUrl,
    joueurs: joueurs ?? []
  });

  try {
    await newPhoto.save();
    res.status(201).json({ message: "Photo créée avec succès", photo: newPhoto.toObject({ getters: true }) });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la création de la photo" });
  }
};

const updatePhoto = async (req, res, next) => {
  const photoId = req.params.pid;
  const photoUpdate = req.body;
  try {
    const updatedPhoto = await Photo.findByIdAndUpdate(photoId, photoUpdate, {
      new: true,
      runValidators: true,
    });
    if (!updatedPhoto) {
      return res.status(404).json({ message: "Photo non trouvée" });
    }
    res.status(200).json({ message: "Photo mise à jour avec succès", photo: updatedPhoto.toObject({ getters: true }) });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la mise à jour de la photo" });
  }
};

const deletePhoto = async (req, res, next) => {
  const photoId = req.params.pid;
  try {
    const deletedPhoto = await Photo.findByIdAndDelete(photoId);
    if (!deletedPhoto) {
      return res.status(404).json({ message: "Photo non trouvée" });
    }
    res.status(200).json({ message: "Photo supprimée avec succès" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la suppression de la photo" });
  }
};



const getPhotosByMatch = async (req, res) => {
  const matchName = req.params.matchName;

  try {
    const keys = await listPhotosFromMatch(matchName);

    if (!keys || keys.length === 0) {
      return res.status(404).json({ message: "Aucune photo trouvée pour ce match." });
    }

    // Génére les liens signés
    const photos = await Promise.all(
      keys.map(async (key) => ({
        filename: key,
        wasabiUrl: await generatePresignedUrl(key),
      }))
    );

    res.status(200).json({ photos });
  } catch (err) {
    console.error("Erreur Wasabi:", err);
    res.status(500).json({ message: "Erreur lors de la récupération des photos depuis Wasabi." });
  }
};

// controllers/photo-controller.js
export const getMatchs = async (req, res) => {
  try {
    const matchs = await listMatchs();     // ← nouvelle implémentation
    if (matchs.length === 0)
      return res.status(404).json({ message: "Aucun match trouvé." });

    res.status(200).json({ matchs });
  } catch (err) {
    console.error("Erreur dans getMatchs:", err);
    res.status(500).json({ message: "Erreur lors de la récupération des matchs" });
  }
};



export default {
  getPhotos,
  getPhotoById,
  createPhoto,
  updatePhoto,
  deletePhoto,
  getPhotosByMatch,
  getMatchs
};
