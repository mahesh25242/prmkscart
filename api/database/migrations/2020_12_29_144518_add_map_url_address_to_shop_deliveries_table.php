<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMapUrlAddressToShopDeliveriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shop_deliveries', function (Blueprint $table) {
            $table->longText('map_url')->nullable();
            $table->text('address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shop_deliveries', function (Blueprint $table) {
            $table->dropColumn('map_url');
            $table->dropColumn('address');
        });
    }
}
