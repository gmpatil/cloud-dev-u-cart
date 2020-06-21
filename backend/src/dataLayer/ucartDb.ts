import * as AWS from 'aws-sdk';
import { TodoItem } from '../models/Item';
import { TodoUpdate } from '../models/ItemUpdate';
import { createLogger } from '../utils/logger';

const logger = createLogger("todoDb");

// const AWSXRay = require('aws-xray-sdk');
// const AWS = AWSXRay.captureAWS(AWSb)

const tbl = process.env.TODOS_TABLE
const idx = process.env.TODOS_USR_INDEX

let dbDocClient: AWS.DynamoDB.DocumentClient;
if (process.env.IS_OFFLINE) {
    dbDocClient = new AWS.DynamoDB.DocumentClient({ endpoint: 'http://localhost:8000' });
} else {
    dbDocClient = new AWS.DynamoDB.DocumentClient();
}

export async function createTodo(todoDb: TodoItem): Promise<TodoItem> {
    logger.debug("todoDb.createTodo - in");

    await dbDocClient.put({
        TableName: tbl,
        Item: todoDb
    }).promise();

    logger.debug("todoDb.createTodo - out");
    return todoDb;
}

export async function getTodo(userId: string, todoId: string): Promise<TodoItem> {
    logger.debug("todoDb.getTodo - in");

    const result = await dbDocClient.get({
        TableName: tbl,
        Key: {
            userId: userId,
            todoId: todoId
        }
    }).promise();

    logger.debug("todoDb.getTodo - out");
    return result.Item as TodoItem;
}

export async function getTodoByUser(userId: string): Promise<TodoItem[]> {
    logger.debug("todoDb.getTodoByUser - in");

    const result = await dbDocClient.query({
        TableName: tbl,
        IndexName: idx,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId }
    }).promise();

    logger.debug("todoDb.getTodoByUser - out");
    return result.Items as TodoItem[];
}

export async function updateTodo(userId: string, todoId: string, upd: TodoUpdate): Promise<TodoUpdate> {
    logger.debug("todoDb.updateTodo - in");

    // Name is reserved word in DynamoDB.
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
    await dbDocClient.update({
        TableName: tbl,
        Key: { userId: userId, todoId: todoId },
        UpdateExpression: "set #name=:nm, dueDate=:dd, done=:dn",
        ExpressionAttributeValues: {
            ":nm": upd.name,
            ":dd": upd.dueDate,
            ":dn": upd.done
        },
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ReturnValues: "UPDATED_NEW"
    }).promise();

    logger.debug("todoDb.updateTodo - out");
    return upd;
}

export async function updateTodoAttachement(userId: string, todoId: string, downloadUrl: string)
    :Promise<void> {
        
    logger.debug("todoDb.updateTodoAttachement - in");
    await dbDocClient.update({
        TableName: tbl,
        Key: { userId: userId, todoId: todoId },
        UpdateExpression: "set attachmentUrl=:aur",
        ExpressionAttributeValues: {
            ":aur": downloadUrl
        },
        ReturnValues: "UPDATED_NEW"
    }).promise();

    logger.debug("todoDb.updateTodoAttachement - out");
    return ;
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
    logger.debug("todoDb.deleteTodo - in");

    await dbDocClient.delete({ TableName: tbl, Key: { userId, todoId } }).promise();

    logger.debug("todoDb.deleteTodo - out");
}