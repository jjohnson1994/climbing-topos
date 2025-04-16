var copy = require('copy-dynamodb-table').copy;

var globalAWSConfig = {};

var sourceAWSConfig = {
  region: 'eu-west-1',
};

var destinationAWSConfig = {
  region: 'eu-west-1',
};

copy(
  {
    config: globalAWSConfig,
    source: {
      tableName: 'production-api2-climbing-topos-2',
      config: sourceAWSConfig,
    },
    destination: {
      tableName: 'climbingtopos2-production-climbingtopos2Table-rtwfonuw',
      config: destinationAWSConfig,
    },
    log: true,
    create: false,
  },
  function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result);
  },
);
