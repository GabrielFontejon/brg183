<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Failed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\AuditService;

class LogFailedLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Failed $event): void
    {
        $email = $event->credentials['email'] ?? 'Unknown';
        AuditService::log(
            'LOGIN_FAILED',
            'Authentication',
            "Failed login attempt for email: {$email}",
            null,
            $event->user ? $event->user->id : null
        );
    }
}
