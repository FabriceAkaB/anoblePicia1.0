import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const client = new S3Client({
  region: "ca-central-1",
  endpoint: "https://s3.ca-central-1.wasabisys.com",
  credentials: {
    accessKeyId: process.env.WASABI_KEY,
    secretAccessKey: process.env.WASABI_SECRET,
  },
});

export const generatePresignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.WASABI_BUCKET,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn: 3600 }); // expire en 1h
};
