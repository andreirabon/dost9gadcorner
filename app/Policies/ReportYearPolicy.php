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
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::GAD);
    }

    public function update(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user);
    }

    public function publish(User $user): bool
    {
        return $this->isAdministrator($user);
    }

    public function toggleLock(User $user, ?ReportYear $reportYear = null): bool
    {
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::GAD);
    }

    public function updateMetadata(User $user, ReportYear $reportYear): bool
    {
        return $this->editsEverySection($user);
    }

    public function updateGfpsMembership(User $user, ReportYear $reportYear): bool
    {
        return $this->editsEverySection($user);
    }

    public function updateGfpsAssemblies(User $user, ReportYear $reportYear): bool
    {
        return $this->editsEverySection($user);
    }

    public function updateScholarship(User $user, ReportYear $reportYear): bool
    {
        return $this->editsEverySection($user) || $this->isRole($user, UserRole::SCHOLARSHIP);
    }

    public function deleteScholarship(User $user, ReportYear $reportYear): bool
    {
        return $this->editsEverySection($user) || $this->isRole($user, UserRole::SCHOLARSHIP);
    }

    public function updateEmployeeStatuses(User $user, ReportYear $reportYear): bool
    {
        return $this->editsEverySection($user) || $this->isRole($user, UserRole::HR);
    }

    public function updateRstlMonthly(User $user, ReportYear $reportYear): bool
    {
        return $this->editsEverySection($user) || $this->isRole($user, UserRole::RSTL);
    }

    public function updateProgramFunding(User $user, ReportYear $reportYear): bool
    {
        return $this->editsEverySection($user) || $this->isRole($user, UserRole::TOS);
    }

    public function delete(User $user, ReportYear $reportYear): bool
    {
        return $this->isAdministrator($user) || $this->isRole($user, UserRole::GAD);
    }

    /**
     * Roles that may edit every data section of a report year.
     *
     * TESTER is included so the browser specs can exercise each tab, but it is
     * deliberately absent from create, update, publish, toggleLock, and delete
     * above — a test run can fill sections in, never destroy a year or change
     * what the public site shows.
     */
    private function editsEverySection(User $user): bool
    {
        return $this->isAdministrator($user)
            || $this->isRole($user, UserRole::GAD)
            || $this->isRole($user, UserRole::TESTER);
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
