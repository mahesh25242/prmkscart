import { Shop } from './shop';
export interface ShopProductCategory {
  id?: number,
  shop_id?: number,
  name?: string,
  description?: string,
  status?: number,
  status_text?: string,
  sortorder?: number,
  created_at?: string,
  shop?: Shop,
  icon?: string
}
