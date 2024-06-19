import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import s3Client from "../config/aws";
// const s3Client = new S3Client({
//   region: process.env.S3_BUCKET_REGION,
// });

class ImageService {
  public static async deleteImage(
    imageUrl: string,
    userId: number
  ): Promise<number | undefined> {
    try {
      const key = `user-profiles/${userId}/${imageUrl.split("/").pop()}`;
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      };
      const command = new DeleteObjectCommand(params);

      const response = await s3Client.send(command);
      return response.$metadata.httpStatusCode;
    } catch (error) {
      console.error("Error deleting object from S3:", error);
      throw error;
    }
  }
}

export default ImageService;
