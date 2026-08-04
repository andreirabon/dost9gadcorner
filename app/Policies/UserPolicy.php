<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isPrimaryAdministrator();
    }

    public function updatePassword(User $user, User $target): bool
    {
        return $user->isPrimaryAdministrator();
    }
}
