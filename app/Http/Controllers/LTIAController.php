<?php

namespace App\Http\Controllers;

use App\Models\LuponCase;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class LTIAController extends Controller
{
    public function index()
    {
        // 1. Completion Rate (Resolved / Total)
        $totalCases = LuponCase::count();
        $resolvedCount = LuponCase::whereIn('status', ['Resolved', 'Settled'])->count();
        $completionRate = $totalCases > 0 ? round(($resolvedCount / $totalCases) * 100) : 0;

        // 2. Nominees (Staff count or Lupon member count)
        $nomineesCount = User::count(); 

        // 3. Performance Metrics
        $settlementRate = $totalCases > 0 ? round(($resolvedCount / $totalCases) * 100) : 0;
        
        // Resolution time metric (timely resolution)
        $timelyCount = LuponCase::whereIn('status', ['Resolved', 'Settled'])
            ->whereNotNull('date_filed')
            ->get()
            ->filter(function($case) {
                $filed = Carbon::parse($case->date_filed);
                $resolved = Carbon::parse($case->updated_at);
                return $filed->diffInDays($resolved) <= 15; // Within 15 days is "timely"
            })->count();
        $timelyRate = $totalCases > 0 ? round(($timelyCount / $totalCases) * 100) : 0;

        // 4. Case History (The awards table)
        // Since we don't have an Awards model yet, we'll keep this structured mock for now, 
        // but the numbers above are real database data.
        $awardHistory = [
            [ 'year' => '2024', 'category' => 'Best Lupon', 'recipient' => 'Barangay 183', 'position' => 'Collective', 'achievement' => '95% settlement rate, '.$resolvedCount.' cases resolved', 'status' => 'Awarded' ],
            [ 'year' => '2024', 'category' => 'Outstanding Chairman', 'recipient' => 'Pedro Reyes', 'position' => 'Chairman', 'achievement' => '10 years service, exemplary leadership', 'status' => 'Awarded' ],
            [ 'year' => '2023', 'category' => 'Best Mediator', 'recipient' => 'Maria Santos', 'position' => 'Secretary', 'achievement' => '45 mediated cases, 90% success rate', 'status' => 'Awarded' ],
            [ 'year' => '2023', 'category' => 'Most Efficient', 'recipient' => 'Juan Dela Cruz', 'position' => 'Lupon Member', 'achievement' => '12 day average resolution time', 'status' => 'Awarded' ],
            [ 'year' => '2022', 'category' => 'Community Service', 'recipient' => 'Rosa Garcia', 'position' => 'Lupon Member', 'achievement' => '15 community programs organized', 'status' => 'Awarded' ],
        ];

        return Inertia::render('ltia/index', [
            'stats' => [
                'completion_rate' => $completionRate,
                'nominees' => $nomineesCount,
                'total_awards' => 12, // Placeholder for awards count
                'days_remaining' => 45, // Deadline placeholder
            ],
            'metrics' => [
                'resolution_rate' => $settlementRate,
                'settlement_success' => $settlementRate,
                'community_satisfaction' => 95, 
                'timely_resolution' => $timelyRate,
                'documentation_quality' => 89,
            ],
            'awardHistory' => $awardHistory,
        ]);
    }
}
