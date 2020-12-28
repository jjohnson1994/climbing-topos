import jwt from 'express-jwt';
import jwtAuthz from 'express-jwt-authz';
import jwksRsa from 'jwks-rsa';

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

  checkJwt(
    req,
    res,
    next,
    credentialsRequired,
    audience,
    domain
  );
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
