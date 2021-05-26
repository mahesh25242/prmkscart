import { Pagination } from './pagination';
import { Shop } from './shop';
import { ShopCustomer } from './shop-customer';
import { ShopDelivery } from './shop-delivery';
import { ShopOrderItem } from './shop-order-item';
export interface ShopOrder {
  id?: number,
  shop_id?: number,
  shop_customer_id?: number,
  total?: number,
  delivery_chage?: number,
  address?: string,
  pin?: string,
  note?: string,
  loc?: any,
  status?: number,
  created_at?: string,
  shop?: Shop
  shop_customer?:  ShopCustomer,
  shop_order_item?: ShopOrderItem,
  shop_delivery?: ShopDelivery,
  delivery_at?: string,
  status_text?: string,
  sec_key?: string
}


export interface ShopOrderWithPagination extends Pagination {
  data?: ShopOrder[]
}
