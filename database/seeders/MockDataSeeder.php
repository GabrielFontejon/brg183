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
        foreach ($forms as $form) {
            $documentsToCreate[] = $form; // Ensures all 22 are used
        }

        while (count($documentsToCreate) < 50) {
            $documentsToCreate[] = $faker->randomElement($forms); // Randomize the rest up to 50
        }

        shuffle($documentsToCreate);

        DB::beginTransaction();

        try {
            // Truncate existing mock data to cleanly recreate.
            LuponCase::query()->forceDelete();
            Document::query()->delete(); // Documents don't have soft deletes, but just in case

            foreach ($documentsToCreate as $index => $formType) {
                $caseNo = '2026-'.str_pad($faker->unique()->numberBetween(1000, 9999), 4, '0', STR_PAD_LEFT);
                $complainant = $faker->name();
                $respondent = $faker->name();
                $mockName = $formNamesMap[$formType];

                // Guarantee distribution across Jan, Feb, and March
                if ($index < 15) {
                    // Approximately 15 cases in January
                    $dateFiled = $faker->dateTimeBetween('2026-01-01', '2026-01-31');
                } elseif ($index < 30) {
                    // Approximately 15 cases in February
                    $dateFiled = $faker->dateTimeBetween('2026-02-01', '2026-02-28');
                } else {
                    // The rest (20 cases) in March
                    $dateFiled = $faker->dateTimeBetween('2026-03-01', 'now');
                }

                $isSameMonth = ($dateFiled->format('Y-m') === date('Y-m'));

                $case = LuponCase::create([
                    'case_number' => $caseNo,
                    'title' => $mockName,
                    'nature_of_case' => $mockName,
                    'complainant' => $complainant,
                    'respondent' => $respondent,
                    'status' => $faker->randomElement(['Pending', 'Resolved', 'Mediation', 'Dismissed', 'Certified']),
                    'date_filed' => $dateFiled->format('Y-m-d'),
                    'complaint_narrative' => 'This case pertains to a '.$mockName.'. '.$faker->paragraph(),
                    'created_by' => $user->id,
                    'deleted_at' => $isSameMonth ? null : now(), // Automatically archive if not in the current month (March)
                ]);

                $content = [
                    'complainant' => $case->complainant,
                    'respondent' => $case->respondent,
                    'case_no' => $case->case_number,
                    'made_this_1' => $faker->city,
                    'made_this_2' => 'Province of '.$faker->lastName,
                    'made_this_3' => 'Philippines',
                    'made_this_day' => (string) $faker->numberBetween(1, 28),
                    'made_this_month' => $faker->monthName,
                    'year' => '2026',
                    'body_text' => $faker->paragraph(),
                ];

                Document::create([
                    'case_id' => $case->id,
                    'type' => $formType,
                    'content' => $content,
                    'file_path' => null, // Assuming it's nullable
                    'status' => $faker->randomElement(['draft', 'completed', 'signed']),
                    'issued_at' => $faker->dateTimeBetween('-1 month', 'now'),
                    'created_by' => $user->id,
                ]);
            }

            DB::commit();
            $this->command->info('Successfully generated 50 mock documents. The 22 resources/forms files are now precisely used as the mock data names.');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error seeding: '.$e->getMessage());
        }
    }
}
