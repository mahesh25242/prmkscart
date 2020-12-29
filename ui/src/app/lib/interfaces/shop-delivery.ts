import { Shop } from "./shop";

export interface ShopDelivery {
  id?: number,
  shop_id?: number,
  name?: string,
  description?: string,
  charge?: number,
  created_at?: string,
  sortorder?: number,
  need_cust_loc?: number,
  shop?: Shop,
  min_amount?: number,
  address?: string,
  map_url?: string
}
