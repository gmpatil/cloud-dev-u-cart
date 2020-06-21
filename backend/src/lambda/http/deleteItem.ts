import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import * as bl from '../../businessLogic/ucartBl';

const logger = createLogger("updateTodo");


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.debug("In deleteTodo - in");
  const todoId = event.pathParameters.todoId
  const uid = getUserId(event);
  await bl.deleteTodoItem(uid, todoId);
  logger.debug("In deleteTodo - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ""
  };
}
