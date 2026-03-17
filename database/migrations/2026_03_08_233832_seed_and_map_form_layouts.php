<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $layouts = \App\Config\FormLayouts::getAllLayouts();

        foreach ($layouts as $type => $json) {
            $formLayout = \App\Models\FormLayout::firstOrCreate(
                ['document_type' => $type],
                ['layout_json' => $json]
            );

            \App\Models\Document::where('type', $type)
                ->update(['form_layout_id' => $formLayout->id]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Empty down method as we don't necessarily want to drop seeded data
        // and form_layout_id is removed in the other migration.
    }
};
