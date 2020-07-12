export interface Item {
  itemId?: string // i-storeNum(5)-itemNum(10)
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
