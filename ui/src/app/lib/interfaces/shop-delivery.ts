import { Shop } from "./shop";

export interface ShopDelivery {
  id?: number,
  shop_id?: number,
  name?: string,
  description?: string,
  charge?: string,
  created_at?: string,
  sortorder?: number,
  need_cust_loc?: number,
  shop?: Shop
}
