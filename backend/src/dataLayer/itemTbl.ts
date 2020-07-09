import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants';
import {Item} from '../models/Item'

const logger = createLogger("itemTble");

// const AWSXRay = require('aws-xray-sdk');
// const AWS = AWSXRay.captureAWS(AWSb)

let dbDocClient: AWS.DynamoDB.DocumentClient;
if (process.env.IS_OFFLINE) {
    dbDocClient = new AWS.DynamoDB.DocumentClient({ endpoint: c.LOCAL_DYNAMODB_EP});
} else {
    dbDocClient = new AWS.DynamoDB.DocumentClient();
}

export async function createItem(item :Item): Promise<Item> {
    logger.debug("itemTble.createItem - in");

    await dbDocClient.put({
        TableName: c.TBL_ITEM,
        Item: item
    }).promise();

    logger.debug("itemTble.createItem - out");
    return item;
}

// update everything
export async function updateItem(item :Item): Promise<Item> {
    logger.debug("itemTble.updateItem - in");

    await dbDocClient.put({
        TableName: c.TBL_ITEM,
        Item: item
    }).promise();

    logger.debug("itemTble.updateItem - out");
    return item;
}

export async function getItem(storeNum: number, itemNum: number): Promise<Item> {
    logger.debug("itemTble.getItem - in");

    const result = await dbDocClient.get({
        TableName: c.TBL_ITEM,
        Key: {
            storeNum: storeNum,
            itemNum: itemNum            
        }
    }).promise();

    logger.debug("itemTble.getItem - out");
    return result.Item as Item;
}


export async function deleteItem(storeNum: number, itemNum: number): Promise<void> {
    logger.debug("itemTble.deleteItem - in");

    await dbDocClient.delete({ TableName: c.TBL_ITEM, Key: { storeNum: storeNum, itemNum: itemNum } }).promise();

    logger.debug("itemTble.deleteItem - out");
}