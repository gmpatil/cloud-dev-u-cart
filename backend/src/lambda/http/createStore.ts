import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateStoreRequest } from '../../requests/CreateStoreRequest'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../../utils/utils';
import { Store } from '../../models/Store'

import * as bl from '../../businessLogic/ucartBl';

const logger = createLogger("createTodo");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)
  : Promise<APIGatewayProxyResult> => {
  logger.debug("In crateTodo - in");
  const newStore: CreateStoreRequest = JSON.parse(event.body)
  const ret: TodoItem = await bl.createStore(newStore);
  logger.debug("In crateTodo - out");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({"item": ret})
  };
}
