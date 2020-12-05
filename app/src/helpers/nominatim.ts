export const reverseLookup = async (latitude: string, longitude: string) => {
  const address = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  ).then((res) => {
      if (res.status !== 200) {
        throw res;
      } else {
        return res;
      }
    });

    return address.json();
}
