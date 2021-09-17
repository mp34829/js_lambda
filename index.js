const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body = JSON.stringify(event);
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  let pathCase = "" + event.httpMethod + " " + event.resource;
  try {
    switch (pathCase) {
      case "DELETE /food/{id}":
        await dynamo
          .delete({
            TableName: "food",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /food/{id}":
        body = await dynamo
          .get({
            TableName: "food",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        break;
      case "GET /food":
        body = await dynamo.scan({ TableName: "food" }).promise();
        break;
      case "PUT /food":
        let requestJSON = event.queryStringParameters;
        await dynamo
          .put({
            TableName: "food",
            Item: {
              id: requestJSON.id,
              name: requestJSON.name,
              calories: requestJSON.calories,
			        carbsg: requestJSON.carbsg,
			        proteing: requestJSON.proteing,
			        fatg: requestJSON.fatg
            }
          })
          .promise();
        body = `Put item ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${pathCase}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};