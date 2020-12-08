import fs from "fs";
import { s3 } from "../db";

export async function newImage(imageFile) {
  const fileContent = fs.readFileSync(imageFile.path);

  const params = {
    Bucket: "climbing-topos-images",
    Key: imageFile.filename,
    Body: fileContent,
  };

  const response = await s3.upload(params).promise();

  return response;
}

export async function deleteImage(imageKey: string) {
  const params = {
    Bucket: "climbing-topos-images",
    Key: imageKey
  };

  const response = await s3.deleteObject(params).promise();

  return response;
}
