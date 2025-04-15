const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'climbingtopos2-jamesjohnson-climbingtopos2Table-nkecrsdc';
const OLD_HK = 'user#eu-west-1:6bf18215-12d1-4e4c-b0af-f4480f8dfd12';
const NEW_HK = 'user#wY6_KhHMqkH1aMv-LHeP_';
const SK_PREFIX = 'log';

async function updateMatchingItems() {
  try {
    // Query for all matching items with hk and sk prefix
    const queryParams = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'hk = :hk_val AND begins_with(sk, :sk_prefix)',
      ExpressionAttributeValues: {
        ':hk_val': OLD_HK,
        ':sk_prefix': SK_PREFIX,
      },
    };

    const queryResult = await docClient.send(new QueryCommand(queryParams));

    if (!queryResult.Items || queryResult.Items.length === 0) {
      console.log('No matching items found.');
      return;
    }

    console.log(`Found ${queryResult.Items.length} items. Updating...`);

    // Update each matching item
    for (const item of queryResult.Items) {
      const updateParams = {
        TableName: TABLE_NAME,
        Item: {
          ...item,
          user: {
            ...item.user,
            sub: 'wY6_KhHMqkH1aMv-LHeP_',
          },
          hk: NEW_HK,
        }, // Primary key
      };

      console.log('would create');
      console.log(updateParams);
      await docClient.send(new PutCommand(updateParams));
      console.log(`Updated item with sk: ${item.sk}`);
    }

    console.log('All matching items updated successfully.');
  } catch (error) {
    console.error('Error updating items:', error);
  }
}

// Run the update function
updateMatchingItems();
