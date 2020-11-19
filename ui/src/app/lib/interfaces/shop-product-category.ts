import { Shop } from './shop';
import { ShopProduct } from './shop-product';
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
  icon?: string,
  shop_product: ShopProduct[],
  url?: string,
  is_maticon?: number,
  shop_product_count?: number
}
