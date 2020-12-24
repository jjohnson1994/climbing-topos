import { LogRequest } from "../../../core/types";

export async function logRoutes(logs: LogRequest[]) {
  console.log("logging", logs);
  const res = await fetch('http://localhost:3001/dev/logs', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logs),
  });

  const json = await res.json();

  if (res.status !== 200) {
    throw json;
  }

  return json
}
