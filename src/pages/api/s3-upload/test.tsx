import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

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
    const fileName = `${file.originalFilename}`;
    // console.log(fileName);

    const filePath = file.filepath;
    const fs = require("fs");
    fs.readFile(filePath, (error, data) => {
      if (error) {
        return res.status(500).json({ message: "Failed to read the file." });
      }

      // Do something with the data
      //   console.log(data);

      // Respond back with the file name for now
      const imageURL = uploadFileToS3(data, fileName);
      res.json({ success: true, fileName });
    });
  });
}

async function uploadFileToS3(file: any, fileName: String) {
  const fileBuffer = file;
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    Key: `${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ContentType: "/image/jpeg",
  };
  console.log("FILE: ", fileBuffer);
  console.log("FILENAME: ", fileName);
  await s3Client.send(new PutObjectCommand(params));
  return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
}
