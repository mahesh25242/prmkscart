import { User } from "./user";
import { City } from "./city";
import { Country } from "./country";
import { ShopCategory } from './shop-category';
import { State } from "./state";
import { UserRole } from "./user-role";
import { ShopDelivery } from './shop-delivery';

export interface Shop {
  id?: number,
  name?: string,
  email?: string,
  phone?: string,
  address?: string,
  country_id?: number,
  country?: Country,
  state_id?: number,
  state?: State,
  city_id?: number,
  city?: City,
  pin?: string,
  local?: string,
  map?: Object,
  shop_key?: string,
  created_by?: number,
  user?: User,
  status?:number,
  status_text?: string,
  shop_category_id?: number,
  shop_category?: ShopCategory,
  created_at?: string,
  user_role?: UserRole,
  shop_url?: string,
  shop_delivery?: ShopDelivery[],
  is_generated?: boolean,
  base_path?: string,
  favicon?: string,
  theme_color?: string,
  bg_color?: string,
  short_name?: string,
  logo?: string,
  icons?: any
}
