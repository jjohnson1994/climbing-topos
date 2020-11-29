export async function createCrag(cragDetails: object) {
  const res = await fetch('http://localhost:3001/dev/crags',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cragDetails)
    });
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;
}

export async function getCrags() {
  const res = await fetch('http://localhost:3001/dev/crags');
  const json = await res.json();
  if (res.status !== 200) {
    throw json;
  }

  return json;
}
