import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import sharp from "sharp";
import getRawBody from "raw-body";

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
  switch (req.method) {
    case "POST":
      await handlePost(req, res);
      break;
    case "DELETE":
      await handleDelete(req, res);
      break;
    default:
      res.status(405).json({ message: "Method not allowed." });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
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
      const compressedData = await sharp(data)
        .resize(800, 800, { fit: sharp.fit.inside, withoutEnlargement: true }) 
        .jpeg({ quality: 75 })
        .toBuffer();
      const imageURL = await uploadFileToS3(compressedData, fileName);
      return res
        .status(200)
        .json({ success: true, Name: fileName, URL: imageURL });
    } catch (error) {
      return res.status(500).json({ message: "Failed to read or compress the file." });
    }
  });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    // console.log("HANDLE DELETE");
    const rawBody = await getRawBody(req);
    const body = JSON.parse(rawBody.toString("utf-8"));
    // console.log("BODY: ", body);
    // console.log("URL: ", body['url']);
    const url  = body['url'];

    if (!url) {
      console.log("NO URL");
      res.status(400).json({ message: "No URL provided for deletion." });
      return;
    }

    const key = getKeyFromUrl(url);
    // console.log("KEY: ", key);

    await deleteFileFromS3(key);
    // console.log("DELETED IMAGE");

    return res
      .status(200)
      .json({ success: true, message: "File deleted successfully." });
  } catch (error) {
    console.log("FAIL TO DELETE IMAGE");
    return res
      .status(500)
      .json({ message: "Failed to delete the file.", data: error });
  }
}

async function uploadFileToS3(file: any, fileName: string) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    Key: `${Date.now()}-${fileName}`,
    Body: file,
    ContentType: "image/jpeg",
  };
  await s3Client.send(new PutObjectCommand(params));
  return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
}

function getKeyFromUrl(url: string): string {
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME!;
  const bucketUrl = `https://${bucketName}.s3.amazonaws.com/`;

  if (!url.startsWith(bucketUrl)) {
    console.log("KEY ERROR");
    throw new Error(
      "Invalid URL. It does not belong to the configured S3 bucket."
    );
  }

  return url.substring(bucketUrl.length);
}

async function deleteFileFromS3(key: string) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    Key: key,
  };
  await s3Client.send(new DeleteObjectCommand(params));
}
