export async function getPresignedUploadURL() {
  const res = await fetch('http://localhost:3001/dev/uploads/pre-signed-upload-url');
  const json = await res.json();
  if (res.status !== 200) {
    throw json;
  }

  return json;
}
