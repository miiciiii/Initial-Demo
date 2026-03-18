<?php

namespace Database\Factories;

use App\Models\Protocol;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Protocol>
 */
class ProtocolFactory extends Factory
{
    private static array $titles = [
        'Standard Protocol for Handling Biological Samples in Clinical Trials',
        'Guidelines for Data Collection and Management in Medical Research',
        'Ethical Review Protocol for Human Subject Studies',
        'Laboratory Safety Protocol for Chemical Hazard Management',
        'Clinical Trial Phase II Protocol for Cardiovascular Drug Testing',
        'Protocol for Informed Consent in Pediatric Research Studies',
        'Standardized Procedure for Gene Sequencing and Analysis',
        'Data Privacy and Security Protocol for Patient Records',
        'Protocol for Remote Patient Monitoring via Wearable Devices',
        'Environmental Impact Assessment Protocol for Field Research',
        'Peer Review Protocol for Scientific Publication Submissions',
        'Protocol for Emergency Response in Research Facility Incidents',
        'Multi-Site Coordination Protocol for Collaborative Research Teams',
        'Protocol for Statistical Analysis and Reporting of Clinical Data',
        'Animal Welfare Protocol for Preclinical Drug Testing',
    ];

    private static array $contents = [
        "This protocol establishes standardized procedures to ensure the integrity, safety, and reproducibility of research activities. All participating team members are required to follow the outlined steps precisely.\n\nSection 1 — Preparation\nBefore initiating any procedure, verify that all required materials, equipment, and personnel are in place. Conduct a pre-activity briefing to confirm that team members understand their roles and responsibilities.\n\nSection 2 — Execution\nFollow each step in the prescribed order. Document deviations immediately and notify the supervising officer. All data collected must be timestamped and attributed to the responsible researcher.\n\nSection 3 — Quality Control\nConduct intermediate checks at each defined milestone. Any anomalies must be reported within 24 hours. Results must be reviewed by at least two independent team members before being recorded as final.\n\nSection 4 — Documentation and Reporting\nAll findings must be submitted through the official reporting system within 48 hours of protocol completion. Retain all supporting materials for a minimum of five years per regulatory requirements.",

        "Purpose: This protocol defines the minimum standards for conducting ethical and reproducible research in compliance with institutional and regulatory guidelines.\n\nScope: Applicable to all research activities conducted under the institution's umbrella, including partnerships and subcontracted work.\n\nStep 1 — Site Preparation\nEnsure the research environment meets all safety, equipment, and accessibility standards prior to commencing work. Log all preparatory actions in the activity ledger.\n\nStep 2 — Data Collection\nUse only approved instruments and methodologies. Calibrate all measurement tools before use. Record raw data without modification; any processed versions must be clearly labeled as such.\n\nStep 3 — Review and Validation\nAll datasets must pass the internal validation checklist before being used in analysis. Flag incomplete or inconsistent records for review.\n\nStep 4 — Archiving\nStore all protocol-related documents in the designated secure repository. Access must be logged and restricted to authorized personnel only.",

        "Introduction\nThis document serves as the formal protocol governing the collection, handling, analysis, and reporting of research data. It is designed to uphold the highest standards of scientific rigor and participant safety.\n\nBackground\nPrevious studies have highlighted the need for a unified approach to research management. This protocol was developed in response to identified gaps in current practice and incorporates recommendations from peer-reviewed literature and regulatory feedback.\n\nMethodology\nAll steps outlined herein have been validated through pilot testing. Researchers are expected to complete mandatory training before participating in any protocol-governed activity.\n\nSafety Considerations\nParticipant welfare is the primary concern throughout all phases of this protocol. Adverse events must be reported immediately. A dedicated safety officer will be present during all high-risk procedures.\n\nConclusion\nAdherence to this protocol is mandatory. Non-compliance will be investigated and may result in disciplinary action or study suspension.",
    ];

    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'title'   => fake()->randomElement(self::$titles),
            'content' => fake()->randomElement(self::$contents),
            'tags'    => fake()->randomElements(
                ['biology', 'chemistry', 'physics', 'medicine', 'engineering', 'ethics', 'data', 'research', 'clinical', 'lab'],
                fake()->numberBetween(1, 4)
            ),
        ];
    }
}
