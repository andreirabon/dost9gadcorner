<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $actor_username
 * @property string|null $actor_role
 * @property string $action
 * @property string|null $section
 * @property string|null $column
 * @property string|null $row
 * @property string $item_label
 * @property array<string, mixed>|null $changes
 */
class AuditLog extends Model
{
    protected $fillable = [
        'actor_id',
        'actor_username',
        'actor_role',
        'action',
        'section',
        'column',
        'row',
        'item_label',
        'changes',
    ];

    protected function casts(): array
    {
        return [
            'changes' => 'array',
        ];
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
