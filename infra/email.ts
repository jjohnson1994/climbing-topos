export const email =
  $app.stage === 'dev'
    ? new sst.aws.Email('climbingtopos2Email', {
      sender: 'auth.climbingtopos.com',
    })
    : sst.aws.Email.get('climbingtopos2Email', 'auth.climbingtopos.com');
