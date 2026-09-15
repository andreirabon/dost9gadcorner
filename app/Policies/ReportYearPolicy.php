<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\ReportYear;
use App\Models\User;

class ReportYearPolicy
{
    /**
     * Roles that may edit every data section of a report year.
     *
     * TESTER is included so the browser specs can exercise each tab, but it is
     * deliberately absent from create, update, publish, toggleLock, and delete
     * — a test run can fill sections in, never destroy a year or change what
     * the public site shows.
     */
    private const SECTION_EDITORS = [UserRole::ADMINISTRATOR, UserRole::GAD, UserRole::TESTER];

    private const YEAR_MANAGERS = [UserRole::ADMINISTRATOR, UserRole::GAD];

    public function viewAny(User $user): bool
    {
        return $user->role?->canAccessReportManagement() ?? false;
    }

    public function view(User $user, ReportYear $reportYear): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->hasRole($user, ...self::YEAR_MANAGERS);
    }

    public function update(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, UserRole::ADMINISTRATOR);
    }

    public function publish(User $user): bool
    {
        return $this->hasRole($user, UserRole::ADMINISTRATOR);
    }

    public function toggleLock(User $user, ?ReportYear $reportYear = null): bool
    {
        return $this->hasRole($user, ...self::YEAR_MANAGERS);
    }

    public function delete(User $user, ?ReportYear $reportYear = null): bool
    {
        return $this->hasRole($user, ...self::YEAR_MANAGERS);
    }

    public function updateMetadata(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS);
    }

    public function updateGfpsMembership(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS);
    }

    public function updateGfpsAssemblies(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS);
    }

    /**
     * GFPS membership data, but employment figures — HR owns the same split on
     * the Employees section, so they can enter it here too.
     */
    public function updateGfpsMemberStatuses(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS, ...[UserRole::HR]);
    }

    public function updateScholarship(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS, ...[UserRole::SCHOLARSHIP]);
    }

    public function deleteScholarship(User $user, ReportYear $reportYear): bool
    {
        return $this->updateScholarship($user, $reportYear);
    }

    public function updateEmployeeStatuses(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS, ...[UserRole::HR]);
    }

    public function updateRstlMonthly(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS, ...[UserRole::RSTL]);
    }

    public function updateProgramFunding(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS, ...[UserRole::TOS]);
    }

    private function hasRole(User $user, UserRole ...$roles): bool
    {
        return in_array($user->role, $roles, true);
    }
}
