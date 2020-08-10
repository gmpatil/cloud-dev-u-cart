import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateOrderRequest } from '../../requests/CreateOrderRequest'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import { Order, OrderStatus } from '../../models/Order'

import * as bl from '../../businessLogic/orderBl'

const logger = createLogger("http-order");

export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In createOrder - in");
  const order: CreateOrderRequest = JSON.parse(event.body)
  const uid = getUserId(event);
  order.userId = uid;
  const ret: Order = await bl.createOrder(order);
  logger.debug("In createOrder - out");
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

export const handlerGetForUser: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("http-order-get-for-user - in"); 
  
  const uid = getUserId(event);
  const orderStatus:string  = event.queryStringParameters.status
  var err : string = null;
  var os : OrderStatus = null;

  if (orderStatus == null) {
    err = "status not present or value not one of expectected [CREATED, PROCESSING, READY, PICKED_UP, DELIVERED]" ;
  } else {
    os = OrderStatus[orderStatus.toUpperCase() as keyof typeof OrderStatus];
    // if undefined    
    if (os == null) {
      err = "status not present or value not one of expectected [CREATED, PROCESSING, READY, PICKED_UP, DELIVERED]" ;
    }
  }

  if (err == null) {
    const order = await bl.getOrdersByUser(uid, os);

    logger.debug("http-order-get-for-user - out");       
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ orders: order})      
    };
  } else {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: err      
    };    
  }
  
}

export const handlerGetForStore: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("http-order-get-for-store - in"); 
  
  //const userId = getUserId(event);
  // TODO check for numeric value
  const storeNum:string = event.pathParameters.storeNum
  const orderStatus:string  = event.queryStringParameters.status
  var err : string = null;
  var os : OrderStatus = null;

  if (orderStatus == null) {
    err = "status not present or value not one of expectected [CREATED, PROCESSING, READY, PICKED_UP, DELIVERED]" ;
  } else {
    os = OrderStatus[orderStatus.toUpperCase() as keyof typeof OrderStatus];
    // if undefined    
    if (os == null) {
      err = "status not present or value not one of expectected [CREATED, PROCESSING, READY, PICKED_UP, DELIVERED]" ;
    }
  }

  if (err == null) {
    const order = await bl.getOrdersByStore(Number(storeNum), os);

    logger.debug("http-order-get - out");       
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ orders: order})      
    };
  } else {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: err      
    };    
  }
  
}