import { API } from "aws-amplify";

export function getPresignedUploadURL() {
  return API.get(
    "climbing-topos",
    '/pre-signed-upload-url',
    {}
  );
}
