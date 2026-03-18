<?php

namespace Database\Factories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    private static array $feedbacks = [
        "Well-structured and easy to follow. The step-by-step format makes it accessible even for new team members. Minor improvements could be made to the reporting section.",
        "Comprehensive coverage of the key procedures. However, the language in Section 3 could be simplified for non-specialist readers.",
        "This protocol is a solid foundation, but it lacks specificity in the data validation steps. More concrete examples would help.",
        "Excellent attention to safety and ethical considerations. One of the more thorough protocols I've reviewed this quarter.",
        "The overall structure is good, but the timeline feels overly optimistic given the scope of work involved.",
        "Clear, concise, and well-referenced. I particularly appreciated the inclusion of contingency procedures for common failure scenarios.",
        "A few sections need updating to reflect the latest regulatory guidelines. Otherwise, this is a strong and usable document.",
        "Very thorough. The inclusion of participant welfare checkpoints throughout the process is commendable and sets a good standard.",
        "Needs more detail in the emergency response section. The current instructions are too vague to act on in a real situation.",
        "Good protocol overall. The flowchart in the appendix is especially helpful for new researchers getting familiar with the process.",
    ];

    public function definition(): array
    {
        return [
            'protocol_id' => \App\Models\Protocol::factory(),
            'user_id'     => \App\Models\User::factory(),
            'feedback'    => fake()->randomElement(self::$feedbacks),
        ];
    }
}
