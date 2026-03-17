<?php

namespace App\Http\Controllers;

use App\Services\AIService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AIController extends Controller
{
    public function __construct(protected AIService $aiService) {}

    public function insights()
    {
        $insights = $this->aiService->generateInsights();

        return Inertia::render('ai/insights', [
            'insights' => $insights,
        ]);
    }

    public function refresh()
    {
        // Hapus cache dan generate baru
        Cache::forget('ai_insights');

        $insights = $this->aiService->generateInsights();

        return back()->with('success', 'Insight berhasil diperbarui');
    }
}
