'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => 
{
 const params = 
 {
    TableName : process.env.DYNAMODB_TABLE,    
    FilterExpression: "#at = :stuff", 
    ExpressionAttributeNames: 
    {
      "#at": "reservationAt",
    }, 

    ExpressionAttributeValues: 
    {
        ":stuff": event.pathParameters.id,
    }
  }

  // fetch todo from the database 
  dynamoDb.scan(params, onScan);
  
  function onScan(error, result) 
  {
    // handle potential errors
    if (error) 
    {
      console.error(error);
      callback(null, 
      {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(params),
      });
      return;
    }
    else
    {
      // create a response
      const response = 
      {
        statusCode: 200,
        body: JSON.stringify(result),        
      };

      callback(null, response);
    }
  }
};
