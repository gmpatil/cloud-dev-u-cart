import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants';
import {User} from '../models/User'

/*
UserTbl:
PK: userNum
GlobalIndex Key: userId: (from 0Auth)
*/

// KeySchema:
// - AttributeName: userNum //TODO make key better hash distributed or move table to RDBMS
//   KeyType: HASH

export class UserTbl {
    constructor( private readonly dbDocClient: AWS.DynamoDB.DocumentClient = createDynamoDBClient(),
        private readonly logger = createLogger("userTbl") ) {}

    async upsertUser(user :User): Promise<User> {
        this.logger.debug("UserTbl.upsertUser - in");
    
        await this.dbDocClient.put({
            TableName: c.TBL_USER,
            Item: user
        }).promise();
    
        this.logger.debug("UserTbl.upsertUser - out");
        return user;
    }

    async getUser(userNum: number): Promise<User> {
        this.logger.debug("UserTbl.getUser - in");
    
        const result = await this.dbDocClient.get({
            TableName: c.TBL_USER,
            Key: {
                userNum: userNum
            }
        }).promise();
    
        this.logger.debug("UserTbl.getUser - out");
        return result.Item as User;
    }
    
    async getUserById(userId: string): Promise<User> {
        this.logger.debug("UserTbl.getUserById - in");
    
        const result = await this.dbDocClient.get({
            TableName: c.TBL_USER,
            IndexName: c.TBL_USER_IDX,
            KeyConditionExpression: 'userId= :userId',
            ExpressionAttributeValues: { ':userId': userId}
        }).promise();
    
        this.logger.debug("UserTbl.getUserById - out");
        return result.Item as User;
    }
    
    async deleteUser(userNum: number): Promise<void> {
        this.logger.debug("UserTbl.deleteUser - in");
    
        await this.dbDocClient.delete({ TableName: c.TBL_USER, Key: { userNum: userNum } }).promise();
    
        this.logger.debug("UserTbl.deleteUser - out");
    }
        
}

function createDynamoDBClient() {
    // const AWSXRay = require('aws-xray-sdk');
    // const AWS = AWSXRay.captureAWS(AWSb)

    let dbDocClient: AWS.DynamoDB.DocumentClient;
    if (process.env.IS_OFFLINE) {
        return dbDocClient = new AWS.DynamoDB.DocumentClient({ 
            region: 'localhost', 
            endpoint: c.LOCAL_DYNAMODB_EP
        });
    } else {
        return dbDocClient = new AWS.DynamoDB.DocumentClient();
    }
}
  