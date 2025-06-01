import { promises as fs } from 'node:fs';   // pour fs.readdir, fs.readFile, …
import path from 'node:path';               // si tu utilises path.join ou path.parse
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config(); // à faire tout en haut de ton fichier

const wasabi = new S3Client({
  region: "ca-central-1",
  endpoint: "https://s3.ca-central-1.wasabisys.com",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.WASABI_KEY,
    secretAccessKey: process.env.WASABI_SECRET,
  },
});

export const listPhotosFromMatch = async (matchName) => {
  const bucket = process.env.WASABI_BUCKET;

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: `${matchName}/`,
  });

  const response = await wasabi.send(command);

  if (!response.Contents) return [];

  return response.Contents
    .map((obj) => obj.Key)
    .filter((key) => key.match(/\.(jpg|jpeg|png)$/i)); // garde seulement les images
};

// Exemple de log plus bavard
export const listMatchs = async () => {
  const bucket = process.env.WASABI_BUCKET;

  // On demande à S3/Wasabi de regrouper tout ce qui est avant le 1er “/”
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Delimiter: "/",          // ★ clé : retourne CommonPrefixes
  });

  const { CommonPrefixes = [] } = await wasabi.send(command);

  // Chaque CommonPrefix ressemble à "2024-05-31_MTLvsTOR/"
  return CommonPrefixes.map((cp) => cp.Prefix.replace(/\/$/, ""));
};
