<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Cast-backed attributes are invisible to static analysis, so declare them.
 *
 * @property string $username
 * @property string $password
 * @property UserRole|null $role
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    public const PRIMARY_ADMIN_USERNAME = 'ARR';

    /**
     * The attributes that are mass assignable (`role` is not — set only in trusted code).
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    public function isPrimaryAdministrator(): bool
    {
        return $this->role === UserRole::ADMINISTRATOR && $this->username === self::PRIMARY_ADMIN_USERNAME;
    }
}
