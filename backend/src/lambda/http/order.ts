import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateOrderRequest } from '../../requests/CreateOrderRequest'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import { Order, OrderStatus } from '../../models/Order'
import * as bl from '../../businessLogic/orderBl'

import * as c  from '../../utils/constants';
import * as utl from '../../utils/utils';
import { UserProfile } from '../../models/UserProfile'

const logger = createLogger("http-order");

export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In createOrder - in");

  const up: UserProfile = utl.getUserId(event);
  const order: CreateOrderRequest = JSON.parse(event.body)
  order.userId = up.uid;
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
  const up: UserProfile = getUserId(event);
  order.userId = up.uid;
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
  
  const up: UserProfile = utl.getUserId(event);
  if (!utl.actionAllowed(up, c.ACTION.QUERY_ANY_ORDER) ) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"error": "User is not authorized to get another User's info."})
    };  
  }

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
  
  const up: UserProfile = getUserId(event);
  const uid = up.uid;

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
  
  const up: UserProfile = utl.getUserId(event);
  if (!utl.actionAllowed(up, c.ACTION.QUERY_ANY_ORDER) ) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"error": "User is not authorized to query other user's orders."})
    };  
  }

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