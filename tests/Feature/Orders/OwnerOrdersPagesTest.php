<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RoleMiddleware;
use App\Models\Branch;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Service;
use App\Models\User;
use Illuminate\Auth\Middleware\Authenticate;

test('owner orders show page receives snake_case relations', function () {
    $this->withoutMiddleware([
        Authenticate::class,
        RoleMiddleware::class,
        HandleInertiaRequests::class,
    ]);

    $user = User::factory()->create();

    $branch = Branch::query()->create([
        'branch_code' => 'BR-001',
        'name' => 'Main Branch',
        'is_active' => true,
    ]);

    $customer = Customer::query()->create([
        'customer_code' => 'CUST-001',
        'name' => 'Budi',
        'is_active' => true,
    ]);

    $service = Service::query()->create([
        'service_code' => 'SRV-001',
        'name' => 'Cuci Kering',
        'unit' => 'kg',
        'base_price' => 10000,
        'estimated_days' => 1,
        'is_active' => true,
    ]);

    $order = Order::query()->create([
        'order_number' => 'ORD-20260314-0001',
        'branch_id' => $branch->id,
        'customer_id' => $customer->id,
        'cashier_id' => $user->id,
        'order_date' => now(),
        'pickup_date' => null,
        'status' => 'pending',
        'total_weight' => 2,
        'subtotal' => 20000,
        'discount' => 0,
        'tax' => 0,
        'grand_total' => 20000,
        'notes' => null,
        'is_paid' => false,
        'payment_method' => null,
    ]);

    OrderItem::query()->create([
        'order_id' => $order->id,
        'service_id' => $service->id,
        'service_name' => $service->name,
        'quantity' => 2,
        'unit' => 'kg',
        'price_per_unit' => 10000,
        'subtotal' => 20000,
        'notes' => null,
    ]);

    OrderStatusHistory::query()->create([
        'order_id' => $order->id,
        'status_from' => '',
        'status_to' => 'pending',
        'changed_by' => $user->id,
        'notes' => 'Order created',
    ]);

    $response = $this
        ->actingAs($user)
        ->withHeader('X-Inertia', 'true')
        ->get(route('orders.show', $order));

    $response->assertOk();

    $response
        ->assertJsonPath('component', 'orders/show')
        ->assertJsonPath('props.order.status', 'pending')
        ->assertJsonCount(1, 'props.order.items')
        ->assertJsonCount(1, 'props.order.status_histories');
});

test('owner orders print page receives required relations', function () {
    $this->withoutMiddleware([
        Authenticate::class,
        RoleMiddleware::class,
        HandleInertiaRequests::class,
    ]);

    $user = User::factory()->create();

    $branch = Branch::query()->create([
        'branch_code' => 'BR-002',
        'name' => 'Print Branch',
        'is_active' => true,
    ]);

    $customer = Customer::query()->create([
        'customer_code' => 'CUST-002',
        'name' => 'Siti',
        'is_active' => true,
    ]);

    $service = Service::query()->create([
        'service_code' => 'SRV-002',
        'name' => 'Cuci Lipat',
        'unit' => 'kg',
        'base_price' => 8000,
        'estimated_days' => 1,
        'is_active' => true,
    ]);

    $order = Order::query()->create([
        'order_number' => 'ORD-20260314-0002',
        'branch_id' => $branch->id,
        'customer_id' => $customer->id,
        'cashier_id' => $user->id,
        'order_date' => now(),
        'pickup_date' => null,
        'status' => 'pending',
        'total_weight' => 3,
        'subtotal' => 24000,
        'discount' => 0,
        'tax' => 0,
        'grand_total' => 24000,
        'notes' => null,
        'is_paid' => false,
        'payment_method' => null,
    ]);

    OrderItem::query()->create([
        'order_id' => $order->id,
        'service_id' => $service->id,
        'service_name' => $service->name,
        'quantity' => 3,
        'unit' => 'kg',
        'price_per_unit' => 8000,
        'subtotal' => 24000,
        'notes' => null,
    ]);

    $response = $this
        ->actingAs($user)
        ->withHeader('X-Inertia', 'true')
        ->get(route('orders.print', $order));

    $response->assertOk();

    $response
        ->assertJsonPath('component', 'orders/print')
        ->assertJsonPath('props.order.branch.name', 'Print Branch')
        ->assertJsonPath('props.order.cashier.name', $user->name)
        ->assertJsonCount(1, 'props.order.items');
});
