
import { ShopProduct } from './shop-product';

export interface Cart {
  product?: ShopProduct,
  qty?: number,
  price?: number,
  message?: string
}
