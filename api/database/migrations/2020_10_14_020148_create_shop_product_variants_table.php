<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopProductVariantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shop_product_variants', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('shop_product_id')->default(0);
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->double('actual_price', 8, 2)->nullable();
            $table->double('price', 8, 2)->nullable();
            $table->integer('sortorder')->default(1);
            $table->boolean('status')->default(1);
            $table->boolean('is_primary')->default(0);
            $table->json('type')->nullable();
            $table->bigInteger('created_by')->default(0);
            $table->bigInteger('updated_by')->default(0);
            $table->bigInteger('deleted_by')->default(0);
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
        Schema::dropIfExists('shop_product_variants');
    }
}
