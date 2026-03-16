<?php

namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $request;

    protected $data;

    public function __construct($request)
    {
        $this->request = $request;
        $this->data = $this->getReportData();
    }

    private function getReportData()
    {
        $query = Order::with(['customer', 'branch'])
            ->whereBetween('order_date', [$this->request->start_date, $this->request->end_date])
            ->where('status', '!=', 'cancelled');

        if ($this->request->branch_id) {
            $query->where('branch_id', $this->request->branch_id);
        }

        return $query->get();
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        return [
            'No Order',
            'Tanggal',
            'Pelanggan',
            'Layanan',
            'Total Weight (kg)',
            'Grand Total',
            'Status',
            'Payment',
        ];
    }

    public function map($order): array
    {
        return [
            $order->order_number,
            $order->order_date->format('Y-m-d'),
            $order->customer->name,
            $order->items->pluck('service.name')->join(', '),
            $order->total_weight,
            $order->grand_total,
            ucfirst(str_replace('_', ' ', $order->status)),
            $order->is_paid ? 'Paid' : 'Unpaid',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function title(): string
    {
        return 'Laporan Order';
    }
}
