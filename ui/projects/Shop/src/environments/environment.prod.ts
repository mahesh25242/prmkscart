import { environment as env  } from '../../../../src/environments/environment';

export const environment = {
  production: true,
  siteName: 'Shop',
  shopKey: 'cf84b5f7dc34837ab0e33c8d452c1d47d9182777',
  baseUrl: env.baseUrl,
  lumenSecret: env.lumenSecret,
  client_id: env.client_id,
  grant_type: env.grant_type,
  siteAddress: env.siteAddress
};
