import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateItemRequest'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import { TodoUpdate } from '../../models/ItemUpdate'

import * as bl from '../../businessLogic/ucartBl';

const logger = createLogger("updateTodo");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("In updateTodo - out");
  const todoId = event.pathParameters.todoId
  const updtdTodoItm: UpdateTodoRequest = JSON.parse(event.body)
  const uid = getUserId(event);
  const ret: TodoUpdate = await bl.updateTodoItem(uid, todoId, updtdTodoItm);
  logger.debug(`In updateTodo - out : ${ret}`);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ""
  };
}
