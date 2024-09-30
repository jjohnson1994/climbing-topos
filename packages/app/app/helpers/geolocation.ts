export const getCurrentPosition = async () => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        resolve(position);
      },
      (error: GeolocationPositionError) => {
        reject(error);
      },
      {
        maximumAge: 0,
      }
    );
  });
}
