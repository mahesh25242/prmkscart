<?php

use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
/**
* Run the database seeds.
*
* @return void
*/
public function run()
{
	DB::table('roles')->truncate();
	$roles = array(
            array('name' => 'Super User','status' => 1, 'description' => 'Super user can handle entire site'),
            array('name' => 'Admin','value' => 1, 'description' => 'its Shop Admin')
		);
		DB::table('roles')->insert($roles);
	}
}
