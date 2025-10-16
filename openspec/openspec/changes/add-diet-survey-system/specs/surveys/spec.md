## ADDED Requirements

### Requirement: Diet Survey Collection
System SHALL provide an interactive multi-step survey to collect user dietary preferences, restrictions, and health goals.

#### Scenario: User completes diet survey
- **WHEN** user navigates to `/ankiety/dieta`
- **THEN** system displays step-by-step survey form
- **AND** user can navigate between steps
- **AND** progress is shown visually

#### Scenario: Survey validation
- **WHEN** user submits incomplete step
- **THEN** system shows validation errors
- **AND** prevents progression to next step
- **AND** highlights required fields

#### Scenario: Survey completion
- **WHEN** user completes all survey steps
- **THEN** system saves responses to database
- **AND** redirects to recommendations page
- **AND** sends confirmation email

### Requirement: Diet Recommendations Engine
System SHALL generate personalized diet recommendations based on survey responses.

#### Scenario: Recommendation generation
- **WHEN** user survey is complete
- **THEN** system analyzes responses
- **AND** generates tailored diet plan suggestions
- **AND** includes meal timing and portion guidance

#### Scenario: Recommendation display
- **WHEN** user views recommendations
- **THEN** system shows personalized results
- **AND** includes clear next steps (CTA)
- **AND** allows downloading PDF summary

### Requirement: Survey Data Persistence
System SHALL securely store and manage user survey responses.

#### Scenario: Data storage
- **WHEN** user submits survey
- **THEN** system stores responses in Sanity CMS
- **AND** associates data with user session
- **AND** maintains data privacy compliance

#### Scenario: Data retrieval
- **WHEN** user returns to view results
- **THEN** system retrieves previous responses
- **AND** displays consistent recommendations
- **AND** allows survey retaking if desired