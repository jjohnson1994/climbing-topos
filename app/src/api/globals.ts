async function getGlobals() {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/globals`);
  const json = await res.json();

  if (res.status !== 200) {
    throw res.json();
  }

  return json;
}

const GlobalsGetter = () => {
  let globals: {
    cragTags: [],
    gradingSystems: [],
    areaTags: [],
    routeTags: [],
    rockTypes: []
  };

  return async () => {
    if (!globals) {
      globals = await getGlobals();
    }

    return globals;
  }
}

const globalsGetter = GlobalsGetter();

export async function getCragTags() {
  try {
    const globals = await globalsGetter();
    return globals.cragTags;
  } catch(error) {
    throw error;
  }
}
