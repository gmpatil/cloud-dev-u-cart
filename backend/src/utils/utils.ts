import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import {UserProfile} from '../models/UserProfile'
import { createLogger } from '../utils/logger' ;
import {ACTION, ROLE} from './constants'
import * as bl from '../businessLogic/userAccessBl'

const logger = createLogger("utils");

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): UserProfile {
  logger.debug("utils.getUserId - in"); 
  const authorization = event.headers.Authorization

  const split = authorization.split(' ')
  const jwtToken = split[1]
  const up : UserProfile = parseUserId(jwtToken);

  const uid: string = up.uid;
  bl.createUserAccess(up);

  logger.debug(`utils.getUserId - out. uid: ${uid}`);   
  return up;
}


function userHasRole(up: UserProfile, role: ROLE):boolean {
  logger.debug(`userHasRole - roles ${up.roles} Role: ${role}`);
  if (role.toUpperCase() == ROLE.ADMIN) {
    if (up.roles) {
      let ret = false;
      for (const elem of up.roles) {
        if (elem.toUpperCase() == role.toUpperCase() ) {
          ret = true;
        }
      };

      return ret;
    } else {
      return false;
    }
  } else {
    return true; // everybody is a user.
  }
}

export function actionAllowed(up: UserProfile, act: ACTION): boolean {

  if ((act == ACTION.CREATE_UPDATE_ANOTHER_USER) 
  || (act == ACTION.GET_ANOTHER_USER)  
  || (act == ACTION.CREATE_UPDATE_ITEM)
  || (act == ACTION.CREATE_UPDATE_STORE)
  || (act == ACTION.QUERY_ANY_ORDER)
  || (act == ACTION.UPDATE_ORDER) ) {

    return userHasRole(up, ROLE.ADMIN);
  } else {
    return true;
  }
}