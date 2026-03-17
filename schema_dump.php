<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;

$tables = ['users', 'lupon_cases', 'documents', 'form_layouts', 'audit_logs'];
$schema = [];
foreach ($tables as $t) {
    if (Schema::hasTable($t)) {
        $schema[$t] = [
            'columns' => Schema::getColumnListing($t),
            'foreign_keys' => Schema::getForeignKeys($t)
        ];
    }
}
echo json_encode($schema, JSON_PRETTY_PRINT);
