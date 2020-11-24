import { environment as env  } from '../../../../src/environments/environment.prod';

export const environment = {
  production: true,
  siteName: 'Shop',
  shopKey: '3d9f5a8eec71764c7c2df5a56496c8a1320dd921',
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
