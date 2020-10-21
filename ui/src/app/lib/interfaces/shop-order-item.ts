import { ShopOrder } from './shop-order';
import { ShopProductVariant } from './shop-product-variant';
export interface ShopOrderItem {
  id?: number,
  shop_order_id?: number,
  shop_product_variant_id?: number,
  qty?: number,
  price?: number,
  status?: string ,
  shop_product_variant?: ShopProductVariant,
  shop_order?:  ShopOrder
}
