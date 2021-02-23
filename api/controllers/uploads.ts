import { nanoid } from "nanoid";
import { s3 } from "../db";

export async function getPreSignedUploadURL(req, res) {
  console.log("access key id", process.env.AWS_ACCESS_KEY_ID)
  try {
    const key = nanoid();
    const url = await s3
      .getSignedUrlPromise('putObject', {
        ACL: "public-read",
        Bucket: "climbing-topos-images",
        Key: key,
        // ContentType: 'image/*',
        Expires: 300,
      });

    res.status(200).send({ success: true, url, objectUrl: `https://climbing-topos-images.s3.eu-west-1.amazonaws.com/${key}` });
  } catch (error) {
    console.error("Error generating pre-signed upload url", error);
    res.status(500).send({ error: true });
  }
}
