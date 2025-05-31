'server-only';

import * as jose from 'jose';
import { Resource } from 'sst';

export const createAccessTokenJwt = async (payload: {
  email: string;
  status: 'verified' | 'pending';
  nickname?: string;
  picture?: string;
}) => {
  const privateKey = await jose.importPKCS8(
    Resource.JwtPrivateKey.value,
    'RS256',
  );

  const newAccessToken = await new jose.SignJWT({
    properties: {
      ...payload,
    },
  })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setIssuer('https://climbingtopos.com')
    .setAudience('climbing-topos-app')
    .setExpirationTime('14d')
    .sign(privateKey);

  return newAccessToken;
};

export const verifyJwt = async (token: string) => {
  const publicKey = await jose.importSPKI(Resource.JwtPublicKey.value, 'RS256');

  const { payload } = await jose.jwtVerify(token, publicKey, {
    algorithms: ['RS256'],
  });

  return payload;
};

createAccessTokenJwt({

})
