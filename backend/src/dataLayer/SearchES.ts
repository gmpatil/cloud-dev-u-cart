import * as AWS from 'aws-sdk';
//import * as elasticsearch from 'elasticsearch'
import {Client, SearchResponse} from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import { createLogger } from '../utils/logger';
import {ES_EP} from '../utils/constants';
import { Item } from '../models/Item';

export class SearchES {
    constructor( private readonly esClient: Client = getESInstance(),
        private readonly logger = createLogger("SearchES") ) {

        }

    async searchItem(text: string, storeNum: number): Promise<Item> {
        this.logger.debug("SearchES.upsertCart - in");
    
        // const sr: SearchResponse<unknown> = await this.esClient.search({
        //     index: `s-${storeNum}-item-index`,     
        //     body: { 
        //         query: text,
        //         fields: ['name', 'desc']
        //     }
        //   }, {
        //     ignore: [404],
        //     maxRetries: 3
        //   });
    
        // const body = sr.body; //{body, statusCode}
        // const statusCode = sr.statusCode;

        let hits = null;

        this.esClient.search({
          index: `s-${storeNum}-item-index`,
          type: 'item',
          body: { query: text }
          }
        ).then(function(resp:SearchResponse<unknown>) {
            hits = resp.hits.hits ;
        }, function(err) {
            console.trace(err.message);
        });

        this.logger.debug(`SearchES.upsertCart - out.`);
        return hits;
    }
}

function getESInstance() :Client {

    const es = new Client({
        hosts: [ES_EP ],
        connectionClass: httpAwsEs
      })            
    
    return es;
}