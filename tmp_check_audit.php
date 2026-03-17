<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$logs = \App\Models\AuditLog::latest()->take(2)->get();
foreach($logs as $log) {
    echo "ID: {$log->id}\nACTION: {$log->action}\nMODULE: {$log->module}\nDETAILS: " . substr($log->details, 0, 150) . "\n---\n";
}
