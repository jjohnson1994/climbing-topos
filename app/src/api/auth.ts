import {UserRegisterForm} from "../../../core/types";

export async function signIn(username: string, password: string) {
  return fetch('http://localhost:3000/dev/auth/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password,
    })
  })
    .then(async res => {
      const json = await res.json();
      if (res.status !== 200) {
        throw json;
      } 

      return json;
    });
}

export async function signOut() {
}

export async function signUp(userDetails: UserRegisterForm) {
  return fetch('http://localhost:3000/dev/auth/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userDetails)
  })
    .then(async res => {
      const json = await res.json();
      if (res.status !== 200) {
        throw json;
      } 

      return json;
    });
}

export async function signUpConfirm(username: string, confirmationCode: string) {
  return fetch('http://localhost:3000/dev/auth/sign-up-confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      confirmationCode,
    })
  })
    .then(async res => {
      const json = await res.json();
      if (res.status !== 200) {
        throw json;
      }

      return json;
    });
}
