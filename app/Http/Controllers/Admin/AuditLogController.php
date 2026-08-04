<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', AuditLog::class);

        return Inertia::render('admin/audit-logs/Index', [
            'logs' => AuditLog::query()
                ->orderByDesc('created_at')
                ->paginate(25)
                ->withQueryString(),
        ]);
    }
}
