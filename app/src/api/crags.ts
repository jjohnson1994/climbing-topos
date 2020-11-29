import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Crag } from "../../../core/types";

export async function createCrag(cragDetails: object, token: string) {
  const res = await fetch('http://localhost:3001/dev/crags',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cragDetails)
    });
  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json;
}

export async function getCrags(token: string) {
  const res = await fetch('http://localhost:3001/dev/crags', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  const json = await res.json();
  if (res.status !== 200) {
    throw json;
  }

  return json;
}

export const useCrags = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [crags, setCrags] = useState<Crag[]>([]);

  return {
    crags,
    getCrags: async () => {
      // const token = await getAccessTokenSilently();
      const crags = await getCrags('token');
      setCrags(crags.Items); 
    },
    createCrag: async (cragDetails: object) => {
      // const token = await getAccessTokenSilently();
      createCrag(cragDetails, 'token');
    }
  }
}
