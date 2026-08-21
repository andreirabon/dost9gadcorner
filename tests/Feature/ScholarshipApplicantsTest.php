<?php

use App\Enums\UserRole;
use App\Models\ReportYear;
use App\Models\ScholarshipApplicantSummary;
use App\Models\ScholarshipProgram;
use App\Models\User;
use Database\Seeders\ReportLookupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(ReportLookupSeeder::class);
    $this->admin = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
});

test('the eight scholarship programs are seeded across both study levels', function () {
    expect(ScholarshipProgram::query()->count())->toBe(8)
        ->and(ScholarshipProgram::query()->where('level', ScholarshipProgram::LEVEL_UNDERGRADUATE)->count())->toBe(3)
        ->and(ScholarshipProgram::query()->where('level', ScholarshipProgram::LEVEL_GRADUATE)->count())->toBe(5);
});

test('admin can record applicants for a scholarship program', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => false]);
    $program = ScholarshipProgram::query()->orderBy('sort_order')->firstOrFail();

    $this->actingAs($this->admin)
        ->patch("/report-years/{$reportYear->id}/scholarship-applicants", [
            'applicants' => [
                ['scholarship_program_id' => $program->id, 'female_count' => 42, 'male_count' => 17],
            ],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('scholarship_applicant_summaries', [
        'report_year_id' => $reportYear->id,
        'scholarship_program_id' => $program->id,
        'female_count' => 42,
        'male_count' => 17,
    ]);
});

test('a locked report year rejects applicant updates', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026, 'is_locked' => true]);
    $program = ScholarshipProgram::query()->orderBy('sort_order')->firstOrFail();

    $this->actingAs($this->admin)
        ->patch("/report-years/{$reportYear->id}/scholarship-applicants", [
            'applicants' => [
                ['scholarship_program_id' => $program->id, 'female_count' => 5, 'male_count' => 5],
            ],
        ])
        ->assertForbidden();

    expect($reportYear->fresh()->scholarshipApplicantSummaries)->toBeEmpty();
});

test('applicant counts must be whole numbers that are not negative', function (mixed $female) {
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $program = ScholarshipProgram::query()->orderBy('sort_order')->firstOrFail();

    $this->actingAs($this->admin)
        ->patch("/report-years/{$reportYear->id}/scholarship-applicants", [
            'applicants' => [
                ['scholarship_program_id' => $program->id, 'female_count' => $female],
            ],
        ])
        ->assertSessionHasErrors('applicants.0.female_count');
})->with([-1, 'not-a-number', 2.5]);

test('a user without scholarship access cannot record applicants', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $program = ScholarshipProgram::query()->orderBy('sort_order')->firstOrFail();
    $outsider = User::factory()->create(['role' => UserRole::RSTL]);

    $this->actingAs($outsider)
        ->patch("/report-years/{$reportYear->id}/scholarship-applicants", [
            'applicants' => [
                ['scholarship_program_id' => $program->id, 'female_count' => 3, 'male_count' => 3],
            ],
        ])
        ->assertForbidden();

    expect($reportYear->fresh()->scholarshipApplicantSummaries)->toBeEmpty();
});

test('the edit screen offers every program, zero-filled where nothing is recorded', function () {
    $reportYear = ReportYear::factory()->create(['year' => 2026]);

    $this->actingAs($this->admin)
        ->get("/report-years/{$reportYear->id}/edit")
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('reportYear.scholarshipApplicants', 8)
            ->where('reportYear.scholarshipApplicants.0.femaleCount', 0)
            ->where('reportYear.scholarshipApplicants.0.level', ScholarshipProgram::LEVEL_UNDERGRADUATE)
            ->etc()
        );
});

test('the public report exposes applicants per program', function () {
    $reportYear = ReportYear::factory()->published()->create(['year' => 2025]);
    $program = ScholarshipProgram::query()->where('slug', 'graduate-erdt')->firstOrFail();

    ScholarshipApplicantSummary::query()->create([
        'report_year_id' => $reportYear->id,
        'scholarship_program_id' => $program->id,
        'female_count' => 12,
        'male_count' => 9,
    ]);

    $this->get(route('reports.show', $reportYear))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('year.reportData.scholarshipApplicants', 8)
            // Acronym for the chart axis, full title alongside it for the table.
            ->where('year.reportData.scholarshipApplicants.5.label', 'ERDT')
            ->where('year.reportData.scholarshipApplicants.5.fullName', 'Engineering Research and Development for Technology')
            ->where('year.reportData.scholarshipApplicants.5.female', 12)
            ->where('year.reportData.scholarshipApplicants.5.male', 9)
            ->where('year.reportData.scholarshipApplicants.5.level', ScholarshipProgram::LEVEL_GRADUATE)
            ->etc()
        );
});
