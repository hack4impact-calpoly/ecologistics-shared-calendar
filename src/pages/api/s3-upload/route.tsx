// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";

// Extend the NextApiRequest to include the file from multer
interface NextApiRequestWithMulter extends NextApiRequest {
  file: Express.Multer.File;
}

// Configure the AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload a file to S3
const uploadFileToS3 = async (file: any, fileName: any): Promise<string> => {
  const { buffer, originalname } = file;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `uploads/${Date.now()}-${originalname}`,
    Body: buffer,
    ContentType: file.mimetype, // Use the file's mimetype
  };

  await s3Client.send(new PutObjectCommand(params));
  return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
};

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

    const [file] = files.file;
    console.log(file);
    const fileName = `${file.originalFilename}`;
    console.log(fileName);
    const imageURL = uploadFileToS3(file, fileName);
    return res.json({ success: true, fileName });
  });
}
