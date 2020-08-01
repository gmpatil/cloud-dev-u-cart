/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateStoreRequest {
  storeNum?: number
  name: string
  desc: string
}
