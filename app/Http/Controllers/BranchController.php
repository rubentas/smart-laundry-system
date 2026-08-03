<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use Inertia\Inertia;

class BranchController extends Controller
{
  public function index()
  {
    $branches = Branch::latest()->paginate(10);

    return Inertia::render('branches/index', [
      'branches' => $branches
    ]);
  }

  public function create()
  {
    return Inertia::render('branches/create');
  }

  public function store(StoreBranchRequest $request)
  {
    Branch::create($request->validated());

    return redirect()->route('owner.branches.index')
      ->with('success', 'Cabang berhasil ditambahkan.');
  }

  public function edit(Branch $branch)
  {
    return Inertia::render('branches/edit', [
      'branch' => $branch
    ]);
  }

  public function update(UpdateBranchRequest $request, Branch $branch)
  {
    $branch->update($request->validated());

    return redirect()->route('branches.index')
      ->with('success', 'Cabang berhasil diupdate.');
  }

  public function destroy(Branch $branch)
  {
    $branch->delete();

    return redirect()->route('branches.index')
      ->with('success', 'Cabang berhasil dihapus.');
  }
}
