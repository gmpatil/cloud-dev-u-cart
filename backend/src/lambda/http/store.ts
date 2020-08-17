import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateStoreRequest } from '../../requests/CreateStoreRequest'
import { createLogger } from '../../utils/logger';
import {UserProfile} from '../../models/UserProfile'
import { Store } from '../../models/Store'
import * as utl from '../../utils/utils';
import * as c from '../../utils/constants';
import * as bl from '../../businessLogic/storeBl'

const logger = createLogger("createStore");

export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In createStore - in");

  const up: UserProfile = utl.getUserId(event);
  if (!utl.actionAllowed(up, c.ACTION.CREATE_UPDATE_STORE) ) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"error": "User is not authorized to create new Store."})
    };  
  }

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
  const up: UserProfile = utl.getUserId(event);
  if (!utl.actionAllowed(up, c.ACTION.CREATE_UPDATE_STORE) ) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"error": "User is not authorized to update Store info."})
    };  
  }  
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
  // TODO check for numeric value
  const storeNum:string = event.pathParameters.storeNum
  //const uid = getUserId(event);
  const ret: Store = await bl.getStore(Number(storeNum));
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

export const handlerGetStores: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent)
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