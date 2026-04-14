<?php

namespace App\Policies;

use App\Models\ReportYear;
use App\Models\User;

class ReportYearPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_admin;
    }

    public function view(User $user, ReportYear $reportYear): bool
    {
        return $user->is_admin;
    }

    public function create(User $user): bool
    {
        return $user->is_admin;
    }

    public function update(User $user, ReportYear $reportYear): bool
    {
        return $user->is_admin;
    }

    public function delete(User $user, ReportYear $reportYear): bool
    {
        return $user->is_admin;
    }
}
