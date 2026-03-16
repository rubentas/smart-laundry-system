<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="utf-8">
  <title>Laporan Laundry - {{ now()->format('d F Y') }}</title>
  <style>
    /* Variables */
    :root {
      --primary: #4f46e5;
      --primary-light: #eef2ff;
      --secondary: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --dark: #1e293b;
      --gray: #64748b;
      --light: #f8fafc;
      --border: #e2e8f0;
    }

    /* Reset & Base */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'DejaVu Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 11px;
      line-height: 1.6;
      color: var(--dark);
      background: white;
      padding: 20px;
    }

    /* Typography */
    h1 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    h2 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    /* Layout */
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--primary);
    }

    .header h1 {
      color: var(--dark);
      margin-bottom: 6px;
    }

    .header p {
      color: var(--gray);
      font-size: 12px;
    }

    /* Badge */
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 20px;
      font-size: 9px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .badge-pending {
      background: #f1f5f9;
      color: #475569;
    }

    .badge-washing {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-drying {
      background: #cffafe;
      color: #155e75;
    }

    .badge-ironing {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-ready {
      background: #dcfce7;
      color: #166534;
    }

    .badge-completed {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-cancelled {
      background: #fee2e2;
      color: #991b1b;
    }

    .badge-paid {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-unpaid {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 12px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--light);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 12px;
      text-align: center;
    }

    .stat-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--gray);
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 18px;
      font-weight: 700;
      line-height: 1.2;
    }

    .stat-value.primary {
      color: var(--primary);
    }

    .stat-value.success {
      color: var(--secondary);
    }

    .stat-value.warning {
      color: var(--warning);
    }

    .stat-value.danger {
      color: var(--danger);
    }

    .stat-sub {
      font-size: 10px;
      color: var(--gray);
      margin-top: 4px;
    }

    /* Section */
    .section {
      margin-bottom: 28px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--dark);
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-title span {
      font-size: 10px;
      font-weight: 400;
      color: var(--gray);
    }

    /* Table */
    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }

    th {
      background: #f1f5f9;
      color: var(--gray);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 10px;
      text-align: left;
      border: 1px solid var(--border);
    }

    td {
      padding: 10px;
      border: 1px solid var(--border);
    }

    tr:nth-child(even) {
      background: #fcfcfd;
    }

    /* Table Utilities */
    .text-left {
      text-align: left;
    }

    .text-center {
      text-align: center;
    }

    .text-right {
      text-align: right;
    }

    .font-medium {
      font-weight: 500;
    }

    .font-semibold {
      font-weight: 600;
    }

    .font-bold {
      font-weight: 700;
    }

    .text-primary {
      color: var(--primary);
    }

    .text-success {
      color: var(--secondary);
    }

    .text-warning {
      color: var(--warning);
    }

    .text-danger {
      color: var(--danger);
    }

    /* Footer */
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      text-align: center;
      font-size: 9px;
      color: var(--gray);
    }

    .footer p {
      margin-bottom: 4px;
    }

    /* Print */
    @media print {
      body {
        padding: 0;
      }

      .no-print {
        display: none;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    {{-- Header --}}
    <div class="header">
      <h1>LAPORAN TRANSAKSI LAUNDRY</h1>
      <p>{{ \Carbon\Carbon::parse($filters['start_date'])->isoFormat('DD MMMM YYYY') }} –
        {{ \Carbon\Carbon::parse($filters['end_date'])->isoFormat('DD MMMM YYYY') }}</p>
    </div>

    {{-- Stats Cards --}}
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Order</div>
        <div class="stat-value primary">{{ number_format($summary['total_orders'], 0, ',', '.') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Revenue</div>
        <div class="stat-value success">Rp {{ number_format($summary['total_revenue'], 0, ',', '.') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Rata-rata</div>
        <div class="stat-value">Rp {{ number_format($summary['average_order'], 0, ',', '.') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Berat</div>
        <div class="stat-value warning">{{ number_format($summary['total_weight'], 1, ',', '.') }} kg</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Lunas</div>
        <div class="stat-value success">{{ number_format($summary['paid_orders'], 0, ',', '.') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Belum Lunas</div>
        <div class="stat-value warning">{{ number_format($summary['unpaid_orders'], 0, ',', '.') }}</div>
      </div>
    </div>

    {{-- Revenue per Branch --}}
    @if ($byBranch->count() > 0)
      <div class="section">
        <div class="section-title">
          <span>Revenue per Cabang</span>
          <span>{{ $byBranch->count() }} cabang</span>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th width="5%">No</th>
                <th width="40%">Nama Cabang</th>
                <th width="20%" class="text-right">Total Order</th>
                <th width="35%" class="text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              @foreach ($byBranch as $index => $branch)
                <tr>
                  <td class="text-center">{{ $index + 1 }}</td>
                  <td class="font-medium">{{ $branch['branch_name'] }}</td>
                  <td class="text-right">{{ number_format($branch['total_orders'], 0, ',', '.') }}</td>
                  <td class="text-right font-semibold text-success">Rp
                    {{ number_format($branch['total_revenue'], 0, ',', '.') }}</td>
                </tr>
              @endforeach
            </tbody>
          </table>
        </div>
      </div>
    @endif

    {{-- Revenue per Status --}}
    @if ($byStatus->count() > 0)
      <div class="section">
        <div class="section-title">
          <span>Revenue per Status</span>
          <span>{{ $byStatus->count() }} status</span>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th width="5%">No</th>
                <th width="40%">Status</th>
                <th width="20%" class="text-right">Total</th>
                <th width="35%" class="text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              @foreach ($byStatus as $index => $status)
                @php
                  $badgeClass = match ($status['status']) {
                      'pending' => 'badge-pending',
                      'washing' => 'badge-washing',
                      'drying' => 'badge-drying',
                      'ironing' => 'badge-ironing',
                      'ready_pickup' => 'badge-ready',
                      'completed' => 'badge-completed',
                      'cancelled' => 'badge-cancelled',
                      default => 'badge-pending',
                  };

                  $label = match ($status['status']) {
                      'pending' => 'Pending',
                      'washing' => 'Mencuci',
                      'drying' => 'Mengering',
                      'ironing' => 'Menyetrika',
                      'ready_pickup' => 'Siap Ambil',
                      'completed' => 'Selesai',
                      'cancelled' => 'Dibatalkan',
                      default => ucfirst($status['status']),
                  };
                @endphp
                <tr>
                  <td class="text-center">{{ $index + 1 }}</td>
                  <td><span class="badge {{ $badgeClass }}">{{ $label }}</span></td>
                  <td class="text-right">{{ number_format($status['total'], 0, ',', '.') }}</td>
                  <td class="text-right font-semibold text-success">Rp
                    {{ number_format($status['revenue'], 0, ',', '.') }}</td>
                </tr>
              @endforeach
            </tbody>
          </table>
        </div>
      </div>
    @endif

    {{-- Top Services --}}
    @if ($byService->count() > 0)
      <div class="section">
        <div class="section-title">
          <span>🏆 Top 5 Layanan</span>
          <span>{{ $byService->count() }} layanan</span>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th width="5%">No</th>
                <th width="35%">Nama Layanan</th>
                <th width="15%" class="text-right">Order</th>
                <th width="15%" class="text-right">Qty</th>
                <th width="30%" class="text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              @foreach ($byService->take(5) as $index => $service)
                <tr>
                  <td class="text-center">{{ $index + 1 }}</td>
                  <td class="font-medium">{{ $service->name }}</td>
                  <td class="text-right">{{ number_format($service->total_orders, 0, ',', '.') }}x</td>
                  <td class="text-right">{{ number_format($service->total_quantity, 1, ',', '.') }}
                    {{ str_contains($service->name, 'Cuci') ? 'kg' : 'pcs' }}</td>
                  <td class="text-right font-semibold text-success">Rp
                    {{ number_format($service->revenue, 0, ',', '.') }}</td>
                </tr>
              @endforeach
            </tbody>
          </table>
        </div>
      </div>
    @endif

    {{-- Orders Detail --}}
    <div class="section">
      <div class="section-title">
        <span>📋 Detail Transaksi</span>
        <span>{{ $orders->count() }} order</span>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>No Order</th>
              <th>Tanggal</th>
              <th>Pelanggan</th>
              <th>Cabang</th>
              <th class="text-right">Berat</th>
              <th class="text-right">Total</th>
              <th class="text-center">Status</th>
              <th class="text-center">Payment</th>
            </tr>
          </thead>
          <tbody>
            @foreach ($orders->take(50) as $order)
              @php
                $statusClass = match ($order->status) {
                    'pending' => 'badge-pending',
                    'washing' => 'badge-washing',
                    'drying' => 'badge-drying',
                    'ironing' => 'badge-ironing',
                    'ready_pickup' => 'badge-ready',
                    'completed' => 'badge-completed',
                    'cancelled' => 'badge-cancelled',
                    default => 'badge-pending',
                };

                $statusLabel = match ($order->status) {
                    'pending' => 'Pending',
                    'washing' => 'Mencuci',
                    'drying' => 'Mengering',
                    'ironing' => 'Menyetrika',
                    'ready_pickup' => 'Siap Ambil',
                    'completed' => 'Selesai',
                    'cancelled' => 'Dibatalkan',
                    default => ucfirst($order->status),
                };
              @endphp
              <tr>
                <td class="font-mono font-medium">{{ $order->order_number }}</td>
                <td>{{ \Carbon\Carbon::parse($order->order_date)->format('d/m/Y') }}</td>
                <td>{{ $order->customer->name }}</td>
                <td>{{ $order->branch->name }}</td>
                <td class="text-right">{{ number_format($order->total_weight, 1, ',', '.') }} kg</td>
                <td class="text-right font-semibold text-success">Rp
                  {{ number_format($order->grand_total, 0, ',', '.') }}</td>
                <td class="text-center"><span class="badge {{ $statusClass }}">{{ $statusLabel }}</span></td>
                <td class="text-center">
                  <span class="badge {{ $order->is_paid ? 'badge-paid' : 'badge-unpaid' }}">
                    {{ $order->is_paid ? 'Lunas' : 'Belum' }}
                  </span>
                </td>
              </tr>
            @endforeach
          </tbody>
        </table>

        @if ($orders->count() > 50)
          <p style="text-align: center; color: var(--gray); font-size: 9px; margin-top: 12px;">
            Menampilkan 50 dari {{ number_format($orders->count(), 0, ',', '.') }} order
          </p>
        @endif
      </div>
    </div>

    {{-- Footer --}}
    <div class="footer">
      <p>Dicetak pada: {{ now()->isoFormat('DD MMMM YYYY HH:mm:ss') }}</p>
      <p>Smart Laundry Management System • Laporan generated automatically</p>
    </div>
  </div>
</body>

</html>
