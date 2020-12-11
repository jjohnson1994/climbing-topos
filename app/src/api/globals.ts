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
    areaTags: [],
    cragTags: [],
    gradingSystems: [],
    rockTypes: [],
    routeTags: [],
    routeTypes: [],
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

export async function getAreaTags() {
  try {
    const globals = await globalsGetter();
    return globals.areaTags;
  } catch(error) {
    throw error;
  }
}

export async function getRouteTags() {
  try {
    const globals = await globalsGetter();
    return globals.routeTags;
  } catch (error) {
    throw error;
  }
}

export async function getRouteTypes() {
  try {
    const globals = await globalsGetter();
    return globals.routeTypes;
  } catch (error) {
    throw error;
  }
}

export async function getGradingSystems() {
  try {
    const globals = await globalsGetter();
    return globals.gradingSystems;
  } catch (error) {
    throw error;
  }
}
