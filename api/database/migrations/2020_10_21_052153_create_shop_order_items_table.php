<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopOrderItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shop_order_items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_order_id')->default(0);
            $table->bigInteger('shop_product_variant_id')->default(0);
            $table->integer('qty')->default(0);
            $table->double('price', 8, 2)->default(0);
            $table->boolean('status')->default(1);
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
        Schema::dropIfExists('shop_order_items');
    }
}
