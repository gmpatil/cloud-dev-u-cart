import { SNSEvent, SNSHandler, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import Jimp from 'jimp/es'
import * as c from '../../utils/constants'
import {createLogger} from '../../utils/logger'

// ******
// Original code/template from https://github.com/udacity/cloud-developer
// ******
const logger = createLogger("createTodo");

// const XAWS = AWSXRay.captureAWS(AWS)
// const s3 = new XAWS.S3()
const s3 = new AWS.S3()

export const handler: SNSHandler = async (event: SNSEvent) => {
    logger.debug('Processing SNS event ', JSON.stringify(event))
  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message
    logger.debug('Processing S3 event', s3EventStr)
    const s3Event = JSON.parse(s3EventStr)

    for (const record of s3Event.Records) {
      await processImage(record)
    }
  }
}

async function processImage(record: S3EventRecord) {
  const key = record.s3.object.key
  logger.debug('Processing S3 item with key: ', key)
  const response = await s3
    .getObject({
      Bucket: c.S3_BUCKET_ITEM_IMG,
      Key: key
    })
    .promise()

  const body = response.Body
  const image = await Jimp.read(body)

  logger.debug('Resizing image')
  image.resize(150, Jimp.AUTO)
  const convertedBuffer = await image.getBufferAsync(Jimp.AUTO)

  logger.debug(`Writing image back to S3 bucket: ${c.S3_BUCKET_ITEM_IMG_S}`)
  await s3
    .putObject({
      Bucket: c.S3_BUCKET_ITEM_IMG_S,
      Key: `${key}.jpeg`,
      Body: convertedBuffer
    })
    .promise()
}
