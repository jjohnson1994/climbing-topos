export async function createCrag(cragDetails: object) {
  const res = await fetch('http://localhost:3000/dev/crags',
    {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(cragDetails)
    })
    .then(res => {
      if (res.status !== 200) {
        throw res;
      }

      return res;
    });

  return res.json();
}

export async function getCrags() {
  const res = await fetch('http://localhost:3000/dev/crags')
    .then(res => {
      if (res.status !== 200) {
        throw res;
      }

      return res;
    });

  return res.json();
}
