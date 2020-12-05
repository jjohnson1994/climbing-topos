export const getCurrentPosition = async () => {
  return new Promise<Position>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position: Position) => {
        resolve(position);
      },
      (error: PositionError) => {
        reject(error);
      },
      {
        maximumAge: 0,
      }
    );
  });
}
