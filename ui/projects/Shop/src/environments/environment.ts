// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { environment as env  } from 'src/environments/environment';
export const environment = {
  production: false,
  siteName: 'Shop',
  shopKey: 'cf84b5f7dc34837ab0e33c8d452c1d47d9182777',
  baseUrl: env.baseUrl,
  lumenSecret: env.lumenSecret,
  client_id: env.client_id,
  grant_type: env.grant_type,
  siteAddress: env.siteAddress
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
