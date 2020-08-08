import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateOrderRequest } from '../../requests/CreateOrderRequest'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import { Order } from '../../models/Order'

import * as bl from '../../businessLogic/orderBl'

const logger = createLogger("http-order");

export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In createOrder - in");
  const order: CreateOrderRequest = JSON.parse(event.body)
  const uid = getUserId(event);
  order.userId = uid;
  const ret: Order = await bl.createOrder(order);
  logger.debug("In crateTodo - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"order": ret})
  };
}

export const handlerUpdate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In updateOrder - in");
  const order: CreateOrderRequest = JSON.parse(event.body)
  const uid = getUserId(event);
  order.userId = uid;
  const ret: Order = await bl.updateOrder(order);
  logger.debug("In updateOrder - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"order": ret})
  };    
}

export const handlerGetForStore: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("http-order-get - in"); 
  
  //const userId = getUserId(event);
  const storeNum = event.pathParameters.storeNum
  const storeOrderNum = event.pathParameters.orderNum
  const order = await bl.getOrder(storeNum, storeOrderNum);

  logger.debug("http-order-get - out");       
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ orders: order})      
  };
}

export const handlerGetById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("http-order-get - in"); 
  
  //const userId = getUserId(event);
  const orderId = event.pathParameters.orderId
  const order = await bl.getOrderById(orderId);

  logger.debug("http-order-get - out");       
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ orders: order})      
  };
}