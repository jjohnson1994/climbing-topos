const bucket = new sst.aws.Bucket('climbingtopos2Images', {
  access: 'cloudfront',
});

const imagesCdn = new sst.aws.Router('climbingtopos2ImagesCdn', {
  routes: { '/*': { bucket } },
});

export { bucket, imagesCdn };
