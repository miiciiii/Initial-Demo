<?php

namespace Database\Factories;

use App\Models\Thread;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Thread>
 */
class ThreadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    private static array $titles = [
        'How should we handle missing data in the collection phase?',
        'Suggestion: Add a pre-screening step before participant enrollment',
        'Is the current timeline realistic for Phase 2 completion?',
        'Concerns about the informed consent form wording',
        'Should we include a control group in this study design?',
        'Question about equipment calibration frequency requirements',
        'Feedback on the data privacy section — needs more specifics',
        'Proposal: Adopt a digital-first documentation approach',
        'Are the current safety thresholds aligned with latest guidelines?',
        'Discussion: Expanding the protocol scope to include remote sites',
        'Clarification needed on Step 3 — contradiction with Section 2',
        'Update: IRB has requested revisions to the consent procedure',
        'How do we handle participant withdrawal after data collection?',
        'Proposal to standardize reporting templates across all teams',
        'Is there a version history available for this protocol?',
        'Debate: Should adverse events be reported within 12 or 24 hours?',
        'Request: Add a flowchart for the emergency response section',
        'New regulatory requirement may affect our current methodology',
    ];

    private static array $bodies = [
        "I've reviewed the current draft and noticed that the protocol doesn't clearly specify what to do when participant data is incomplete at the time of submission. Should we flag and hold it, or proceed with a partial record? This could significantly impact the integrity of our final dataset if not addressed early.\n\nI'd like to propose that we add a specific sub-section addressing this scenario before we move to full implementation.",

        "After reviewing similar protocols from other institutions, I believe we're missing a critical pre-screening step before participants are formally enrolled. This would help filter out ineligible candidates earlier in the process and reduce dropout rates later. Has anyone else encountered this issue in previous studies?\n\nI'd love to hear from the team before we finalize this section.",

        "The current protocol timeline assumes a best-case scenario, but given our team size and the complexity of Phase 2, I'm not confident we can meet the stated deadlines. I've done a rough breakdown of the tasks and it seems we're underestimating the data validation step by at least two weeks.\n\nCan we schedule a team meeting to revisit the timeline? I think a buffer period should be built into the schedule.",

        "I noticed a potential contradiction between the steps outlined in Section 2 and the requirements described later in Section 4. Specifically, the data format required for submission in Section 4 doesn't match what's produced by following Section 2's collection procedure.\n\nCould the protocol authors clarify which takes precedence, or update one of the sections for consistency?",

        "This is a great protocol overall, but I think the documentation requirements could be streamlined. Currently, we're asked to log the same data point in three different places. A unified digital form would reduce redundancy and errors.\n\nI'd be happy to draft a proposal for a consolidated reporting template if the team is open to it.",
    ];

    public function definition(): array
    {
        return [
            'protocol_id' => \App\Models\Protocol::factory(),
            'user_id' => \App\Models\User::factory(),
            'title' => fake()->randomElement(self::$titles),
            'body' => fake()->randomElement(self::$bodies),
            'tags' => fake()->randomElements(
                ['question', 'discussion', 'critique', 'suggestion', 'update', 'clarification'],
                fake()->numberBetween(1, 3)
            ),
        ];
    }
}
