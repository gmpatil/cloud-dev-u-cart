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

  if ((user == null) || (user.userNum == null) ) {
    logger.debug("In updateUser - out - error UserNum");
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"error": "userNum of type number is missing."})
    };
  } 

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
  // TODO add role check if user is allowed to query other user's info.
  let uid = null;
  
  if ((event.queryStringParameters ! =null) && (event.queryStringParameters.userId != null)) {
    uid = event.pathParameters.userId ;
  }

  if (uid == null) {
    uid = getUserId(event);
  }

  const ret: User = await bl.getUserId(uid);
  logger.debug("In getUser - out");

  if (ret != null) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"user": ret})
    };  
  } else {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"error": "Query before user is created."})
    };  
  }
}

export const handlerGetbyNum: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In getUserByNum - in");
  // TODO check for Number
  let userNum:string = null; 
  if ( (event.pathParameters != null) && (event.pathParameters.userNum != null)){
    userNum = event.pathParameters.userNum;
    const ret: User = await bl.getUser(Number(userNum));
    logger.debug("In getUserByNum - out");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"user": ret})
    };    
  } else {
    logger.debug("In getUserByNum - out -no userNum");
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "{ error: 'Path parameter userNum not found.' }"
    };
  }
}