<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
/**
* Run the database seeds.
*
* @return void
*/
public function run()
{
    if(DB::table('user_roles')->where('role_id', '1')->doesntExist()){

        $input = [
            'fname' => 'Super',
            'lname' => 'User',
            'status' => 1,
            'email' => 'admin@cart.com',
            'password' => '$2y$10$5f3dYiEC.hnKaFXeXuNrLeU5kQVrTMuqPwEqIgOfGrV5kM9NX9eNK',
            'phone' => '123456'
        ];
        $user = \App\User::create($input);

        $user->createToken('cart')->accessToken;
        \App\UserRole::updateOrCreate(
            [
                "role_id" => 1,
                "user_id" => $user->id
            ],
            [
                "role_id" => 1,
                "user_id" => $user->id
            ]
        );

    }

	}
}
