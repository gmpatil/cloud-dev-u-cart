
// For DynamoDB
export const LOCAL_DYNAMODB_EP :string  = 'http://localhost:8000'
export const TBL_CART :string  = `cart-${process.env.STAGE}`
export const TBL_ITEM :string  = `item-${process.env.STAGE}`
export const TBL_ORDER :string  = `order-${process.env.STAGE}`
export const TBL_SEQ :string  = `seq-${process.env.STAGE}`
export const TBL_STORE :string  = `store-${process.env.STAGE}`
export const TBL_USER :string = `user-${process.env.STAGE}`
export const TBL_USER_IDX :string = `user-index-${process.env.STAGE}`

// For sequences
export const ENT_CART :string = `cart` ;
export const ENT_ITEM :string = `item` ;
export const ENT_ORDER :string = `order` ;
export const ENT_STORE :string = `store` ;
export const ENT_USER :string = `user` ;

// For S3 buckets
export const S3_BUCKET_ITEM_IMG :string = `gmp-ucart-img-${process.env.STAGE}`
export const S3_BUCKET_ITEM_IMG_S :string = `gmp-ucart-img-s-${process.env.STAGE}`
export const S3_SIGNED_URL_EXPIRATION :number = process.env.SIGNED_URL_EXPIRATION

// Elastic search
export const ES_EP :string = process.env.ES_ENDPOINT