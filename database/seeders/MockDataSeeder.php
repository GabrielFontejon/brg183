<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\LuponCase;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MockDataSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('en_PH');
        $user = User::first();
        if (! $user) {
            $user = User::factory()->create();
        }

        // Map the 22 form types precisely to the 22 filenames in `resources/forms`
        $formNamesMap = [
            'complaint' => 'KP Form No. 7 – Formal complaint filing',
            'summons' => 'KP Form No. 9 – Official notice to appear',
            'amicable_settlement' => 'KP Form No. 16 – Agreement between parties',
            'arbitration_award' => 'KP Form No. 15 – Decision by Pangkat/Chairman',
            'repudiation' => 'KP Form No. 17 – Rejection of settlement',
            'affidavit_desistance' => 'Statement to desist from complaint',
            'affidavit_withdrawal' => 'Statement to withdraw complaint',
            'hearing_conciliation' => 'Notice for Conciliation Proceedings',
            'hearing_mediation' => 'Notice for Mediation Proceedings',
            'hearing_failure_appear' => 'Failure to appear at hearing',
            'hearing_failure_appear_counterclaim' => 'Failure to appear – Counterclaim',
            'cert_file_action' => 'Authorization to file action',
            'cert_file_action_court' => 'Authorization for court filing',
            'cert_bar_action' => 'Barring future action',
            'cert_bar_counterclaim' => 'Barring future counterclaim',
            'motion_execution' => 'Request for enforcement of settlement/award',
            'notice_execution' => 'Notice regarding execution of award',
            'notice_constitution' => 'Official notice on Pangkat formation',
            'notice_chosen_member' => 'Notice to individual Pangkat members',
            'officers_return' => 'Record of summons or notice service',
            'letter_of_demand' => 'Formal demand for action or payment',
            'katunayan_pagkakasundo' => 'Official tagalog agreement certificate',
        ];

        $forms = array_keys($formNamesMap);

        $documentsToCreate = [];
        
        // Let's force some counts to match the user's request:
        // Summons: 3
        for ($i = 0; $i < 3; $i++) $documentsToCreate[] = 'summons';
        
        // Settlements: 1
        $documentsToCreate[] = 'amicable_settlement';
        
        // Certificates: 6
        for ($i = 0; $i < 6; $i++) {
            $documentsToCreate[] = $faker->randomElement(['cert_file_action_court', 'cert_bar_action', 'cert_bar_counterclaim']);
        }
        
        // The rest are other types (Complaints, Notices, others)
        while (count($documentsToCreate) < 50) {
            $documentsToCreate[] = $faker->randomElement([
                'complaint', 'hearing_conciliation', 'hearing_mediation', 
                'hearing_failure_appear', 'motion_execution', 'officers_return', 'letter_of_demand'
            ]);
        }

        shuffle($documentsToCreate);

        DB::beginTransaction();

        try {
            // Truncate existing mock data to cleanly recreate.
            LuponCase::query()->forceDelete();
            Document::query()->delete(); // Documents don't have soft deletes, but just in case

            // Generate 50 Cases
            for ($i = 0; $i < 50; $i++) {
                $caseNo = '26-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT);
                $complainant = $faker->name();
                $respondent = $faker->name();
                
                // Pick a form name for title randomness
                $randomType = $faker->randomElement($forms);
                $mockName = $formNamesMap[$randomType];

                // Distribution of dates
                if ($i < 15) {
                    $dateFiled = $faker->dateTimeBetween('2026-01-01', '2026-01-31');
                } elseif ($i < 30) {
                    $dateFiled = $faker->dateTimeBetween('2026-02-01', '2026-02-28');
                } else {
                    $dateFiled = $faker->dateTimeBetween('2026-03-01', 'now');
                }

                $isSameMonth = ($dateFiled->format('Y-m') === date('Y-m'));

                $status = 'Pending';
                if ($i < 15) {
                    $status = 'Resolved';
                } elseif ($i < 25) {
                    $status = 'Pending';
                } elseif ($i < 35) {
                    $status = 'Mediation';
                } elseif ($i < 43) {
                    $status = 'Dismissed';
                } else {
                    $status = 'Certified';
                }

                $case = LuponCase::create([
                    'case_number' => $caseNo,
                    'title' => $mockName,
                    'nature_of_case' => $mockName,
                    'complainant' => $complainant,
                    'respondent' => $respondent,
                    'status' => $status,
                    'date_filed' => $dateFiled->format('Y-m-d'),
                    'complaint_narrative' => 'This case pertains to a '.$mockName.'. '.$faker->paragraph(),
                    'created_by' => $user->id,
                    'deleted_at' => $isSameMonth ? null : now(),
                ]);

                // Create document records for ALL 50 cases
                $formType = $documentsToCreate[$i];
                Document::create([
                    'case_id' => $case->id,
                    'type' => $formType,
                    'content' => [
                        'complainant' => $case->complainant,
                        'respondent' => $case->respondent,
                        'case_no' => $case->case_number,
                        'body_text' => $faker->paragraph(),
                    ],
                    'status' => $faker->randomElement(['draft', 'completed', 'signed']),
                    'issued_at' => $faker->dateTimeBetween('-1 month', 'now'),
                    'created_by' => $user->id,
                ]);
            }

            // Seed one custom template to make 'Total Documents' (Templates) count exactly 15
            Document::create([
                'case_id' => null,
                'type' => 'custom_form',
                'content' => [
                    'title' => 'Sample Lupon Application',
                    'description' => 'A custom built form for testing',
                    'icon_name' => 'FileSignature',
                    'fields' => []
                ],
                'status' => 'completed',
                'created_by' => $user->id,
            ]);

            DB::commit();
            $this->command->info('Successfully generated 50 mock documents and 1 custom template.');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error seeding: '.$e->getMessage());
        }
    }
}
