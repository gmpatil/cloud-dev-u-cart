/**
 * Fields in a request to create a single store catalog Item.
 */
export interface CreateItemRequest {
  storeNum: number
  itemNum?: number
  name: string
  desc: string
  unitType: string
  minIncrement: number
  maxUnit?: number
  price: number
  active: boolean
  imageUploaded?: boolean  
}
