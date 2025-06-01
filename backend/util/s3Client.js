import dotenv from "dotenv";
dotenv.config();

// util/s3Client.js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

export const s3 = new S3Client({
  region: "ca-central-1",
  endpoint: "https://s3.ca-central-1.wasabisys.com",
  forcePathStyle: true,
  requestHandler: new NodeHttpHandler({
    maxSockets: 200,           // ← augmente la capacité
    socketTimeout: 10000,      // (optionnel) 10 s
  }),
  credentials: {
    accessKeyId: process.env.WASABI_KEY,
    secretAccessKey: process.env.WASABI_SECRET,
  },
});
