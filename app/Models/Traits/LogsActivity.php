<?php

namespace App\Models\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(function ($model) {
            $model->logActivity('created', null, $model->toArray());
        });

        static::updated(function ($model) {
            $model->logActivity('updated', $model->getOriginal(), $model->getChanges());
        });

        static::deleted(function ($model) {
            $model->logActivity('deleted', $model->toArray(), null);
        });
    }

    public function logActivity(string $action, ?array $oldData = null, ?array $newData = null): void
    {
        $user = Auth::user();
        ActivityLog::create([
            'user_id' => Auth::id(),
            'user_name' => $user?->name,
            'user_role' => $user?->roles->first()?->name,
            'action' => $action,
            'model_type' => \get_class($this),
            'model_id' => $this->id,
            'description' => $this->getActivityDescription($action),
            'old_data' => $oldData,
            'new_data' => $newData,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    protected function getActivityDescription($action)
    {
        $modelName = class_basename($this);

        return match ($action) {
            'created' => "Membuat {$modelName} baru: {$this->getIdentifier()}",
            'updated' => "Mengupdate {$modelName}: {$this->getIdentifier()}",
            'deleted' => "Menghapus {$modelName}: {$this->getIdentifier()}",
            default => "{$action} {$modelName}",
        };
    }

    protected function getIdentifier()
    {
        return $this->name ?? $this->title ?? $this->order_number ?? $this->code ?? "#{$this->id}";
    }
}
