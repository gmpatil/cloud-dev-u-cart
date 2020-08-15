import { decode } from 'jsonwebtoken'
import { JwtPayload } from './JwtPayload'
import { UserProfile } from '../models/UserProfile'
import {createLogger} from '../utils/logger'
import {AUTH0_NS_ROLES, AUTH0_NS_GEOIP} from '../utils/constants'
const logger = createLogger("auth.utils")
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): UserProfile {
  const decodedJwt = decode(jwtToken) as JwtPayload
  logger.debug(`JWT: ${JSON.stringify(decodedJwt)}`);

  const up: UserProfile = {
    uid: decodedJwt.sub,
    roles: decodedJwt[AUTH0_NS_ROLES],
    geoip: JSON.stringify(decodedJwt[AUTH0_NS_GEOIP])
  };

  return up ;
}
