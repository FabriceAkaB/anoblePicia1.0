// lib/thumbs.js
import path from "node:path";
import sharp from "sharp";
import {
  HeadObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3 } from "./s3Client.js";

const BUCKET = "anoble-packs";

// Buffer util allié
const streamToBuffer = (stream) =>
  new Promise((res, rej) => {
    const chunks = [];
    stream.on("data", (d) => chunks.push(d));
    stream.on("end", () => res(Buffer.concat(chunks)));
    stream.on("error", rej);
  });

/**
 * @param {string} Key  ex : "matchcf1/IMG_1234.jpg"
 * @returns {string}    ex : "matchcf1/thumbs/IMG_1234.jpg"
 */
export async function ensureThumb(Key) {
  const { dir, base } = path.parse(Key);          // dir = "matchcf1", base = "IMG_1234.jpg"
  const keyThumb = `${dir}/thumbs/${base}`;       // dossier thumbs/

  // 1) Déjà généré ?
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: keyThumb }));
    return keyThumb;                              // rien à faire
  } catch (err) {
    if (err.$metadata?.httpStatusCode !== 404) throw err;
  }

  // 2) Télécharger l’original
  const { Body } = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key })
  );
  const buffer = await streamToBuffer(Body);

  // 3) Transformer avec Sharp
  const thumbBuffer = await sharp(buffer)
    .resize({ width: 400 })
    .jpeg({ quality: 60 })
    .toBuffer();

  // 4) Uploader
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: keyThumb,
      Body: thumbBuffer,
      ContentType: "image/jpeg",
    })
  );

  return keyThumb;
}
