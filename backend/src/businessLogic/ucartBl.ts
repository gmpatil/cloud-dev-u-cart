import { CreateTodoRequest } from '../requests/CreateItemRequest';
import { UpdateTodoRequest } from '../requests/UpdateItemRequest';
import * as uuid from 'uuid';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/Item';
import * as ddb from '../dataLayer/ucartDb';
import * as s3Svc from '../dataLayer/imageS3';
import { TodoUpdate } from '../models/ItemUpdate';


const logger = createLogger("todoDb");

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.debug("todoBl.getTodosForUser - in");
    const items: TodoItem[] = await ddb.getTodoByUser(userId);
    logger.debug("todoBl.getTodosForUser - out");
    return items;
}

export async function createTodoItem(userId: string, todoBus: CreateTodoRequest): Promise<TodoItem> {
    logger.debug("todoBl.createTodoItem - in");

    const todoId = uuid.v4();
    const todoDb: TodoItem = {
        todoId: todoId,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: todoBus.name,
        done: false,
        ...todoBus
    }

    const item: TodoItem = await ddb.createTodo(todoDb);
    logger.debug("todoBl.createTodoItem - out");
    return item;
}

export async function updateTodoItem(userId: string, todoId: string, todoBus: UpdateTodoRequest)
    : Promise<TodoUpdate> {
    logger.debug("todoBl.updateTodoItem - in");
    const updItem: TodoUpdate = await ddb.updateTodo(userId, todoId, todoBus);
    logger.debug("todoBl.updateTodoItem - out");
    return updItem;
}

export async function deleteTodoItem(userId: string, todoId: string)
    : Promise<void> {
    logger.debug("todoBl.deleteTodoItem - in");

    const todoItm: TodoItem = await ddb.getTodo(userId, todoId);
    if (todoItm) {
        // Delete attachement from S3 bucket
        if (todoItm.attachmentUrl) {
            await s3Svc.deleteAttachement(todoId);
        }

        // Delete TodoItem from DynamoDB
        await ddb.deleteTodo(userId, todoId);        
    }

    logger.debug("todoBl.deleteTodoItem - out");
    return;
}

export async function getSignedUrl(userId: string, todoId: string)
    :Promise<string> {
    logger.debug("todoBl.getSignedUrl - in");
    const todoItm: TodoItem = await ddb.getTodo(userId, todoId);
    
    //record/overwrite as a new attachment URL or update to existing one.    
    if (todoItm) {
        const downloadUrl :string = await s3Svc.getAttachementDownloadUrl(userId, todoId); 
        // Add/update attachementURL for Todo item in DB
        await ddb.updateTodoAttachement(userId, todoId, downloadUrl);

        // get signed/upload URL from S3
        const uploadUrl :string = await s3Svc.getAttachementUploadUrl(userId, todoId);        
        logger.debug("todoBl.getSignedUrl - out 1");        
        return uploadUrl;
    } else {
        logger.debug("todoBl.getSignedUrl - out 2");        
        return null;
    }
}