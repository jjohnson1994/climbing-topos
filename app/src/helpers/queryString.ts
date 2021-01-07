export function queryStringFromObject(queryObject: Object) {
  return Object.entries(queryObject).reduce((acc, [key, value]) => {
    if (value !== undefined && typeof value !== "undefined") {
      acc += `${key}=${value}`;
    }

    return acc;
  }, "?");
}
