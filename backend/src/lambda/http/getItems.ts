import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from "../../utils/utils";
import { createLogger } from '../../utils/logger' ;
import * as bld from '../../businessLogic/ucartBl' ;

const logger = createLogger("getTodos");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("getTodos.handler - in"); 
  //Get all TODO items for a current user
  const userId = getUserId(event);

  if (userId) {
    
    const items = await bld.getTodosForUser(userId);

    logger.debug("getTodos.handler 1 - out");       
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ items: items})      
    };
  } else {
    logger.debug("getTodos.handler 2 - out");       
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "{}"      
    };
  }
}
