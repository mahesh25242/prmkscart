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

    $router->post('signUp','UsersController@signUp');

    $router->post('sentContact','ContactUsController@sentContact');


    $router->group(['middleware' =>  'shop'], function () use ($router) {
        $router->get('authUser','TeacherController@teacher');
    });

    $router->group(['middleware' => 'auth'], function () use ($router) {



        $router->group(['prefix' => 'admin',  'middleware' =>  'admin'], function () use ($router) {
            $router->post('updateAvatar','UsersController@updateAvatar');
            $router->post('updateProfile','UsersController@updateProfile');

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


        $router->get('authUser','UsersController@authUser');
        $router->post('setUserLogin','UsersController@setUserLogin');
        $router->get('signOut','UsersController@signOut');









    });
});



