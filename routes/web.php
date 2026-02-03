<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('Index'))->name('index');

require __DIR__ . '/settings.php';
