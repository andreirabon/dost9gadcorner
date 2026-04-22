<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('username')->nullable()->unique()->after('id');
        });

        foreach (DB::table('users')->orderBy('id')->get() as $row) {
            $email = property_exists($row, 'email') ? (string) $row->email : '';
            if ($email !== '') {
                $local = Str::before($email, '@');
                $base = $local !== '' ? Str::slug($local) : 'user';
            } else {
                $base = 'user'.$row->id;
            }
            if ($base === '') {
                $base = 'user';
            }
            $candidate = $base;
            $n = 0;
            while (
                DB::table('users')
                    ->where('username', $candidate)
                    ->where('id', '!=', $row->id)
                    ->exists()
            ) {
                $candidate = $base.(++$n);
            }
            DB::table('users')->where('id', $row->id)->update(['username' => $candidate]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['username']);
            $table->dropColumn('username');
        });
    }
};
