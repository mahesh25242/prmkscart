import { Role } from './role';
import { Pagination } from './pagination';

export interface UserLogin {
  id?: number,
  name?: string,
  created_at?: string,
  updated_at?: string,
  created_at_human?: string
}



export interface User {
  id?: number,
  fname?: string,
  mname?: string,
  lname?: string,
  status?: number,
  email?: string,
  passeord?: string,
  phone?: string,
  role?: Role[],
  created_at?: string,
  updated_at?: string,
  created_by?: number,
  updated_by?: number,
  last_login?:UserLogin,
  avatar?: string,
  url?: string,
  created_at_human?: string,
}
export interface UserWithPagination extends Pagination {
  data?: User[]
}
