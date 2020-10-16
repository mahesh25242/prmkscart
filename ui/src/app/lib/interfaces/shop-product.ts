import { Shop } from './shop';
import { ShopProductCategory } from './shop-product-category';
export interface ShopProduct {
  id?: number,
  shop_id?: number,
  name?: string,
  description?: string,
  status?: number,
  status_text?: string,
  sortorder?: number,
  created_at?: string,
  shop_product_category_id?: number,
  shop_product_category?: ShopProductCategory,
  shop?: Shop
}
