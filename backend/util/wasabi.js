import { promises as fs } from 'node:fs';   // pour fs.readdir, fs.readFile, …
import path from 'node:path';               // si tu utilises path.join ou path.parse
import dotenv from 'dotenv';
dotenv.config(); // à faire tout en haut de ton fichier
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { paginateListObjectsV2 } from "@aws-sdk/client-s3";

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
  console.log("DEBUG bucket =", process.env.WASABI_BUCKET);
  const bucket = process.env.WASABI_BUCKET;
  const keys = [];

  // ---------- paginator prend en charge la boucle "ContinuationToken" ----------
  const paginator = paginateListObjectsV2(
    {                                   // ← config du paginator
      client: wasabi,
      pageSize: 1000,
    },
    {                                   // ← VRAI input S3
      Bucket: bucket,
      Prefix: `${matchName}/`,
    }
  );

  // ---------- on itère sur chaque page ----------
  for await (const page of paginator) {
    if (!page.Contents) continue;
    keys.push(
      ...page.Contents
        .map((o) => o.Key)
        .filter((k) => k.match(/\.(jpg|jpeg|png)$/i)) // garde les images
    );
  }

  return keys;                  // contiendra 3 000+ clés
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
