export async function getPresignedUploadURL(token: string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/uploads/pre-signed-upload-url`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const json = await res.json();
  if (res.status !== 200) {
    throw json;
  }

  return json;
}
