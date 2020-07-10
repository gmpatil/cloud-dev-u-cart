import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import { ES_EP} from '../../utils/constants'
import {createLogger } from '../../utils/logger'

const es = new elasticsearch.Client({
  hosts: [ ES_EP ],
  connectionClass: httpAwsEs
})

const logger = createLogger("sync2ElasticSearch")

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  logger.debug('Processing events batch from DynamoDB', JSON.stringify(event))

  for (const record of event.Records) {
    logger.debug('Processing record', JSON.stringify(record))
    if (record.eventName !== 'INSERT') {
      continue
    }

    const newItem = record.dynamodb.NewImage

    const itemNum = newItem.itemNum.N
    const storeNum = newItem.storeNum.N

    const body = {
      storeNum: newItem.storeNum.N,      
      itemNum: newItem.itemNum.N,
      name: newItem.name.S,
      desc: newItem.desc.S,
    }

    await es.index({
      index: `s-${storeNum}-item-index`,
      type: 'item',            
      id: itemNum,
      body
    })

  }
}
