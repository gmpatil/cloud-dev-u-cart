/**
 * Fields in a request to update a single Store catalog Item.
 */
export interface UpdateItemRequest {
  itemId?: string // i-storeNum(5)-itemNum(10)  
  storeNum: number
  itemNum: number
  name: string
  desc: string
  unitType: string
  minIncrement: number
  maxUnit?: number
  price: number
  active: boolean
  imageUploaded?: boolean  
}