import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  wasabiUrl: { type: String, required: true },
  joueurs: [{ type: String }], // Ex: ["j7", "j10"] ou ID Mongo plus tard
  createdAt: { type: Date, default: Date.now }
});

export const Photo = mongoose.model('Photo', photoSchema);
