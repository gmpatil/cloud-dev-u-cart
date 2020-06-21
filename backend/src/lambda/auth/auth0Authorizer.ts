import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import * as jwtp from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import {SigningKey} from 'jwks-rsa'
//import {JwksClient} from "./jwksClient"; // Do not uncomment and use, 
var jwks1Client = require('jwks-rsa');

// Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// GMPCloudDevTodoApp
const jwksUrl = 'https://dev-529-qpik.auth0.com/.well-known/jwks.json'
const logger = createLogger('auth')

const jwksClnt = jwks1Client({
  strictSsl: true,
  cache: true, // Default Value
  cacheMaxEntries: 5, // Default value
  cacheMaxAge: 600000, // Default value 10m in ms   
  jwksUri: jwksUrl
});

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.debug("auth0Authorizer.handler - in"); 

  try {
    const jwtPld: JwtPayload = await appVerifyToken(event.authorizationToken)   

    logger.debug("auth0Authorizer.handler - out");     
    return {
      principalId: jwtPld.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

/**
 *  From samples at https://www.npmjs.com/package/jsonwebtoken and https://github.com/auth0/node-jwks-rsa
 * 
 * @param hdr : JwtHeader
 * @param cb  
 */
function getKey(hdr :jwtp.JwtHeader, jwtCb ) {
  logger.debug("auth0Authorizer.getKey - in");     

  jwksClnt.getSigningKey(hdr.kid, function(err :Error, key :SigningKey) {
    if (err) {
      jwtCb(err, null);
    } else {
      var signingKey = key.getPublicKey();
      jwtCb(null, signingKey);  
    }
  });

  logger.debug("auth0Authorizer.getKey - out");     
}

function getToken(authHeader: string): string {
  logger.debug("auth0Authorizer.getToken - in");     
    
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  logger.debug("auth0Authorizer.getToken - out");     
  return token
}

export async function appVerifyToken(authHeader: string): Promise<JwtPayload> {
  logger.debug("auth0Authorizer.appVerifyToken - in");    

  const token = getToken(authHeader)

  logger.debug("auth0Authorizer.appVerifyToken - out");    
  // Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/  
  return new Promise<JwtPayload>( function (resolve, reject) {
      logger.debug("auth0Authorizer.appVerifyToken.promise - in");  

      jwtp.verify(token, getKey, (err, decoded : JwtPayload) => {
        logger.debug("auth0Authorizer.appVerifyToken.promise.jwtp.Verify - in");          

        if (err) {
          logger.debug(`appVerifyToken.jwtp.verify.callback/(err): ${err.message}`) ;            
          reject(err);
        } else {
          logger.debug(`appVerifyToken.jwtp.verify.callback/(JwtPayload): ${decoded}`) ;           
          resolve(decoded);
        }        

        // resolve(pl);
        logger.debug("auth0Authorizer.appVerifyToken.promise.jwtp.Verify - in"); 
    });

  });
}

