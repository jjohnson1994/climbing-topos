import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { nanoid } from "nanoid";
import { s3 } from "../../../db";

export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const key = nanoid();
    const url = await s3
      .getSignedUrlPromise('putObject', {
        ACL: "public-read",
        Bucket: String(process.env.imageBucketName),
        Key: key,
        ContentType: 'image/*',
        Expires: 300,
      });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        url,
        objectUrl: `https://${process.env.imageBucketName}.s3.eu-west-1.amazonaws.com/${key}`
      })
    }
  } catch (error) {
    console.error("Error generating pre-signed upload url", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: true })
    }
  }
}
