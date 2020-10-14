const config = {
    baseUrl : 'http://localhost/cart/api/public/v1',
    client_secret: 'xa0z4S7bj6KcBGaY6lPYFLxtm5RTP5U73XHuKKE8',
    grant_type: 'password',
    domPrefix:`cart`, /* render div id start with */
    ajax:{
        headers: {
            'Content-Type': 'application/json',
            'ShopId': '',  
            'Authorization' : ''       
        }
    }
}

export default config;