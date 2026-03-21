<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchSessionController extends Controller
{
    public function index()
    {
        return Inertia::render('owner/select-branch', [
            'branches' => Branch::all(),
            'currentBranchId' => session('selected_branch_id'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['branch_id' => 'required|exists:branches,id']);

        session([
            'selected_branch_id' => $request->branch_id,
            'selected_branch_name' => Branch::find($request->branch_id)->name,
        ]);

        return back()->with('success', 'Cabang dipilih');
    }

    public function destroy()
    {
        session()->forget(['selected_branch_id', 'selected_branch_name']);

        return back()->with('success', 'Filter cabang direset');
    }
}
