<?php

namespace Database\Factories;

use App\Models\ReportYear;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReportYear>
 */
class ReportYearFactory extends Factory
{
    public function definition(): array
    {
        return [
            'year' => fake()->unique()->numberBetween(2020, 2035),
            'title' => null,
            'description' => fake()->sentence(),
            'status' => ReportYear::STATUS_PENDING,
            'color_theme' => fake()->randomElement(['violet', 'purple', 'indigo']),
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => ReportYear::STATUS_PUBLISHED,
            'published_at' => now(),
        ]);
    }
}
