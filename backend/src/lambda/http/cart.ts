import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateCartRequest } from '../../requests/UpdateCartRequest'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import { Cart } from '../../models/Cart'

import * as bl from '../../businessLogic/cartBl'

const logger = createLogger("http-cart");

export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In createCart - in");
  const cart: UpdateCartRequest = JSON.parse(event.body)
  const uid = getUserId(event);
  const ret: Cart = await bl.createCart(cart, uid);
  logger.debug("In crateTodo - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"cart": ret})
  };
}

export const handlerUpdate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In updateCart - in");
  const cart: UpdateCartRequest = JSON.parse(event.body)
  const uid = getUserId(event);
  const ret: Cart = await bl.updateCart(uid, cart);
  logger.debug("In updateCart - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"cart": ret})
  };    
}

export const handlerGetForStore: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("getTodos.handler - in"); 
  
  const userId = getUserId(event);
  // TODO check for numeric value
  const storeNum:string = event.pathParameters.storeNum
  const cart = await bl.getCart(userId, Number(storeNum));

  logger.debug("getTodos.handler 1 - out");       
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ carts: cart})      
  };
}