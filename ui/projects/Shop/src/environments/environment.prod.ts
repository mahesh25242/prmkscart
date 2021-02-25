import { environment as env  } from '../../../../src/environments/environment.prod';

export const environment = {
  production: true,
  siteName: document.querySelector("meta[name=shop-name]").getAttribute("content"),
  shopKey: document.querySelector("meta[name=shop-key]").getAttribute("content"),
  baseUrl: env.baseUrl,
  lumenSecret: env.lumenSecret,
  client_id: env.client_id,
  grant_type: env.grant_type,
  siteAddress: env.siteAddress,
  gMapUrl: env.gMapUrl,
  openstreetmap: env.openstreetmap,
  productListPerPage: 200,
  firebaseConfig : env.firebaseConfig
};
