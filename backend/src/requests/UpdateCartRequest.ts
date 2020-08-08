/**
 * Fields in a request to create a single User-Store-Cart.
 */
import {OrderItem} from '../models/OrderItem'
// export interface OrderItem {
//     itemId: string
//     unitType: string
//     qty: number
//     Price?: number
// }

export interface UpdateCartRequest {
    userNum?: number    
    storeNum: number
    itms: Array<OrderItem>
    totalAmt: number
}
  
