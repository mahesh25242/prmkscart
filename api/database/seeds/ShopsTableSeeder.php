<?php

use Illuminate\Database\Seeder;

class ShopsTableSeeder extends Seeder
{
/**
* Run the database seeds.
*
* @return void
*/
public function run()
{
    if(DB::table('shops')->where('shop_key', '3d9f5a8eec71764c7c2df5a56496c8a1320dd921')->doesntExist()){

        $input = [
            'name' => 'Demo Shop',
            'email' => 'demo@cart.com',
            'phone' => '1234567890',
            'address' => 'Kochi',
            'shop_key' => '3d9f5a8eec71764c7c2df5a56496c8a1320dd921',
            'shop_url' => ''
        ];
        $shop = \App\Shop::create($input);

        $input = [];
        $input = [
            'fname' => 'Demo Admin',
            'email' => 'demo@cart.com',
            'phone' => '1234567890',
            'password' => '$2y$10$5f3dYiEC.hnKaFXeXuNrLeU5kQVrTMuqPwEqIgOfGrV5kM9NX9eNK',
            'phone' => '1234567890'
        ];
        $user = \App\User::create($input);


        $user->createToken('cart')->accessToken;
        \App\UserRole::updateOrCreate(
            [
                "shop_id" => $shop->id,
                "role_id" => 2,
                "user_id" => $user->id
            ],
            [
                "shop_id" => $shop->id,
                "role_id" => 2,
                "user_id" => $user->id
            ]
        );

    }

    }
}
