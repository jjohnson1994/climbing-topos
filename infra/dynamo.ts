const table = new sst.aws.Dynamo("climbingtopos2", {
  fields: {
    hk: 'string',
    sk: 'string',
    model: 'string',
    slug: 'string',
  },
  primaryIndex: { hashKey: "hk", rangeKey: "sk" },
  globalIndexes: {
    gsi1: {
      hashKey: "model",
      rangeKey: "sk",
    },
    gsi2: {
      hashKey: "model",
      rangeKey: "slug",
    },
  },
  stream: 'new-and-old-images',
});

export { table }
