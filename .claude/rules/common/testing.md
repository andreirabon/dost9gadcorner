# Testing Requirements

## Minimum Test Coverage: 80%

Test Types (ALL required):
1. **Unit Tests** - Individual functions, utilities, components
2. **Integration Tests** - API endpoints, database operations
3. **E2E Tests** - Critical user flows (framework chosen per language)

## Test-Driven Development

MANDATORY workflow: write the failing test first, implement the minimum to pass,
refactor, then verify coverage is still 80%+.

When a test fails, fix the implementation, not the test — unless the test itself
is wrong.

## Test Structure

Prefer Arrange-Act-Assert structure, and name tests after the behavior under
test ("returns empty array when no markets match query"), not the function name.
