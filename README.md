# nuxt-osdd

**nuxt-osdd** brings Open Source Driven Development to Nuxt. Organize your application into independent, composable layers — each layer with its own components, composables, pages, and configuration.

## Why OSDD?

OSDD separates your application into two top-level buckets, keeping business logic and infrastructure concerns cleanly apart.

### functional/

Domain layers that represent business concerns — `functional/users`, `functional/orders`, `functional/billing`. Each owns its own components, pages, composables, and assets.

### technical/

Infrastructure layers shared across the application — authentication adapters, API clients, database configuration. Keeps cross-cutting concerns in one place.

### Scalable by Design

Add new layers without touching existing ones. The architecture scales naturally from a small app to a large monorepo — no big-bang refactors required.

### Simplified Structure

OSDD replaces Nuxt's default layers approach which adds unnecessary depth to your project structure.

**Without OSDD** (Nuxt default):
```
/layers/functional/layers/<functionalLayer>/nuxt.config.ts
```

**With OSDD**:
```
/functional/<functionalLayer>/nuxt.config.ts
/technical/<technicalLayer>/nuxt.config.ts
```

Your layers are directly at the project root, making your codebase flatter and easier to navigate.

## Installation

```bash
npm install nuxt-osdd
```

## Features

### 1. OSDD Layer Generation

Easily create functional or technical layers with pre-configured templates.

#### Usage

```bash
npx nuxt-osdd osdd:layer <layer-name> [--technical|--functional]

# Examples - Technical layers (infrastructure)
npx nuxt-osdd osdd:layer Authentication --technical
npx nuxt-osdd osdd:layer Database --technical

# Examples - Functional layers (business)
npx nuxt-osdd osdd:layer Contracts --functional
npx nuxt-osdd osdd:layer Posts --functional

# Interactive mode
npx nuxt-osdd osdd:layer

# Display help
npx nuxt-osdd --help
```

The script will automatically create:
- A folder in `functional/` or `technical/` at the project root
- A basic `nuxt.config.ts` file
- A `README.md` file to document the layer

### 2. defineOSDDNuxtConfig

Wrap your `nuxt.config.ts` with `defineOSDDNuxtConfig` to declare OSDD layers. The `osdd` config key drives both `extends` and `typescript.tsConfig` automatically.

#### Usage

```typescript
// nuxt.config.ts
import { defineOSDDNuxtConfig } from 'nuxt-osdd';

export default defineOSDDNuxtConfig({
  osdd: {
    technical: ['Authentication', 'Permission'],  // Technical needs
    functional: ['Contracts', 'Posts'],           // Business needs
  }
});
```

## Migration to OSDD

Migrating your existing Nuxt application to OSDD is straightforward:

1. **Update your main `nuxt.config.ts`** — simply replace `defineNuxtConfig` with `defineOSDDNuxtConfig`:
```typescript
// Before
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  // your config
});

// After
import { defineOSDDNuxtConfig } from 'nuxt-osdd';

export default defineOSDDNuxtConfig({
  osdd: {
    technical: ['Authentication', 'Database'],
    functional: ['Users', 'Orders'],
  },
  // your config
});
```

2. **Create your layers** using the CLI command:
```bash
# Create technical layers
npx nuxt-osdd osdd:layer Authentication --technical
npx nuxt-osdd osdd:layer Database --technical

# Create functional layers
npx nuxt-osdd osdd:layer Users --functional
npx nuxt-osdd osdd:layer Orders --functional
```

3. **Move your code** into the appropriate layers (`functional/` or `technical/`)

That's it! Your application is now organized with OSDD.

### Import Paths

**Disclaimer:** If you don't use Nuxt's auto-import feature, you may need to update your import paths. 

OSDD provides aliases to access your layers:

```typescript
// Import from a functional layer
import { UserService } from '#functional/Users/services/UserService';

// Import from a technical layer
import { AuthAdapter } from '#technical/Authentication/adapters/AuthAdapter';
```


## License

ISC
