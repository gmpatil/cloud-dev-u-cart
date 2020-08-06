import {OrderItem} from '../models/OrderItem'
// export interface OrderItem {
//     itemId: string
//     unitType: string
//     qty: number
//     Price?: number
// }

export interface CreateOrderRequest {
    userId?: string    
    storeNum: number
    orderNum?:number
    itms: Array<OrderItem>
    totalAmt: number
}
  