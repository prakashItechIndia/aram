# @shared

Shared package for assets, OpenAPI-generated API clients, and common utilities used across multiple iCaptur applications.

## Purpose

This package is designed to be a lightweight shared library containing only:

1. **Assets** - Images, icons, and CSS files shared across apps
2. **OpenAPI Clients** - Auto-generated API clients for SSO and Experience APIs
3. **Common Utilities** - Shared hooks, utilities, services, and providers

## Structure

```
src/
├── _api/              # OpenAPI generated clients
│   ├── experience/    # Experience/Billing API client
│   └── sso/          # SSO API client
├── assets/            # Shared assets (images, icons, CSS)
│   ├── css/
│   └── icons/
├── common/            # Common API clients and utilities
│   ├── api-error-guard.ts
│   ├── experience-api-client.ts
│   ├── sso-api-client.ts
│   └── locales/      # i18n translations
├── hooks/             # Shared React hooks
│   ├── usePaginationWithReset.ts
│   ├── useSorting.ts
│   └── ui/
├── lib/               # Utility libraries
│   ├── date-helper.ts
│   ├── helper.ts
│   ├── image-validator.ts
│   ├── query-client.tsx
│   ├── react-query-config.ts
│   ├── storage.ts
│   └── utils.ts
├── providers/         # React providers
│   └── LanguageProvider.tsx
├── services/          # Shared services
│   └── centralizedTokenRefresh.ts
└── utils/             # Utility functions
    └── secureTokenStorage.ts
```

## Installation

This is a private package within the monorepo. It's automatically available to all apps via the workspace configuration.

## Usage

### Importing Assets

```tsx
import iCapturLogo from '@shared/assets/icons/brandLogo.png';
import emblaStyles from '@shared/assets/css/embla.css';
```

### Using OpenAPI Clients

```tsx
import { ExperienceApi, SsoApi } from '@shared/_api';

// Use the generated API clients
const experienceApi = new ExperienceApi();
const ssoApi = new SsoApi();
```

### Using Common Utilities

```tsx
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';
import { usePaginationWithReset, useSorting } from '@shared/hooks';
import { createQueryClient } from '@shared/lib/react-query-config';
```

### Using Providers

```tsx
import { LanguageProvider } from '@shared/providers';

<LanguageProvider>
  <App />
</LanguageProvider>
```

## API Client Generation

The OpenAPI clients are auto-generated from the API specifications:

```bash
# Generate SSO API client
pnpm generate-api:sso

# Generate Experience API client
pnpm generate-api:experience

# Generate all API clients
pnpm generate-api:all
```

## Exports

The package exports the following:

- `@shared` - Main exports (utilities, hooks, types)
- `@shared/_api` - OpenAPI generated clients
- `@shared/hooks` - React hooks
- `@shared/providers` - React providers
- `@shared/styles` - CSS styles (if any)

## Development

### Building

```bash
pnpm build
```

This compiles TypeScript to the `lib/` directory.

### Linting

```bash
pnpm lint
pnpm lint:fix
```

## Notes

- This package should **NOT** contain app-specific configurations (like Tailwind, PostCSS, etc.)
- This package should **NOT** contain UI components (those belong in individual apps or a separate UI package)
- Keep dependencies minimal - only include what's truly shared across apps
- All exports should be properly typed with TypeScript

## License

Proprietary - iTech Solutions
