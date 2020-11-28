import { Pagination } from './pagination';
import { Shop } from './shop';
import { ShopProductCategory } from './shop-product-category';
import { ShopProductVariant } from './shop-product-variant';
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
  shop?: Shop,
  shop_product_variant?: ShopProductVariant[],
  shop_product_primary_variant?: ShopProductVariant,
  shop_product_selected_variant?: ShopProductVariant,
  url?: string,
  incart?: boolean
}

export interface ShopProductWithPagination extends Pagination {
  data?: ShopProduct[]
}
