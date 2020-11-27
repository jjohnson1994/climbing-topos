import 'cross-fetch/polyfill';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';
import { UserRegisterConfirmationForm, UserRegisterForm } from '../../core/types';

const poolData = {
  UserPoolId: "eu-west-1_OGRW5qBaX",
  ClientId: "5b3so0r132t7ovvove8ma4s21q",
};

const userPool = new CognitoUserPool(poolData);

export const signInWithUsernameAndPassword = async (username: string, password: string) => {
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });
  const userData = {
    Username: username,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        resolve({ accessToken, idToken, refreshToken });
      },
      onFailure: (error) => {
        reject(error);
      },
    });
  });
}

export const signUp = ({
  username,
  password,
  givenName,
  familyName,
  email,
  birthdate,
  phoneNumber
}: UserRegisterForm) => {
  return new Promise((resolve, reject) => {
    const attributeList = [];

    attributeList.push(
      new CognitoUserAttribute({
        Name: "given_name",
        Value: givenName,
      })
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name: "family_name",
        Value: familyName,
      })
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name: "email",
        Value: email,
      })
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name: "birthdate",
        Value: birthdate,
      })
    );
    attributeList.push(
      new CognitoUserAttribute({
        Name: "phone_number",
        Value: phoneNumber,
      })
    );

    userPool.signUp(
      username,
      password,
      attributeList,
      null,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

export const signUpConfirm = ({
  username,
  confirmationCode
}: UserRegisterConfirmationForm) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });
    cognitoUser.confirmRegistration(confirmationCode, true, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}
