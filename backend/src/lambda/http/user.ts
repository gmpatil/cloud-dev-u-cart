import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateUserRequest } from '../../requests/CreateUserRequest'
import { UpdateUserRequest } from '../../requests/UpdateUserRequest'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import { User } from '../../models/User'

import * as bl from '../../businessLogic/userBl'

const logger = createLogger("http-user");

export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In createUser - in");
  const user: CreateUserRequest = JSON.parse(event.body)
  const uid = getUserId(event);
  user.userId = uid;
  const ret: User = await bl.createUser(user);
  logger.debug("In crateTodo - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"user": ret})
  };
}

export const handlerUpdate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In updateUser - in");
  const user: UpdateUserRequest = JSON.parse(event.body)
  const uid = getUserId(event);
  user.userId = uid;
  const ret: User = await bl.updateUser(user);
  logger.debug("In updateUser - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"user": ret})
  };
}

export const handlerGet: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In getUser - in");
  const uid = getUserId(event);
  const ret: User = await bl.getUserId(uid);
  logger.debug("In getUser - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"user": ret})
  };
}

export const handlerGetbyId: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In getUserById - in");
  const uid = event.pathParameters.userId
  const ret: User = await bl.getUserId(uid);
  logger.debug("In getUserById - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"user": ret})
  };
}

export const handlerGetbyNum: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In getUserByNum - in");
  const userNum = event.pathParameters.userNum
  const ret: User = await bl.getUser(userNum);
  logger.debug("In getUserByNum - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"user": ret})
  };
}