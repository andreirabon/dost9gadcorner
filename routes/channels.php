<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\ReportYear;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('report-years', function ($user) {
    return $user->can('viewAny', ReportYear::class);
});

Broadcast::channel('report-year.edit.{id}', function ($user, $id) {
    if ($user->can('view', ReportYear::findOrFail($id))) {
        return [
            'id' => $user->id,
            'username' => $user->username,
        ];
    }
    return false;
});
