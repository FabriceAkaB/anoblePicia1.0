import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const dataFile = path.resolve("./data/joueurs.json");

// Charger les joueurs
export const getJoueurs = async (req, res) => {
  try {
    const data = await fs.readFile(dataFile, "utf-8");
    const joueurs = JSON.parse(data);
    res.json(joueurs);
  } catch (err) {
    if (err.code === "ENOENT") return res.json([]); // fichier inexistant
    res.status(500).json({ message: "Erreur de lecture des joueurs" });
  }
};

// Ajouter un joueur
export const addJoueur = async (req, res) => {
  const { label, equipe } = req.body;
  if (!label || !equipe)
    return res.status(400).json({ message: "Label et équipe requis" });

  const joueur = { id: uuidv4(), label, equipe };

  try {
    const data = await fs.readFile(dataFile, "utf-8").catch(() => "[]");
    const joueurs = JSON.parse(data);
    joueurs.push(joueur);
    await fs.writeFile(dataFile, JSON.stringify(joueurs, null, 2));
    res.status(201).json(joueur);
  } catch (err) {
    res.status(500).json({ message: "Erreur d'ajout du joueur" });
  }
};

// Supprimer un joueur
export const deleteJoueur = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await fs.readFile(dataFile, "utf-8").catch(() => "[]");
    let joueurs = JSON.parse(data);
    joueurs = joueurs.filter((j) => j.id !== id);
    await fs.writeFile(dataFile, JSON.stringify(joueurs, null, 2));
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Erreur de suppression" });
  }
};
