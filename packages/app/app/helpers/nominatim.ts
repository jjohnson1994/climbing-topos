export async function reverseLookup(latitude: string, longitude: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  );

  if (res.status !== 200) {
    throw res;
  }

  const json = await res.json();

  if (json.error) {
    throw json;
  }

  return json
}
