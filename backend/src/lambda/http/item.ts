import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateItemRequest } from '../../requests/CreateItemRequest'
import { UpdateItemRequest } from '../../requests/UpdateItemRequest'
import { createLogger } from '../../utils/logger';
import * as utl from '../../utils/utils';
import * as c from '../../utils/constants';

import { Item } from '../../models/Item'
import { UserProfile } from '../../models/UserProfile'

import * as bl from '../../businessLogic/itemBl'

const logger = createLogger("http-item");


export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In handlerCreate item - in");

  const up: UserProfile = utl.getUserId(event);
  if (!utl.actionAllowed(up, c.ACTION.CREATE_UPDATE_ITEM)) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "User is not authorized to create new item." })
    };
  }

  if ((event.pathParameters) && (event.pathParameters.storeNum)) {
    const item: CreateItemRequest = JSON.parse(event.body)
    item.storeNum = Number(event.pathParameters.storeNum);
    const ret: Item = await bl.createItem(item);
    logger.debug(`In handlerCreate item - out ${item}`);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "item": ret })
    };
  } else {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Path parameter StoreNum is missing to create new item." })
    };
  }
}

export const handlerUpdate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In updateItem - in");

  const up: UserProfile = utl.getUserId(event);
  if (!utl.actionAllowed(up, c.ACTION.CREATE_UPDATE_ITEM)) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "User is not authorized to update store item." })
    };
  }

  if ((event.pathParameters) && (event.pathParameters.storeNum) && (event.pathParameters.itemNum)) {

    const item: UpdateItemRequest = JSON.parse(event.body)
    item.storeNum = Number(event.pathParameters.storeNum);

    const ret: Item = await bl.updateItem(item);
    logger.debug("In updateItem - out");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "item": ret })
    };
  } else {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Path parameter StoreNum and/or itemNum is missing to update item." })
    };
  }
}

export const handlerUpdateById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In updateItem - in");

  const up: UserProfile = utl.getUserId(event);
  if (!utl.actionAllowed(up, c.ACTION.CREATE_UPDATE_ITEM)) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "User is not authorized to update store item." })
    };
  }

  if ((event.pathParameters) && (event.pathParameters.itemId)) {

    const item: UpdateItemRequest = JSON.parse(event.body)
    item.itemId = event.pathParameters.itemId;

    const ret: Item = await bl.updateItemById(item);
    logger.debug("In updateItem - out");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "item": ret })
    };
  } else {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Path parameter itemId is missing to update item." })
    };
  }

}

export const handlerGet: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("getTodos.handler - in");

  if ((event.pathParameters) && (event.pathParameters.storeNum) && (event.pathParameters.itemNum)) {
    const itemNum: number = Number(event.pathParameters.itemNum);
    const storeNum: number = Number(event.pathParameters.storeNum);
    const item = await bl.getItem(storeNum, itemNum);

    logger.debug("handlerGet - out");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ item: item })
    };
  } else {
    logger.debug("handlerGet 1 - out");
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Path parameter storeNum and/or itemNum is missing." })
    };
  }
}

export const handlerGetById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("getTodos.handler - in");

  if ((event.pathParameters) && (event.pathParameters.itemId)) {
    const itemId = event.pathParameters.itemId
    const item = await bl.getItemById(itemId);

    logger.debug("handlerGetById 1 - out");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ item: item })
    };
  } else {
    logger.debug("handlerGetById 1 - out");
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Path parameter itemId is missing." })
    };
  }
}

