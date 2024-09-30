import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { nanoid } from "nanoid";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;

export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const key = nanoid();
    console.log('region', { region })

    const s3Client = new S3Client();
    const command = new PutObjectCommand({
      Bucket: Resource.climbingtopos2Images.name,
      Key: key,
      ContentType: 'image/*',
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        url,
        objectUrl: `https://${Resource.climbingtopos2Images.name}.s3.${region}.amazonaws.com/${key}`
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
