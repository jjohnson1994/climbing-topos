import slugify from "slugify"

export const createSlug = (from: string) => {
  return slugify(from);
}
