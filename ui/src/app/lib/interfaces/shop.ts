import { User } from "firebase";
import { City } from "./city";
import { Country } from "./country";
import { ShopCategory } from './shop-category';
import { State } from "./state";

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
  created_at?: string
}
