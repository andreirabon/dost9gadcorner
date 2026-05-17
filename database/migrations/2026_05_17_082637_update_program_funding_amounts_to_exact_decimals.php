<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('program_funding_summaries', function (Blueprint $table) {
            $table->decimal('female_amount', 20, 6)->default(0)->change();
            $table->decimal('male_amount', 20, 6)->default(0)->change();
        });
    }

    public function down(): void
    {
        Schema::table('program_funding_summaries', function (Blueprint $table) {
            $table->decimal('female_amount', 15, 2)->default(0)->change();
            $table->decimal('male_amount', 15, 2)->default(0)->change();
        });
    }
};
