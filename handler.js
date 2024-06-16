const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.processS3Object = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    console.log('code started');
    const data = await s3.getObject(params).promise();
    console.log('data from s3', data);
    //Data is recived in form of buffer so convert into string to able to read it.
    let json = (data.Body).toString('utf-8');
    console.log('Data from s3', json);
    //Parse it to json object to manipulate/read
    const convertedArray = JSON.parse(json);
    console.log('Parsed Json', json);
    // Process the JSON data and prepare for batch operations
    const items = convertedArray; 

    console.log(`Processing ${items.length} items.`);

    const chunks = [];
    while (items.length > 0) {
      let chunk = items.splice(0, 1000); //Splice it into chunks and inserting it into dynamodb
      console.log('Batches', chunk);
      const putRequests = chunk.map(item => ({
        PutRequest: {
          Item: item,
        },
      }));

      const batchParams = {
        RequestItems: {
          'VersionStore': putRequests,
        },
      };
      console.log('Batch Params', batchParams);
      await dynamoDB.batchWrite(batchParams).promise();

      console.log(`Inserted ${chunk.length} items into DynamoDB.`);
      
    }
    return {
      statusCode: 200,
      body: JSON.stringify('Data inserted successfully'),
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify('Error inserting data'),
    };
  }
};
