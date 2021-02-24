import AWS from "aws-sdk";

const s3 = new AWS.S3({
  signatureVersion: "v4",
  accessKeyId: process.env.AA,
  secretAccessKey: process.env.BB,
});

export default s3;
