export interface Item {
  itemId?: string // i-storeNum(5)-itemNum(10)
  storeNum?: number
  itemNum?: number
  name: string
  desc: string
  unitType: string
  minIncrement: number
  minUnits: number
  maxUnits: number
  price: number  // per unit above
  active: boolean
  imageUploaded?: boolean
  createdAt?:string
  lastUpdatedAt?: string
}
