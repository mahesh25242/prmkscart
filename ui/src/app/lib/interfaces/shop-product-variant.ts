import { ShopProduct } from './shop-product';

export interface ShopProductVariant {
  id?: number,
  shop_product_id?: number,
  name?: string,
  actual_price?: number,
  price?: number,
  status?: number,
  status_text?: string,
  sortorder?: number,
  created_at?: string,
  shop_product?: ShopProduct
}
