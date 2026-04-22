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

    public function canAccessReportManagement(): bool
    {
        return $this !== self::None;
    }
}
