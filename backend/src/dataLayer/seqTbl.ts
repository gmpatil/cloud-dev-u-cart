import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants'

const logger = createLogger("todoDb");

// const AWSXRay = require('aws-xray-sdk');
// const AWS = AWSXRay.captureAWS(AWSb)

const tbl = c.TBL_SEQ

let dbClient: AWS.DynamoDB.DocumentClient;
if (process.env.IS_OFFLINE) {
    dbClient = new AWS.DynamoDB.DocumentClient({ endpoint: c.LOCAL_DYNAMODB_EP });
} else {
    dbClient = new AWS.DynamoDB.DocumentClient();
}

export async function getNextSeq(entityName: string): Promise<number> {
    logger.debug("todoDb.getNextSeq - in");
    const upd = await dbClient.update({
        TableName: tbl,
        Key: { entity: tbl},
        UpdateExpression: "set seq = seq + 1",
        ReturnValues: "UPDATED_NEW"
    }).promise();

    logger.debug("todoDb.updateTodo - out");
    return upd.seq;
}
