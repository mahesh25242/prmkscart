<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/key', function() {
    return \Illuminate\Support\Str::random(32);
});

$router->get('/', function () use ($router) {
    return $router->app->version();
});

//$router->get('/{sitemap}','SiteMapController@index');

$router->group(['prefix' => 'v1'], function () use ($router) {

    $router->get('countries','CountryController@countries');
    $router->get('states','StateController@states');
    $router->get('cities','CityController@cities');


    $router->group(['prefix' => 'shop'], function () use ($router) {
        $router->get('/','ShopsController@shopDetails');
        $router->post('createOrder','OrderController@createOrder');
        $router->group(['prefix' => 'product'], function () use ($router) {
            $router->get('showCategories','ShopProductCategoryController@showCategories');
            $router->post('showProducts','ShopProductController@showProducts');
        });
    });



    $router->post('sentContact','ContactUsController@sentContact');






    $router->group(['middleware' => 'auth'], function () use ($router) {

        $router->group(['middleware' =>  'adminAndShop'], function () use ($router) {
            $router->get('authUser','UsersController@authUser');
            $router->post('setUserLogin','UsersController@setUserLogin');
            $router->get('signOut','UsersController@signOut');
            $router->post('updateAvatar','UsersController@updateAvatar');
            $router->post('updateProfile','UsersController@updateProfile');

            $router->group(['prefix' => 'shop'], function () use ($router) {

                $router->group(['prefix' => 'deliveries'], function () use ($router) {
                    $router->post('/','ShopDeliveryController@deliveries');
                    $router->post('delete','ShopDeliveryController@delete');
                    $router->post('store','ShopDeliveryController@store');
                });


                $router->group(['prefix' => 'products'], function () use ($router) {
                    $router->post('/','ShopProductController@products');
                    $router->post('store','ShopProductController@store');
                    $router->post('delete','ShopProductController@delete');
                    $router->group(['prefix' => 'categories'], function () use ($router) {
                        $router->post('/','ShopProductCategoryController@categories');
                        $router->post('store','ShopProductCategoryController@store');
                        $router->post('delete','ShopProductCategoryController@delete');
                    });

                });

            });
        });



        $router->group(['prefix' => 'admin',  'middleware' =>  'admin'], function () use ($router) {

            $router->post('createAdmin','UsersController@createAdmin');

            $router->group(['prefix' => 'shops'], function () use ($router) {
                $router->post('/','ShopsController@shops');
                $router->get('/shop/{id}','ShopsController@getAShop');
                $router->post('store','ShopsController@store');
                $router->post('delete/{id}','ShopsController@delete');

                $router->group(['prefix' => 'categories'], function () use ($router) {
                    $router->post('/','ShopsCategoryController@categories');
                    $router->post('store','ShopsCategoryController@store');
                    $router->post('delete/{id}','ShopsCategoryController@delete');
                });

            });

        });



    });


});



