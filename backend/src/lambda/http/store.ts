import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateStoreRequest } from '../../requests/CreateStoreRequest'
import { createLogger } from '../../utils/logger';
//import { getUserId } from '../../utils/utils';
import { Store } from '../../models/Store'

import * as bl from '../../businessLogic/storeBl'

const logger = createLogger("createStore");

export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In createStore - in");
  const store: CreateStoreRequest = JSON.parse(event.body)
  //const uid = getUserId(event);
  const ret: Store = await bl.createStore(store);
  logger.debug("In createStore - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"store": ret})
  };
}

export const handlerUpdate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In updateStore - in");
  const store: CreateStoreRequest = JSON.parse(event.body)
  //const uid = getUserId(event);
  const ret: Store = await bl.updateStore(store);
  logger.debug("In updateStore - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"store": ret})
  };
}

export const handlerGet: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In getStore - in");
  const storeNum = event.pathParameters.storeNum
  //const uid = getUserId(event);
  const ret: Store = await bl.getStore(storeNum);
  logger.debug("In getStore - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"store": ret})
  };
}

export const handlerGetStores: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In getStores - in");
  //const uid = getUserId(event);
  const ret: Array<Store> = await bl.getStores();
  logger.debug("In getStores - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"stores": ret})
  };
}