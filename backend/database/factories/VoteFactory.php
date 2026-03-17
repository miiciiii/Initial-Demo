<?php

namespace Database\Factories;

use App\Models\Vote;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vote>
 */
class VoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'votable_id' => \App\Models\Thread::factory(),
            'votable_type' => 'App\\Models\\Thread',
            'value' => fake()->randomElement([1, -1]),
        ];
    }
}
