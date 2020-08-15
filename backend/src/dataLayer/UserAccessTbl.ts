import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants';
import {UserProfile} from '../models/UserProfile'

/*
UserProfileAccessTbl:
PK: ts, uid
GlobalIndex Key: ts, userId: (from 0Auth)
*/

export class UserAccessTbl {
    constructor( private readonly dbDocClient: AWS.DynamoDB.DocumentClient = createDynamoDBClient(),
        private readonly logger = createLogger("userAccessTbl") ) {}

    async insertUserAccess(user :UserProfile): Promise<UserProfile> {
        this.logger.debug("UserProfileAccessTbl.upsertUserProfile - in");
    
        user.ts = new Date().toISOString() ;
        
        await this.dbDocClient.put({
            TableName: c.USER_ACCESS_TBL,
            Item: user
        }).promise();
    
        this.logger.debug("UserProfileAccessTbl.upsertUserProfile - out");
        return user;
    }   
}

function createDynamoDBClient() {
    // const AWSXRay = require('aws-xray-sdk');
    // const AWS = AWSXRay.captureAWS(AWSb)

    let dbDocClient: AWS.DynamoDB.DocumentClient = null;
    if (process.env.IS_OFFLINE) {
        dbDocClient = new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: c.LOCAL_DYNAMODB_EP
        });
    } else {
        dbDocClient = new AWS.DynamoDB.DocumentClient();
    }

    return dbDocClient;
}
  