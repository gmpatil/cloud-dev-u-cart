export interface Item {
  storeNum: number
  itemNum?: number
  name: string
  desc: string
  unitType: string
  minIncrement: number
  maxUnit?: number
  price: number
  imageUploaded?: boolean
}
