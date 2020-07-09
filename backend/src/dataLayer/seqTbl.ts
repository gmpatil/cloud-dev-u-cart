import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants'

const logger = createLogger("seqTbl");

// const AWSXRay = require('aws-xray-sdk');
// const AWS = AWSXRay.captureAWS(AWSb)

let dbClient: AWS.DynamoDB.DocumentClient;
if (process.env.IS_OFFLINE) {
    dbClient = new AWS.DynamoDB.DocumentClient({ endpoint: c.LOCAL_DYNAMODB_EP });
} else {
    dbClient = new AWS.DynamoDB.DocumentClient();
}

export async function getNextSeqForEntity(entityName: string): Promise<number> {
    logger.debug("seqTbl.getNextSeqForEntity - in");
    const upd = await dbClient.update({
        TableName: c.TBL_SEQ,
        Key: { entity: entityName},
        UpdateExpression: "set seq = seq + 1",
        ReturnValues: "UPDATED_NEW"
    }).promise();

    logger.debug("seqTbl.getNextSeqForEntity - out");
    return upd.seq;
}
