import { User } from './user';

export interface UserRole {
  id?: number,
  user_id?: number,
  role_id?: number,
  shop_id?: number,
  created_at?: string,
  updated_at?: string,
  created_at_human?: string,
  user?: User
}
