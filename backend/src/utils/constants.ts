
// For DynamoDB
export const LOCAL_DYNAMODB_EP :string  = 'http://localhost:8000'
export const CART_TBL :string  = `cart-${process.env.STAGE}`
export const ITEM_TBL :string  = `item-${process.env.STAGE}`
export const ORDER_TBL :string  = `order-${process.env.STAGE}`
export const ORDER_GSI1 :string  = `order-gsi1-uid-${process.env.STAGE}`
export const ORDER_GSI2 :string  = `order-gsi2-str-sts-gidx-${process.env.STAGE}`
export const SEQ_TBL :string  = `seq-${process.env.STAGE}`
export const STORE_TBL :string  = `store-${process.env.STAGE}`
export const USER_TBL :string = `user-${process.env.STAGE}`
export const USER_GSI1 :string = `user-gis1-uid-${process.env.STAGE}` 

// For sequences
export const ENT_CART :string = `cart` ;
export const ENT_ITEM :string = `item` ;
export const ENT_ORDER :string = `order` ;
export const ENT_STORE :string = `store` ;
export const ENT_USER :string = `user` ;

// For S3 buckets
export const S3_BUCKET_ITEM_IMG :string = `gmp-ucart-img-${process.env.STAGE}`
export const S3_BUCKET_ITEM_IMG_S :string = `gmp-ucart-img-s-${process.env.STAGE}`
export const S3_SIGNED_URL_EXPIRATION :number = Number(process.env.SIGNED_URL_EXPIRATION)

// Elastic search
export const ES_EP :string = process.env.ES_ENDPOINT