<?php

use Illuminate\Database\Seeder;

class SettingsTableSeeder extends Seeder
{
/**
* Run the database seeds.
*
* @return void
*/
public function run()
{
	DB::table('settings')->truncate();
	$settings = array(
            array('name' => 'site name','value' => 'Cart'),
            array('name' => 'email','value' => 'info@cart.com')
		);
		DB::table('settings')->insert($settings);
	}
}
