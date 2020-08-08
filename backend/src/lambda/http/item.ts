import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateItemRequest } from '../../requests/CreateItemRequest'
import { UpdateItemRequest } from '../../requests/UpdateItemRequest'
import { createLogger } from '../../utils/logger';
//import { getUserId } from '../../utils/utils';
import { Item } from '../../models/Item'

import * as bl from '../../businessLogic/itemBl'

const logger = createLogger("http-item");

export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In createItem - in");
  const item: CreateItemRequest = JSON.parse(event.body)
  //const uid = getUserId(event);
  const ret: Item = await bl.createItem(item);
  logger.debug("In crateTodo - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"item": ret})
  };
}

export const handlerUpdate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In updateItem - in");
  const item: UpdateItemRequest = JSON.parse(event.body)
  //const uid = getUserId(event);
  const ret: Item = await bl.updateItem(item);
  logger.debug("In updateItem - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"item": ret})
  };    
}

export const handlerGet: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("getTodos.handler - in"); 
  
  //const userId = getUserId(event);
  const itemId = event.pathParameters.itemId
  const item = await bl.getItemById(itemId);

  logger.debug("getTodos.handler 1 - out");       
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ items: item})      
  };
}