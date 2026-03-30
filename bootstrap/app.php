<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
  ->withRouting(
    web: __DIR__ . '/../routes/web.php',
    commands: __DIR__ . '/../routes/console.php',
    health: '/up',
  )
  ->withMiddleware(function (Middleware $middleware): void {
    $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

    $middleware->web(append: [
      HandleAppearance::class,
      HandleInertiaRequests::class,
      AddLinkHeadersForPreloadedAssets::class,
    ]);

    $middleware->alias([
      'role' => RoleMiddleware::class,
      'redirect.role' => \App\Http\Middleware\RedirectBasedOnRole::class,
    ]);

    $middleware->web(append: [
      \App\Http\Middleware\SetUserBranch::class,
      \App\Http\Middleware\LogUserActivity::class,
    ]);
  })
  ->withSchedule(function ($schedule) {
    // Backup database setiap hari Minggu jam 01:00
    $schedule->command('backup:run --only-db')
      ->weekly()
      ->sundays()
      ->at('01:00')
      ->environments(['production']);

    // Hapus backup lama setiap hari jam 02:00
    $schedule->command('backup:clean')
      ->daily()
      ->at('02:00')
      ->environments(['production']);

    // Backup harian untuk development (testing)
    $schedule->command('backup:run --only-db')
      ->daily()
      ->at('03:00')
      ->environments(['local']);
  })
  ->withExceptions(function (Exceptions $exceptions): void {
    //
  })->create();
