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
  minUnits: number  
  maxUnits: number
  price: number
  active: boolean
  imageUploaded?: boolean  
}
