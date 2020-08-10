import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from "../../utils/utils";
import { createLogger } from '../../utils/logger' ;
import * as bld from '../../businessLogic/itemBl' ;

const logger = createLogger("generateUploadUrl");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  :Promise<APIGatewayProxyResult> => {

  logger.debug("generateUploadUrl.handler - in"); 

  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId
  const upldUrl :string = await bld.getSignedUrl(userId, todoId);

  if (upldUrl) {
    logger.debug("generateUploadUrl.handler - out 1");       
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify( {
        "uploadUrl": upldUrl
      })
    }
  } else {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "{}"
    }
  }
}
