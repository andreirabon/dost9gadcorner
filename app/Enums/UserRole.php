<?php

namespace App\Enums;

enum UserRole: string
{
    case None = 'none';
    case ADMINISTRATOR = 'administrator';
    case GAD = 'gad';
    case SCHOLARSHIP = 'scholarship';
    case HR = 'hr';
    case RSTL = 'rstl';
    case TOS = 'tos';

    /**
     * Automated end-to-end test account. Holds the section-editing abilities the
     * browser specs exercise, but deliberately not publish, delete, lock, or
     * account management — a runaway test run must not be able to destroy data
     * or change what the public site shows.
     */
    case TESTER = 'tester';

    public function canAccessReportManagement(): bool
    {
        return $this !== self::None;
    }
}
