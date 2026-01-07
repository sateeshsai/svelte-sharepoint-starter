# Data Layer

This folder organizes data schemas, types, and mock data for the application.

## Mock Data (`local-data.ts`)

Comprehensive mock data for development with **12 diverse stories** covering:

**Content Variance:**

- Short stories (minimal content)
- Medium stories (typical length)
- Long stories (enterprise-level content)
- Rich HTML formatting (headings, lists, blockquotes, images)

**Edge Cases Tested:**

- Minimum length requirements (Story #4)
- Draft status (Story #5)
- Inactive status (Story #6)
- Empty tags (Story #8)
- Special characters & emojis (Story #12)
- Very old and very recent dates
- Multiple vs single vs zero files per story
- Varied engagement counts (0-4 per story)

**Additional Data:**

- 15 engagements (varied emojis and distributions)
- 21 files (images, videos, audio, PDFs with varied caption lengths)
- 3 users (1 admin, 2 regular)
- 4 analytics entries
- 5 error reports (covering all error types)

**Build Exclusion:**
Mock data is automatically excluded from production builds using `import.meta.env.DEV` checks.
Tree-shaking removes `local-data.ts` and `mock-data-provider.ts` (~50KB) from prod bundles.

See [02-api-integration.md](/docs/api-integration) for usage.
