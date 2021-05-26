// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  tinyMceApi: 'n6mryrdzt1pclqabsvpbvw6mtym3kj9gpwjguof89d2sv52q',
  //baseUrl: 'http://localhost/prmkscart/api/public/v1',
  baseUrl: 'https://api.breadnbutter.co.in/public/v1',
  //baseUrl: 'https://agoranature.com/api/public/v1', //test
  recaptchaKey: '6Ld2McEZAAAAABDjGwyJ63pD3ETCQkWCiZqEH39C',
  //lumenSecret: 'qsZyXU1bmZUWeCu2aUkF6lqAH8xxemstknjAThdP',
  lumenSecret: 'K6IlhS1oZBgxNQciIEtCoXzlHRGu0MefIkNkp68b',
  client_id: 2 ,
  grant_type: "password",
  //siteAddress: 'http://localhost/prmkscart/api/public',
  siteAddress: 'https://api.breadnbutter.co.in/public/',
  //siteAddress: 'https://agoranature.com/api/public', //test
  gMapUrl: `http://maps.google.com`,
  openstreetmap: `https://nominatim.openstreetmap.org`,
  firebaseConfig : {
    apiKey: "AIzaSyDo7xr0-tG22yldwClYGTm1cqCRdP1kpEI",
    authDomain: "cart-5bd88.firebaseapp.com",
    databaseURL: "https://cart-5bd88.firebaseio.com",
    projectId: "cart-5bd88",
    storageBucket: "cart-5bd88.appspot.com",
    messagingSenderId: "971671236149",
    appId: "1:971671236149:web:0e275f118ee00b18c98b7c",
    measurementId: "G-R88KE3DEVR"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
