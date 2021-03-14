<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBasePathFaviconThemeColorBgColorShortNameToShopsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->string('base_path')->nullable();
            $table->string('favicon')->nullable();
            $table->string('theme_color')->nullable();
            $table->string('bg_color')->nullable();
            $table->string('short_name')->nullable();
            $table->json('icons')->nullable();
            $table->string('logo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn('base_path');
            $table->dropColumn('favicon');
            $table->dropColumn('theme_color');
            $table->dropColumn('bg_color');
            $table->dropColumn('short_name');
            $table->dropColumn('icons');
            $table->dropColumn('logo');
        });
    }
}
