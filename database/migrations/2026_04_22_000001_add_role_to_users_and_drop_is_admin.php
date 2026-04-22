<?php

use App\Enums\UserRole;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('role', 32)
                ->default(UserRole::GAD->value)
                ->after('password');
        });

        if (Schema::hasColumn('users', 'is_admin')) {
            DB::table('users')->where('is_admin', true)->update(['role' => UserRole::ADMINISTRATOR->value]);
            DB::table('users')->where('is_admin', false)->update(['role' => UserRole::None->value]);
            Schema::table('users', function (Blueprint $table): void {
                $table->dropColumn('is_admin');
            });
        } else {
            DB::table('users')->update(['role' => UserRole::ADMINISTRATOR->value]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->boolean('is_admin')->default(true)->after('password');
        });

        DB::table('users')
            ->whereIn('role', [UserRole::ADMINISTRATOR->value, UserRole::GAD->value, UserRole::SCHOLARSHIP->value, UserRole::HR->value, UserRole::RSTL->value, UserRole::TOS->value])
            ->update(['is_admin' => true]);
        DB::table('users')
            ->where('role', UserRole::None->value)
            ->update(['is_admin' => false]);

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('role');
        });
    }
};
