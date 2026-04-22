<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'email')) {
            return;
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['email', 'email_verified_at']);
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'email')) {
            return;
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->string('email')->unique()->after('username');
            $table->timestamp('email_verified_at')->nullable()->after('email');
        });
    }
};
