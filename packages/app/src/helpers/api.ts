type ResponseInitiator<T> = (
  ...args: any[]
) => Promise<{ status: number; body: T | { error: true } }>;

const isSuccess = <T>(response: {
  status: number;
  body: T | { error: true };
}): response is {
  status: number;
  body: T;
} => {
  if (response.status === 200) {
    return true;
  }
  return false;
};
