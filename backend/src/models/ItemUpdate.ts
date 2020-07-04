export interface ItemUpdate {
  storeId: number
  itemId: number
  name?: string
  desc?: string
  unitType?: string
  minIncrement?: number
  maxUnit?: number
  price?: number
  imageUploaded?: boolean}