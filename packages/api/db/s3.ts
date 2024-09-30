import { S3 } from 'aws-sdk';

const s3 = new S3({
  signatureVersion: "v4",
});

export default s3;
