import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger' ;
import {S3_BUCKET_ITEM_IMG, S3_BUCKET_ITEM_IMG_S, S3_SIGNED_URL_EXPIRATION} from '../utils/constants'

export class ImageS3 {
    constructor( private readonly s3: AWS.S3 = createS3Client(),
        private readonly logger = createLogger("attachementS3") ) {}

    async deleteImages(todoId: string): Promise<void> {
        this.logger.debug("todoDb.deleteAttachement - in");  
        try {
            await this.s3.deleteObject({ Bucket: S3_BUCKET_ITEM_IMG, Key: todoId}, (err, data) => {
                if (!err) {
                    this.logger.error("Error deleting attachement from S3 bucket-1", err);
                } else {
                    this.logger.debug("Deleted attachement from S3 bucket.", (data ? data[0]: ""));
                }
            }).promise() ;
        } catch (error) {
            this.logger.error("Error deleting attachement from the S3 bucket-2", error);
        }
    
        this.logger.debug("todoDb.deleteAttachement - out");      
    }
    
    async getImageUploadUrl(_userId :string, todoId: string)
        : Promise<string> {
            return await this.s3.getSignedUrlPromise("putObject", {Bucket: S3_BUCKET_ITEM_IMG, Key: todoId, Expires: S3_SIGNED_URL_EXPIRATION});
    }
    
    async getImageDownloadUrl(todoId: string)
        : Promise<string> {
            return `https://${S3_BUCKET_ITEM_IMG}.s3.amazonaws.com/${todoId}` ;
    }
    
    async getThumbnailImageDownloadUrl(todoId: string)
        : Promise<string> {
            return `https://${S3_BUCKET_ITEM_IMG_S}.s3.amazonaws.com/${todoId}` ;
    }
}


function createS3Client() {
    // const AWSXRay = require('aws-xray-sdk');
    // const AWS = AWSXRay.captureAWS(AWSb)
    return new AWS.S3({ signatureVersion: 'v4' });    
}