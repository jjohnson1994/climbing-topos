const AWS = require('aws-sdk');
const fs = require('fs');

// Configure AWS SDK
AWS.config.update({
  region: 'eu-west-1', // Change this to your region
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'production-api2-climbing-topos-2';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const OUTPUT_FILE = `database-backup-${TIMESTAMP}.json`;

async function scanDynamoDB(lastEvaluatedKey = null) {
  const params = {
    TableName: TABLE_NAME,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return data;
  } catch (error) {
    console.error('Error scanning DynamoDB:', error);
    throw error;
  }
}

async function downloadTableToJSON() {
  let allItems = [];
  let lastEvaluatedKey = null;

  do {
    const data = await scanDynamoDB(lastEvaluatedKey);
    if (data.Items) {
      allItems = allItems.concat(data.Items);
    }
    lastEvaluatedKey = data.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  if (allItems.length === 0) {
    console.log('No data found in the table.');
    return;
  }

  // Write to JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allItems, null, 2), 'utf8');
  console.log(`JSON file saved as ${OUTPUT_FILE}`);
}

downloadTableToJSON().catch(console.error);
