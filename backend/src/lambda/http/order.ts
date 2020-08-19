import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateOrderRequest } from '../../requests/CreateOrderRequest'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import { Order, OrderStatus } from '../../models/Order'
import * as bl from '../../businessLogic/orderBl'

import * as c from '../../utils/constants';
import * as utl from '../../utils/utils';
import { UserProfile } from '../../models/UserProfile'

const logger = createLogger("http-order");

export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In createOrder - in");

  if ((event.pathParameters) && (event.pathParameters.storeNum)) {
    const storeNum: number = Number(event.pathParameters.storeNum);

    const up: UserProfile = utl.getUserId(event);
    const order: CreateOrderRequest = JSON.parse(event.body)
    order.userId = up.uid;
    order.storeNum = storeNum;

    const ret: Order = await bl.createOrder(order);
    logger.debug("In createOrder - out");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "order": ret })
    };
  } else {
    logger.debug("In createOrder 1 - out");
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "missing path parameter storeNum" })
    };
  }
}

export const handlerUpdate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In updateOrder - in");
  if ((event.pathParameters) && (event.pathParameters.orderId) &&
    (event.queryStringParameters) && (event.queryStringParameters.status)) {
    const orderId: string = event.pathParameters.orderId;
    const stsStr: string = event.queryStringParameters.status.toUpperCase() ;

    var os: OrderStatus = stsStr as  OrderStatus;

    if (os) {
      const up: UserProfile = utl.getUserId(event);

      if (utl.actionAllowed(up, c.ACTION.UPDATE_ORDER)) {
        const ret: Order = await bl.updateOrder(orderId, stsStr);
        logger.debug("In createOrder - out");
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify({ "order": ret })
        };
      } else {
        logger.debug("In updateOrder 3 - out");
        return {
          statusCode: 403,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify({ "error": "User does not access to update the order." })
        };

      }
    } else {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ "error": "Invalid value for status. Expectected one of [CREATED, PROCESSING, READY, PICKED_UP, DELIVERED]" })
      };
    }
  } else {
    logger.debug("In updateOrder 2 - out");
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Missing either path parameter orderId and/or queryString parameter status" })
    };
  }
}

export const handlerGetById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("http-order-get - in");

  const up: UserProfile = utl.getUserId(event);
  if (!utl.actionAllowed(up, c.ACTION.QUERY_ANY_ORDER)) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "User is not authorized to get another User's info. or by OrderId" })
    };
  }

  if ((event.pathParameters) && (event.pathParameters.orderId)) {
    const orderId = event.pathParameters.orderId
    const order = await bl.getOrderById(orderId);

    if (order) {
      logger.debug("http-order-get - out");
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ order: order })
      };

    } else {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ "error": "No order for orderId requested found." })
      }
    }
  } else {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Missing path parameter orderId." })
    };

  }
}

export const handlerGetForUser: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("http-order-get-for-user - in");

  if ((event.queryStringParameters) && (event.queryStringParameters.status)) {
    const up: UserProfile = getUserId(event);
    const uid = up.uid;
    const orderStatus: string = event.queryStringParameters.status.toUpperCase();
    var os: OrderStatus = orderStatus as OrderStatus;

    if (os) {
      const orders = await bl.getOrdersByUser(uid, os);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ orders: orders })
      };
    } else {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ "error": "Invalid value for status" })
      };

    }
  } else {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Missing query string  parameter stauts" })
    };
  }

}

export const handlerGetForStore: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("http-order-get-for-store - in");

  const up: UserProfile = utl.getUserId(event);
  if (!utl.actionAllowed(up, c.ACTION.QUERY_ANY_ORDER)) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "User is not authorized to query other user's orders." })
    };
  }

  if ((event.queryStringParameters) && (event.queryStringParameters.status) &&
    (event.pathParameters) && (event.pathParameters.storeNum)) {

    const storeNum: number = Number(event.pathParameters.storeNum);
    const orderStatus: string = event.queryStringParameters.status.toUpperCase();
    var os: OrderStatus = orderStatus  as  OrderStatus;

    if (os) {
      const orders = await bl.getOrdersByStore(storeNum, os);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ orders: orders })
      };
    } else {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ "error": "Invalid value for status. Expectected one of [CREATED, PROCESSING, READY, PICKED_UP, DELIVERED]" })
      };

    }
  } else {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Missing query string  parameter stauts and/or path parameter storeNum" })
    };
  }

}