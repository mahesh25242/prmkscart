<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shop_orders', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_id')->default(0);
            $table->string('shop_customer_id')->default(0);
            $table->double('total', 8 , 2)->default(0);
            $table->double('delivery_chage', 8 , 2)->default(0);
            $table->string('address')->nullable();
            $table->string('pin')->nullable();
            $table->string('note')->nullable();
            $table->json('loc')->nullable();
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
        Schema::dropIfExists('shop_orders');
    }
}
