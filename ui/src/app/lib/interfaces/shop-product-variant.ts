import { ShopProduct } from './shop-product';
import { ShopProductImage } from './shop-product-image';

export interface ShopProductVariant {
  id?: number,
  shop_product_id?: number,
  name?: string,
  description?: string,
  is_primary?: number,
  type?: any,
  actual_price?: number,
  price?: number,
  status?: number,
  status_text?: string,
  sortorder?: number,
  created_at?: string,
  shop_product?: ShopProduct,
  shop_product_image?: ShopProductImage
}
