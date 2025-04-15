const bucket = new sst.aws.Bucket('climbingtopos2Images', {
  access: 'public',
});

export { bucket };
