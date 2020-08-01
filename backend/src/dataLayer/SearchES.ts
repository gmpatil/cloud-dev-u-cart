import * as AWS from 'aws-sdk';
//import * as elasticsearch from 'elasticsearch'
import {Client, RequestParams, ApiResponse} from '@elastic/elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import { createLogger } from '../utils/logger';
import * as c from '../utils/constants';
import { Item } from '../models/Item';

export class SearchES {
    constructor( private readonly esClient: Client = getESInstance(),
        private readonly logger = createLogger("SearchES") ) {

        }

    async searchItem(text: string, storeNum: number): Promise<Item> {
        this.logger.debug("SearchES.upsertCart - in");
    
        const {body, statusCode} = await this.esClient.seacrh({
            index: `s-${storeNum}-item-index`,     
            body: { 
                query: text,
                fields: ['name', 'desc']
            }
          }, {
            ignore: [404],
            maxRetries: 3
          });
    
        this.logger.debug(`SearchES.upsertCart - out. StatusCode: ${statusCode}`);
        return body.hits;
    }
}

function getESInstance() :Client {
    const es = new Client({
        hosts: [ c.ES_EP ],
        connectionClass: httpAwsEs
      })            
    
    return es;
}