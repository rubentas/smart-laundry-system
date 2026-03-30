<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\Process\Process;

class BackupController extends Controller
{
  public function index()
  {
    $backups = $this->getBackups();

    return Inertia::render('backups/index', [
      'backups' => $backups,
      'diskUsage' => $this->getDiskUsage(),
    ]);
  }

  public function create()
  {
    try {
      Artisan::call('backup:run', [
        '--only-db' => true,
        '--disable-notifications' => true,
      ]);

      $output = Artisan::output();

      return back()->with('success', 'Backup database berhasil dibuat');
    } catch (\Exception $e) {
      return back()->with('error', 'Backup gagal: ' . $e->getMessage());
    }
  }

  public function download($filename)
  {
    $path = storage_path("app/backups/{$filename}");

    if (!file_exists($path)) {
      return back()->with('error', 'File backup tidak ditemukan');
    }

    return response()->download($path);
  }

  public function delete($filename)
  {
    $path = storage_path("app/backups/{$filename}");

    if (file_exists($path)) {
      unlink($path);
      return back()->with('success', 'Backup berhasil dihapus');
    }

    return back()->with('error', 'File tidak ditemukan');
  }

  public function restore(Request $request)
  {
    $request->validate([
      'backup_file' => 'required|string'
    ]);

    $path = storage_path("app/backups/{$request->backup_file}");

    if (!file_exists($path)) {
      return back()->with('error', 'File backup tidak ditemukan');
    }

    try {
      // Extract backup file
      $extractPath = storage_path('app/backups/temp');

      if (!is_dir($extractPath)) {
        mkdir($extractPath, 0755, true);
      }

      $zip = new \ZipArchive();
      $zip->open($path);
      $zip->extractTo($extractPath);
      $zip->close();

      // Find SQL file
      $sqlFiles = glob($extractPath . '/*.sql');

      if (empty($sqlFiles)) {
        throw new \Exception('SQL file not found in backup');
      }

      // Restore database
      $dbName = config('database.connections.mysql.database');
      $username = config('database.connections.mysql.username');
      $password = config('database.connections.mysql.password');

      $command = sprintf(
        'mysql -u%s -p%s %s < %s',
        escapeshellarg($username),
        escapeshellarg($password),
        escapeshellarg($dbName),
        escapeshellarg($sqlFiles[0])
      );

      $process = Process::fromShellCommandline($command);
      $process->run();

      // Cleanup
      $this->deleteDirectory($extractPath);

      return back()->with('success', 'Database berhasil direstore');
    } catch (\Exception $e) {
      return back()->with('error', 'Restore gagal: ' . $e->getMessage());
    }
  }

  private function getBackups()
  {
    $files = glob(storage_path('app/backups/*.zip'));
    $backups = [];

    foreach ($files as $file) {
      $filename = basename($file);
      $size = filesize($file);
      $created = filemtime($file);

      $backups[] = [
        'filename' => $filename,
        'size' => $this->formatBytes($size),
        'created_at' => date('Y-m-d H:i:s', $created),
        'download_url' => route('owner.backups.download', $filename),
      ];
    }

    // Sort by date desc
    usort($backups, function ($a, $b) {
      return strtotime($b['created_at']) - strtotime($a['created_at']);
    });

    return $backups;
  }

  private function getDiskUsage()
  {
    $path = storage_path('app/backups');
    $size = 0;

    if (is_dir($path)) {
      $files = glob($path . '/*');
      foreach ($files as $file) {
        $size += filesize($file);
      }
    }

    return $this->formatBytes($size);
  }

  private function formatBytes($bytes, $precision = 2)
  {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);

    return round($bytes, $precision) . ' ' . $units[$pow];
  }

  private function deleteDirectory($dir)
  {
    if (!file_exists($dir)) {
      return true;
    }

    if (!is_dir($dir)) {
      return unlink($dir);
    }

    foreach (scandir($dir) as $item) {
      if ($item == '.' || $item == '..') {
        continue;
      }

      if (!$this->deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
        return false;
      }
    }

    return rmdir($dir);
  }
}
