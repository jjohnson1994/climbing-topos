export async function login(token: string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;
}
