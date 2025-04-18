import { table } from './dynamo';
import { email } from './email';

export const auth = new sst.aws.Auth('ClimbingToposOpenAuth', {
  issuer: {
    handler: 'packages/api/auth.handler',
    link: [table, email],
  },
  domain:
    $app.stage === 'production'
      ? 'auth.climbingtopos.com'
      : `${$app.stage}.auth.climbingtopos.com`,
});
