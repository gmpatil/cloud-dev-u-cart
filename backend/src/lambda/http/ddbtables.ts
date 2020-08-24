
import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/logger';
import { UserProfile } from '../../models/UserProfile'
import * as utl from '../../utils/utils';
import * as c from '../../utils/constants';

const logger = createLogger("http-ddbtables");
const dbDocClient: AWS.DynamoDB = createDynamoDBClient();



async function truncateTables(): Promise<Array<AWS.AWSError>> {
    const tables: Array<string> = [c.CART_TBL, c.ITEM_TBL, c.ORDER_TBL,
    //c.USER_ACCESS_TBL,
    c.SEQ_TBL, c.STORE_TBL, c.USER_TBL];

    var errors: Array<AWS.AWSError> = [];

    var t: string;
    for (t of tables) {
        var pkNames = [];
        var pkVals = [];

        logger.debug(`Getting description/PK names for table ${t}`);
        try {
            // get PK
            const desc = await dbDocClient.describeTable({ TableName: t }).promise();
            var p;
            for (p of desc.Table.KeySchema) {
                pkNames.push(p.AttributeName);
            }

            // scan
            logger.debug(`Scanning all the PKs for table ${t}`);
            try {
                const rows: AWS.DynamoDB.ScanOutput = await dbDocClient.scan({
                    TableName: t,
                    AttributesToGet: pkNames
                }).promise();

                if (rows.Items.length === 0) {
                    logger.debug(`No records found for table ${t}`);
                } else {
                    logger.debug(` ${rows.Items.length} records found for table ${t}`);
                    pkVals = rows.Items;
                }

                logger.debug(`Deleting all the records (${pkVals.length}) for table ${t}`);
                var pk;
                var i: number = 0;
                for (pk of pkVals) {
                    i++;
                    logger.debug(`Deleting record (${JSON.stringify(pk)}) for table ${t}`);
                    try {
                        const del: AWS.DynamoDB.DeleteItemOutput = await dbDocClient.deleteItem({
                            TableName: t,
                            Key: pk,
                        }).promise();

                        console.log(`Delete: ${JSON.stringify(del)}`);

                        if (i % 10 === 0) {
                            logger.debug(`${t} : deleted ${i} records.`);
                        }
                    } catch (error) {
                        errors.push(error);
                    }

                }

                logger.debug(`Truncated table ${t}`);


            } catch (error) {
                errors.push(error);
            }


        } catch (error) {
            errors.push(error);
        }


    }

    // tables.forEach((t) => {
    //     var pkNames = [];
    //     var pkVals = [];

    //     logger.debug(`Getting description/PK names for table ${t}`);

    //     dbDocClient.describeTable({
    //         TableName: t
    //     }, function (err, desc) {
    //         if (err) {
    //             errors.push(err);
    //         } else {
    //             desc.Table.KeySchema.forEach(function (elem) {
    //                 pkNames.push(elem.AttributeName);
    //             });

    //         }
    //     });

    //     logger.debug(`Scanning all the PKs for table ${t}`);

    //     dbDocClient.scan({
    //         TableName: t,
    //         AttributesToGet: pkNames
    //     }, function (err, data) {
    //         if (err) {
    //             errors.push(err);
    //         }
    //         if (data.Items.length === 0) {
    //             logger.debug(`No records found for table ${t}`);
    //         } else {
    //             logger.debug(` ${data.Items.length} records found for table ${t}`);
    //             pkVals = data.Items;
    //         }
    //     });

    //     logger.debug(`Deleting all the records (${pkVals.length}) for table ${t}`);
    //     pkVals.forEach(function (pk, i) {
    //         if (i % 10 === 0) {
    //             logger.debug(`${t} : deleted ${i} records.`);
    //         }
    //         dbDocClient.deleteItem({
    //             TableName: t,
    //             Key: pk
    //         }, function (err) {
    //             if (err) {
    //                 errors.push(err);
    //             }
    //         });
    //     });

    //     logger.debug(`Truncated table ${t}`);
    // });

    logger.debug(`Truncated all the tables`);

    return errors;
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
    : Promise<APIGatewayProxyResult> => {
    logger.debug("In ddbtables handler - in");

    const up: UserProfile = utl.getUserId(event);
    if (!utl.actionAllowed(up, c.ACTION.CREATE_UPDATE_STORE)) {
        return {
            statusCode: 403,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ "error": "User is not authorized to this operation." })
        };
    }


    logger.debug("In ddbtables - out");
    const errors: Array<AWS.AWSError> = await truncateTables();

    if (errors.length > 0) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ "error": errors })
        };
    } else {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: "msg: successfully truncated all the table records."
        };
    }
}

function createDynamoDBClient() {
    // const AWSXRay = require('aws-xray-sdk');
    // const AWS = AWSXRay.captureAWS(AWSb)

    //let dbDocClient: AWS.DynamoDB.DocumentClient;
    if (process.env.IS_OFFLINE) {
        return new AWS.DynamoDB({
            region: 'localhost',
            endpoint: c.LOCAL_DYNAMODB_EP
        });
    } else {
        return new AWS.DynamoDB();
    }
}
