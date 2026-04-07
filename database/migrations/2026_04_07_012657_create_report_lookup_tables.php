<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employment_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->unsignedTinyInteger('sort_order')->default(1);
            $table->timestamps();
        });

        Schema::create('gfps_assembly_periods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->unsignedTinyInteger('sort_order')->default(1);
            $table->timestamps();
        });

        Schema::create('report_months', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('short_name', 3);
            $table->unsignedTinyInteger('month_number')->unique();
            $table->timestamps();
        });

        Schema::create('funding_programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->unsignedTinyInteger('sort_order')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('funding_programs');
        Schema::dropIfExists('report_months');
        Schema::dropIfExists('gfps_assembly_periods');
        Schema::dropIfExists('employment_statuses');
    }
};
