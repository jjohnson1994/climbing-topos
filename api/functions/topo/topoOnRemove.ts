export const handler = async (event) => {
  try {
    return 200;
  } catch(error) {
    console.error("Error topoOnRemove", error);
    throw new Error(error)
  }
}

