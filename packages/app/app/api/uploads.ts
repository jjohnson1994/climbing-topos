import { API } from "aws-amplify";

export function getPresignedUploadURL() {
  return API.get(
    "climbingtopos2-api",
    '/pre-signed-upload-url',
    {}
  );
}
