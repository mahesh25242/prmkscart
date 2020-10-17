import { ShopProduct } from './shop-product';

export interface ShopProductImage {
  id?: number,
  shop_product_id?: number,
  shop_product_variant_id?: number,
  image?: string,
  sortorder?: number,
  created_at?: string,
  shop_product?: ShopProduct,
  image_path?: string
}
