import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateCartRequest } from '../../requests/UpdateCartRequest'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import { Cart } from '../../models/Cart'
import { UserProfile } from '../../models/UserProfile'

import * as bl from '../../businessLogic/cartBl'

const logger = createLogger("http-cart");

export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In createCart - in");

  if ((event.pathParameters) && (event.pathParameters.storeNum)) {
    const storeNum:number = Number(event.pathParameters.storeNum);

    const cart: UpdateCartRequest = JSON.parse(event.body)
    const up: UserProfile = getUserId(event);
    cart.storeNum = storeNum;
    cart.userId = up.uid;

    const ret: Cart = await bl.createCart(cart, up.uid);
    logger.debug("In createCart - out");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "cart": ret })
    };    
  } else {
    logger.debug("In createCart 2 - out");
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Path parameter storeNum is missing." })
    };     
  } 
}

export const handlerUpdate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In updateCart - in");
  if ((event.pathParameters) && (event.pathParameters.storeNum)) {
    const storeNum:number = Number(event.pathParameters.storeNum);

    const cart: UpdateCartRequest = JSON.parse(event.body)
    const up: UserProfile = getUserId(event);

    cart.userId = up.uid ;
    cart.storeNum = storeNum;

    const ret: Cart = await bl.updateCart(up.uid, cart);
    logger.debug("In updateCart - out");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "cart": ret })
    };
  } else {
    logger.debug("In updateCart 2 - out");
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Pathparameter storeNum is missing." })
    };
  }

}

export const handlerGet: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("handlerGet cart - in");

  // TODO check for numeric value
  if ((event.pathParameters) && (event.pathParameters.storeNum)) {
    const storeNum:number = Number(event.pathParameters.storeNum);

    const up: UserProfile = getUserId(event);  
    const cart = await bl.getCart(up.uid, Number(storeNum));

    logger.debug("handlerGet cart  1 - out");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ cart: cart })
    };
  } else {
    logger.debug(" handlerGet 2 - out");
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Pathparameter storeNum is missing." })
    };
  }
}