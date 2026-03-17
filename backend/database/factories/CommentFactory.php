<?php

namespace Database\Factories;

use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $comments = [
            "I completely agree with this point. We faced a similar issue in our last study and addressing it early saved us a lot of time during the analysis phase.",
            "Thanks for raising this. I'll bring it up with the principal investigator and get back to the team by end of week.",
            "This is a valid concern. The protocol should be clearer here. I'd recommend flagging it in the next review meeting.",
            "Has anyone consulted the regulatory team on this? Their input would be valuable before we make any changes.",
            "I've seen this handled two ways in other protocols — either approach could work, but we should standardize whichever one we choose.",
            "Good catch. I missed that inconsistency on my first read. We should definitely resolve it before the next submission deadline.",
            "I support this proposal. It would reduce friction for new team members and make onboarding much smoother.",
            "Not sure I fully agree here. Can you share more context or references that support this approach?",
            "This aligns with what the IRB recommended during our last review. I think we should incorporate it.",
            "We implemented something similar in our pilot study and it worked well. Happy to share our documentation as a reference.",
            "From a practical standpoint, this would add at least two extra days per cycle. Worth it, but we need to update the timeline accordingly.",
            "The ethics board will likely ask about this during the next audit. Better to address it proactively.",
        ];

        return [
            'thread_id' => \App\Models\Thread::factory(),
            'user_id' => \App\Models\User::factory(),
            'parent_id' => null,
            'body' => fake()->randomElement($comments),
        ];
    }
}
