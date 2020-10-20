<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopDeliveriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shop_deliveries', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_id')->default(0);
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->double('charge', 8, 2)->nullable();
            $table->integer('sortorder')->nullable();
            $table->boolean('need_cust_loc')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shop_deliveries');
    }
}
