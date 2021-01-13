import jwt from 'express-jwt';
import jwtAuthz from 'express-jwt-authz';
import jwksRsa from 'jwks-rsa';
import fetch from 'node-fetch';

function checkJwt (
  req,
  res,
  next,
  credentialsRequired = true,
  audience: string,
  domain: string
) {
  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${domain}.well-known/jwks.json`
    }),
    audience,
    issuer: domain,
    algorithms: ['RS256'],
    credentialsRequired
  })(req, res, next);
}

export const requireAuth = (req, res, next) => {
  const domain = `${process.env.AUTH0_DOMAIN}`;
  const audience = `${process.env.AUTH0_AUDIENCE}`;
  const credentialsRequired = true;

  ((_req, _res, _next) => checkJwt(
    _req,
    _req,
    _next,
    credentialsRequired,
    audience,
    domain
  ))(req, res, async () => {
    const { authorization } = req.headers;

    try {
      const userInfoResponse = await fetch(`${process.env.AUTH0_DOMAIN}userinfo`, {
        headers: {
          Authorization: authorization
        }
      })

      if (userInfoResponse.status !== 200) {
        throw new Error("Auth0 did not respond with 200");
      }

      const userInfo = await userInfoResponse.json();

      req.user = userInfo;

      next();
    } catch(error) {
      console.error("Error getting Auth0 user info", error);
      res.status(500).json({ error: true });
    }
  });
}

export const optionalAuth = (req, res, next) => {
  const domain = `${process.env.AUTH0_DOMAIN}`;
  const audience = `${process.env.AUTH0_AUDIENCE}`;
  const credentialsRequired = false;

  checkJwt(
    req,
    res,
    next,
    credentialsRequired,
    audience,
    domain
  );
}
