<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\ReportYear;
use App\Models\User;

class ReportYearPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role?->canAccessReportManagement() ?? false;
    }

    public function view(User $user, ReportYear $reportYear): bool
    {
        return $user->role?->canAccessReportManagement() ?? false;
    }

    public function create(User $user): bool
    {
        return $this->isAdministrator($user);
    }

    public function update(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user);
    }

    public function updateMetadata(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::GAD);
    }

    public function updateGfpsMembership(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::GAD);
    }

    public function updateGfpsAssemblies(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::GAD);
    }

    public function updateScholarship(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::SCHOLARSHIP) || $this->isRole($user, UserRole::GAD);
    }

    public function deleteScholarship(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::SCHOLARSHIP) || $this->isRole($user, UserRole::GAD);
    }

    public function updateEmployeeStatuses(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::HR) || $this->isRole($user, UserRole::GAD);
    }

    public function updateRstlMonthly(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::RSTL) || $this->isRole($user, UserRole::GAD);
    }

    public function updateProgramFunding(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::TOS) || $this->isRole($user, UserRole::GAD);
    }

    public function delete(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::GAD);
    }

    private function isAdministrator(User $user): bool
    {
        return $this->isRole($user, UserRole::ADMINISTRATOR);
    }

    private function isRole(User $user, UserRole $expected): bool
    {
        return $user->role === $expected;
    }
}
