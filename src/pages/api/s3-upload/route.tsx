import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

const region = process.env.NEXT_PUBLIC_AWS_REGION;
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("AWS environment variables are missing");
}

const s3ClientConfig: S3ClientConfig = {
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
};

const s3Client = new S3Client(s3ClientConfig);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = formidable({});

  form.parse(req, async (err, _fields, files) => {
    if (err) {
      res.status(500).json({ message: "Error parsing the form data." });
      return;
    }

    if (!files.file) {
      res
        .status(400)
        .json({ message: "File upload error: No file was uploaded." });
      return;
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const fileName = `${file.originalFilename}`;
    const filePath = file.filepath;

    try {
      const data = await fs.promises.readFile(filePath);
      const imageURL = await uploadFileToS3(data, fileName);
      return res
        .status(200)
        .json({ success: true, Name: fileName, URL: imageURL });
    } catch (error) {
      res.status(500).json({ message: "Failed to read the file." });
    }
  });
}

async function uploadFileToS3(file: any, fileName: String) {
  const fileBuffer = file;
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    Key: `${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpeg",
  };
  await s3Client.send(new PutObjectCommand(params));
  const url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
  return url;
}
