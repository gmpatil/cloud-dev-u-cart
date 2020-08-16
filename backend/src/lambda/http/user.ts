import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateUserRequest } from '../../requests/CreateUserRequest'
import { UpdateUserRequest } from '../../requests/UpdateUserRequest'
import { createLogger } from '../../utils/logger';
import * as c  from '../../utils/constants';
import * as utl from '../../utils/utils';
import { User } from '../../models/User'
import { UserProfile } from '../../models/UserProfile'

import * as bl from '../../businessLogic/userBl'

const logger = createLogger("http-user");

// Even though service returns 401, the SLS Gateway returns 403 the correct code since
// user is authenticated but not authorized.

export const handlerCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In createUser - in");
  const user: CreateUserRequest = JSON.parse(event.body);

//  user.userId = up.uid; // user.userId required field.  
  if ( (!user) || (!user.userId) )  {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"error": "UserId is required."})
    };  
  }

  const up: UserProfile = utl.getUserId(event);

  if ((up) && (user) && (user.userId != up.uid)) {
    if (!utl.actionAllowed(up, c.ACTION.CREATE_UPDATE_ANOTHER_USER) ) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({"error": "User is not authorized to update another User info."})
      };  
    }  
  }

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
  const up: UserProfile = utl.getUserId(event);

  if ((user == null) || (user.userNum == null) || (user.userId == null)) {
    logger.debug("In updateUser - out - error UserNum");
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"error": "userNum of type number and/or UserId of type string is missing."})
    };
  } 

  if ( user.userId != up.uid) {
    if (!utl.actionAllowed(up, c.ACTION.CREATE_UPDATE_ANOTHER_USER) ) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({"error": "User is not authorized to update another User info."})
      };  
    }  
  }

  
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

  let uid:string = null;
  
  const up: UserProfile = utl.getUserId(event);

  if ((event.queryStringParameters) && (event.queryStringParameters.userId)) {
    
    uid = event.queryStringParameters.userId ;
    logger.debug(`In getUser - q param userId: ${uid}, up.uid = ${up.uid}`);
    
    if (uid != up.uid) {
      if (!utl.actionAllowed(up, c.ACTION.GET_ANOTHER_USER) ) {
        return {
          statusCode: 403,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify({"error": "User is not authorized to get another User's info."})
        };  
      }
    }    
  } else {
    logger.debug(`In getUser - no qry param using User's Id: ${up.uid}`);
    uid = up.uid;  
  }

  const ret: User = await bl.getUserById(uid);
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
      statusCode: 204,
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

  const up: UserProfile = utl.getUserId(event);
  if (!utl.actionAllowed(up, c.ACTION.GET_ANOTHER_USER) ) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"error": "User is not authorized to get another User's info."})
    };  
  }
  
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