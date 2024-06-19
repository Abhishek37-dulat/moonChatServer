import multer from "multer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import s3Client from "./aws";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const uploadToS3 = async (
  file: Express.Multer.File,
  bucketName: string,
  key: string
) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  const result = await upload.done();
  return result;
};

export default upload;
