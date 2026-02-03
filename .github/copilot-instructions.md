# Copilot Instructions

## Core Principles

_Fundamental development principles for modern web applications_

- **SOLID Design Patterns:** Apply Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles consistently
- **DRY (Don't Repeat Yourself):** Eliminate code duplication through abstractions, mixins, and reusable components
- **YAGNI (You Aren't Gonna Need It):** Implement features only when actually needed, avoiding over-engineering
- **KISS (Keep It Simple, Stupid):** Prioritize simplicity and clarity over cleverness
- **Progressive Enhancement:** Build applications that work without JavaScript and enhance with interactive features
- **Performance First:** Consider performance implications in every architectural decision

## Technology Stack

_Modern full-stack technology specifications_

### Backend

- **Framework:** Laravel
- **Features:**
    - Eloquent ORM with advanced query optimization and N+1 prevention
    - Service Container with automatic dependency injection
    - Modern Facades with real-time capabilities and testing support
    - Laravel Reverb for real-time WebSocket communication
    - Laravel Precognition for real-time form validation
    - Defer helpers for background task execution
    - Cache::flexible() for stale-while-revalidate patterns

### Frontend

- **Framework:** Vue 3 Options API
- **Features:**
    - defineComponent() for proper TypeScript support
    - Reactive data() function with proper typing
    - Computed properties for derived state
    - Watch options for side effects
    - Lifecycle hooks (created, mounted, beforeUnmount, unmounted)
    - Provide/inject pattern for dependency injection
    - Error boundaries with errorCaptured
    - Dynamic imports for code splitting

### Bridge

- **Framework:** Inertia.js 2.0
- **Features:**
    - SPA experience without API endpoints
    - Automatic CSRF protection
    - Form handling with validation
    - Asset versioning for cache busting
    - SSR support with Laravel
    - Progress indicators and loading states

### Styling

- **Framework:** Tailwind CSS 4
- **Approach:** Utility-first with component composition
- **Features:**
    - CSS custom properties for theming
    - Mobile-first responsive design
    - @apply directive for component abstraction
    - Dynamic class generation

## PHP Standards Recommendations (PSR)

_PHP Standards Recommendations (PSR) compliance for enterprise development_

### PSR-1: Basic Coding Standard

- **File Tags:** `<?php` opening tag only, no closing tag
- **Side Effects:** Files MUST either declare symbols OR cause side-effects, never both
- **Namespaces & Classes:** Namespaces and classes MUST follow PSR-4 autoloading
- **Class Names:** Class names MUST be in StudlyCaps (PascalCase)
- **Method Names:** Method names MUST be in camelCase
- **Constants:** Class constants MUST be in UPPER_CASE with underscore separators

### PSR-4: Autoloader

- **Namespace Structure:** Fully qualified class name must have top-level namespace
- **Directory Mapping:** Namespace prefix corresponds to base directory
- **Class Files:** Terminating class name corresponds to file name ending in .php
- **Case Sensitivity:** All characters in namespace names and class names are case-sensitive

### PSR-12: Extended Coding Style

- **Files:** PHP code MUST use only UTF-8 without BOM
- **Lines:** MUST use Unix LF line ending only
- **Keywords:** PHP keywords MUST be in lower case (true, false, null)
- **Class Structure:** Opening braces for classes MUST go on next line, closing braces on next line after body
- **Method Structure:** Opening braces for methods MUST go on next line, closing braces on next line after body
- **Control Structures:** Control structure keywords MUST have one space after, opening parentheses MUST NOT have space after
- **Properties & Methods:** Visibility MUST be declared on all properties and methods
- **Indentation:** Code MUST use 4 spaces for indenting, not tabs

### PSR-7: HTTP Message Interfaces

- **Immutability:** HTTP messages are immutable - methods return new instances
- **Streams:** Message bodies represented as streams for memory efficiency
- **URI Handling:** URIs represented as objects implementing UriInterface
- **Headers:** Header names are case-insensitive, values preserve case

### PSR-11: Container Interface

- **Service Location:** Describes interface for dependency injection containers
- **Entry Retrieval:** `get()` method retrieves entries by identifier
- **Entry Existence:** `has()` method checks if container can return entry
- **Exception Handling:** NotFoundExceptionInterface for missing entries, ContainerExceptionInterface for general errors

### PSR-15: HTTP Handlers

- **Request Handlers:** RequestHandlerInterface handles server requests and returns responses
- **Middleware:** MiddlewareInterface processes requests and delegates to handlers
- **Middleware Stack:** Middleware can be stacked to create processing pipeline

### PSR-16: Simple Cache

- **Basic Operations:** `get()`, `set()`, `delete()`, `clear()` methods for cache operations
- **Multiple Operations:** `getMultiple()`, `setMultiple()`, `deleteMultiple()` for bulk operations
- **TTL Handling:** Time-to-live values as integers (seconds) or DateInterval objects
- **Serialization:** Cache implementations handle serialization/deserialization automatically

### Laravel PSR Integration

- **PSR-4 Compliance:** Laravel follows PSR-4 autoloading with composer.json autoload section
- **PSR-7 HTTP:** Laravel HTTP kernel implements PSR-7 compatible request/response handling
- **PSR-11 Container:** Laravel service container implements PSR-11 ContainerInterface
- **PSR-15 Middleware:** Laravel middleware stack follows PSR-15 patterns
- **PSR-16 Cache:** Laravel cache implements PSR-16 SimpleCache interface

## Laravel Backend Guidelines

_Laravel specific backend development standards with PSR compliance_

### Directory Structure

- `app/Models` - Eloquent models with advanced relationships
- `app/Http/Controllers/` - Slim controllers focusing on HTTP concerns
- `app/Http/Requests/` - Form validation with custom rules
- `app/Services/` - Business logic and complex operations
- `app/Actions/` - Single-purpose action classes
- `app/DTOs/` - Data Transfer Objects for API responses
- `app/Policies/` - Authorization logic
- `app/Events/` - Domain events for decoupling
- `app/Jobs/` - Background processing with queues
- `app/Notifications/` - Multi-channel notifications

### Best Practices

#### PSR Coding Standards

- Follow PSR-12 coding style with Laravel Pint for automatic formatting
- Implement PSR-4 autoloading standards in all custom classes
- Use PSR-7 HTTP message interfaces for API development
- Leverage PSR-11 container interface patterns in service classes
- Apply PSR-15 middleware patterns for request processing
- Implement PSR-16 cache interface for consistent caching
- Ensure all PHP files use UTF-8 encoding without BOM
- Use proper visibility declarations (public, protected, private) on all methods and properties

#### Database

- Use database migrations for all schema changes
- Implement proper indexing strategies
- Use eager loading to prevent N+1 queries
- Leverage Laravel's query builder for complex queries
- Implement database connection pooling
- Use database transactions for data integrity

#### Caching

- Implement `Cache::flexible()` for stale-while-revalidate pattern
- Cache configuration, routes, and views in production
- Implement tagged caching for complex invalidation
- Use cache locks for preventing race conditions
- Follow PSR-16 SimpleCache interface patterns

#### Performance

- Implement proper optimization commands (config:cache, route:cache, view:cache, event:cache)
- Implement database query optimization with explain analysis
- Use lazy loading for relationships and eager loading to prevent N+1 queries
- Implement `Cache::flexible()` for stale-while-revalidate caching patterns
- Use parallel testing with `--parallel` flag for faster test execution

## Vue 3 Options API Guidelines

_Vue 3 Options API development standards with TypeScript_

### Component Structure

- **Definition:** Always use `defineComponent()` for proper TypeScript inference
- **Data Function:** Return reactive object properties with proper typing - `data()` returns object proxied onto component instance
- **Computed Properties:** Use for derived state with explicit return types - cached based on dependencies
- **Watchers:** Implement for side effects with `immediate`, `deep`, and `once` options
- **Methods:** Define component functionality with proper `this` context - Vue automatically binds `this`
- **Lifecycle Hooks:**
    - `beforeCreate` - Component initialization before data observation
    - `created` - After data observation setup, before DOM mounting
    - `beforeMount` - Before initial render, template compilation complete
    - `mounted` - After DOM insertion and component ready
    - `beforeUpdate` - Before reactive data changes trigger re-render
    - `updated` - After DOM updates from reactive changes
    - `beforeUnmount` - Before component unmounting, cleanup time
    - `unmounted` - After component cleanup and removal
- **Render Function:** Use `render()` option with `h()` function for programmatic rendering when needed

### Advanced Patterns

- **Provide/Inject:** Use `provide()` function and `inject` option for dependency injection
    - **Example:** `provide() { return { message: this.message } }, inject: ['message']`
    - **Notes:** Use function syntax for per-instance state access, object syntax for static data
- **Error Boundaries:** Implement `errorCaptured` lifecycle hook for component-level error handling
    - **Example:** `errorCaptured(err, instance, info) { this.handleError(err); return false; }`
    - **Notes:** Return `false` to prevent error propagation up the component tree
- **Dynamic Components:** Use dynamic imports for lazy loading large components
    - **Example:** `components: { LazyComponent: () => import('./LazyComponent.vue') }`
    - **Notes:** Enables code splitting and improves initial bundle size
- **Mixins:** Create reusable mixins in `resources/js/mixins/` for shared functionality
    - **Example:** `mixins: [validationMixin, apiClientMixin]`
    - **Notes:** Use sparingly, prefer composition patterns for better maintainability
- **Watchers with Options:** Use `watch` option with `immediate`, `deep`, and `once` flags
    - **Example:** `watch: { source: { handler(newVal) {}, immediate: true, deep: true, once: true } }`
    - **Notes:** `immediate` runs on component creation, `once` runs only on first change
- **Template Refs:** Access DOM elements using `this.$refs` in Options API
    - **Example:** `this.$refs.myInput.focus() // Access in mounted() or methods`
    - **Notes:** Available after `mounted` lifecycle, use `$nextTick` for DOM updates

### TypeScript Integration

- **Prop Validation:** Use `PropType<T>` for complex prop types with runtime validation
    - **Example:** `book: { type: Object as PropType<Book>, required: true, validator: (book: Book) => !!book.title }`
    - **Notes:** Use arrow functions for validators in TypeScript < 4.7
- **Emit Declaration:** Define `emits` with object syntax for validation and type safety
    - **Example:** `emits: { addBook: (payload: { bookName: string }) => payload.bookName.length > 0 }`
    - **Notes:** Enables runtime validation and compile-time type checking
- **Computed Types:** Explicitly annotate computed property return types for clarity
    - **Example:** `computed: { greeting(): string { return this.message + '!' }, greetingUpper: { get(): string { return this.greeting.toUpperCase() } } }`
    - **Notes:** Supports both read-only and writable computed properties
- **Method Types:** Methods automatically infer types from usage context
    - **Example:** `methods: { increment() { this.count++ }, async fetchData(): Promise<User[]> { return api.getUsers() } }`
    - **Notes:** TypeScript infers `this` context and parameter types
- **Custom Options:** Augment `ComponentCustomOptions` for plugin-provided options
    - **Example:** `declare module 'vue' { interface ComponentCustomOptions { beforeRouteEnter?(to: Route, from: Route, next: () => void): void } }`
    - **Notes:** Required for type safety with vue-router and other plugins

## Inertia.js Integration Patterns

_Inertia.js 2.0 integration best practices_

### Server-Side

- **Pattern:** Controller Responses
    - **Rule:** Always use `Inertia::render()` for page responses, never return JSON
    - **Example:** `return Inertia::render('Users/Show', ['user' => $user]);`
- **Pattern:** Shared Data
    - **Rule:** Use `HandleInertiaRequests` middleware for global data
    - **Example:** `return array_merge(parent::share($request), ['auth' => $request->user()]);`
- **Pattern:** Validation
    - **Rule:** Handle validation errors through Inertia's error bag system
    - **Example:** Form requests automatically integrate with Inertia error handling

### Client-Side

- **Pattern:** Form Handling
    - **Rule:** Use `this.$inertia` methods for form submissions with proper loading states
    - **Example:** `this.$inertia.post('/users', formData, { onSuccess: () => this.reset() })`
- **Pattern:** Navigation
    - **Rule:** Use `visit()` method for programmatic navigation with options
    - **Example:** `this.$inertia.visit('/dashboard', { preserveScroll: true })`
- **Pattern:** Asset Versioning
    - **Rule:** Implement proper asset versioning for cache busting
    - **Example:** Configure asset versioning in Inertia middleware

## TypeScript Standards

_TypeScript best practices for Vue 3 development_

### Configuration

- **Strict Mode:** true
- **Compiler Options:**
    - `noImplicitAny: true`
    - `strictNullChecks: true`
    - `strictFunctionTypes: true`
    - `noImplicitReturns: true`
    - `noImplicitThis: true`

### Type Definitions

- **Preference:** Interfaces over Types
    - **Rule:** Use interfaces for object shapes, types for unions and primitives
    - **Example:** `interface User { id: number; name: string; }` vs `type Status = 'active' | 'inactive'`
- **Preference:** Centralized Type Definitions
    - **Rule:** All interfaces should be placed inside index.d.ts for centralized type management
    - **Example:** Export all interfaces from resources/js/types/index.d.ts for consistent imports
- **Preference:** Avoid Enums
    - **Rule:** Use `const` assertions or string literal types instead of enums
    - **Example:** `const STATUSES = ['active', 'inactive'] as const; type Status = typeof STATUSES[number]`
- **Preference:** Generic Constraints
    - **Rule:** Use `extends` keyword for generic constraints and utility types
    - **Example:** `function api<T extends Record<string, unknown>>(data: T): Promise<T>`
- **Preference:** Never Use `any`
    - **Rule:** Use `unknown` when type is truly unknown, implement proper type guards
    - **Example:** `function isUser(value: unknown): value is User { return /* type guard logic */ }`

### Advanced Patterns

- Branded types for domain-specific type safety
- Template literal types for string manipulation
- Conditional types for advanced type manipulation
- Utility types: Pick, Omit, Partial, Required, Record
- Module declarations for third-party library extensions

## Naming Conventions

_Comprehensive naming standards across all layers_

### Backend (PHP)

- **Classes:** PascalCase following PSR-1 (UserController, PaymentService, OrderPolicy)
- **Methods & Variables:** camelCase following PSR-1 (getUserData, userName, processPayment)
- **Constants:** SCREAMING_SNAKE_CASE following PSR-1 (MAX_RETRY_ATTEMPTS, API_VERSION)
- **Database Tables:** plural snake_case (user_profiles, order_items, payment_methods)
- **Model Relationships:** camelCase (belongsTo: userId, hasMany: orderItems)
- **Namespaces:** PascalCase following PSR-4 (App\Services\Payment, App\Http\Controllers\Api)
- **File Structure:** One class per file, file name matches class name exactly
- **PHP Tags:** Always use `<?php` opening tag, never use closing tag `?>`
- **Encoding:** UTF-8 without BOM following PSR-12

### Frontend (JavaScript/TypeScript)

- **Variables & Functions:** camelCase (getUserData, userName, validateForm)
- **Classes & Interfaces:** PascalCase (UserService, ApiResponse, ValidationState)
- **Constants:** SCREAMING_SNAKE_CASE (API_BASE_URL, MAX_FILE_SIZE)
- **Vue Components:** PascalCase files (UserProfile.vue, OrderSummary.vue)
- **Mixins:** camelCase with 'Mixin' suffix (userDataMixin, validationMixin)
- **Types & Interfaces:** PascalCase with descriptive suffixes (UserData, ApiResponse)

### Files & Directories

- **Vue Components:** PascalCase (UserProfile.vue, OrderManagement.vue)
- **Mixins:** camelCase (userAuthMixin.ts, apiClientMixin.ts)
- **Utilities:** camelCase (formatDate.ts, validateEmail.ts)
- **Types:** camelCase (userTypes.ts, apiTypes.ts)
- **Directories:** kebab-case (user-management, order-processing, payment-gateway)

## Project Architecture

_Modern project structure and organization patterns_

### Backend Structure

- `app/Actions/` - Single-purpose action classes
- `app/DTOs/` - Data Transfer Objects
- `app/Enums/` - PHP 8.1+ enums for constants
- `app/Events/` - Domain events
- `app/Exceptions/` - Custom exception classes
- `app/Http/Controllers/` - Slim HTTP controllers
- `app/Http/Middleware/` - Custom middleware
- `app/Http/Requests/` - Form validation
- `app/Models/` - Eloquent models
- `app/Policies/` - Authorization policies
- `app/Services/` - Business logic services

### Frontend Structure

- `resources/js/components/` - Feature-based Vue components
- `resources/js/components/ui/` - Reusable UI components
- `resources/js/composables/` - Composition API utilities
- `resources/js/layouts/` - Application layouts
- `resources/js/mixins/` - Options API mixins
- `resources/js/pages/` - Inertia page components
- `resources/js/types/` - TypeScript type definitions
- `resources/js/utils/` - Pure utility functions

### Organization Principles

- Feature-based directory grouping
- Barrel exports (index.ts) for clean imports
- Single responsibility principle for files
- Consistent naming across all layers
- Clear separation of concerns

## Error Handling Strategies

_Comprehensive error handling for production applications_

### Backend Error Handling

#### Application Level

- Custom exception classes for business logic errors
- Global exception handling in Handler.php
- Contextual logging with Laravel's logger
- Proper HTTP status codes for API responses
- User-friendly error messages with technical details in logs

#### Database Level

- Transaction rollbacks for data integrity
- Retry mechanisms for transient failures
- Connection pooling error handling
- Query timeout management

### Frontend Error Handling

#### Component Level

- `errorCaptured` lifecycle hook for local error boundaries
- `try-catch` blocks in async methods and lifecycle hooks
- Proper loading and error states in UI
- Graceful degradation for failed features

#### Application Level

- Global error handler in `app.config.errorHandler`
- Centralized error reporting service
- User notification system for errors
- Retry mechanisms for API calls

## Frontend Performance Best Practices

_Comprehensive frontend performance optimization strategies for production applications_

### Core Web Vitals Optimization

#### Largest Contentful Paint (LCP)

- Optimize server response times (aim for < 200ms)
- Implement resource prioritization with `fetchpriority="high"`
- Use responsive images with proper sizing and formats (WebP, AVIF)
- Preload critical resources with `<link rel="preload">`
- Implement efficient caching strategies
- Minimize render-blocking resources

#### First Input Delay (FID) / Interaction to Next Paint (INP)

- Minimize JavaScript execution time
- Use `requestIdleCallback()` for non-critical work
- Implement code splitting to reduce main thread blocking
- Optimize event handlers and avoid long tasks
- Use web workers for heavy computations
- Implement proper debouncing and throttling

#### Cumulative Layout Shift (CLS)

- Always include size attributes on images and videos
- Reserve space for dynamic content with CSS aspect-ratio
- Avoid inserting content above existing content
- Use CSS containment for layout optimization
- Implement proper font loading strategies

### Asset Optimization

#### Images

- Use next-generation formats (WebP, AVIF) with fallbacks
- Implement responsive images with `srcset` and `sizes`
- Use lazy loading with `loading="lazy"` attribute
- Optimize image compression (aim for < 100KB for hero images)
- Implement progressive JPEG for large images
- Use CSS sprites for small icons
- Consider using SVG for simple graphics and icons

#### Fonts

- Use `font-display: swap` for web fonts
- Preload critical fonts with `<link rel="preload">`
- Implement font subset loading for reduced file sizes
- Use system fonts as fallbacks
- Consider variable fonts to reduce HTTP requests
- Implement proper font-face declarations with unicode-range

#### JavaScript & CSS

- Minify and compress all assets
- Implement tree shaking to eliminate dead code
- Use critical CSS inlining for above-the-fold content
- Defer non-critical JavaScript with `defer` attribute
- Implement module federation for micro-frontends
- Use CSS containment and content-visibility properties

### Loading Strategies

#### Resource Prioritization

- Use `fetchpriority` attribute for critical resources
- Implement resource hints (`dns-prefetch`, `preconnect`, `modulepreload`)
- Prioritize critical rendering path resources
- Use `rel="preload"` for critical assets
- Implement intelligent prefetching based on user behavior

#### Progressive Loading

- Implement above-the-fold prioritization
- Use skeleton screens for perceived performance
- Implement progressive image enhancement
- Use streaming for large datasets
- Implement infinite scrolling with virtual windowing

#### Lazy Loading

- Implement native lazy loading for images and iframes
- Use Intersection Observer API for custom lazy loading
- Implement route-based code splitting
- Lazy load non-critical JavaScript modules
- Implement progressive enhancement patterns

### Runtime Performance

#### JavaScript Optimization

- Minimize DOM manipulation and use DocumentFragment
- Implement virtual scrolling for large lists
- Use `Object.freeze()` for immutable data
- Optimize loops and reduce algorithm complexity
- Implement memoization for expensive computations
- Use `requestAnimationFrame()` for smooth animations

#### Memory Management

- Implement proper cleanup in component lifecycles
- Remove event listeners and observers on unmount
- Clear intervals and timeouts appropriately
- Avoid memory leaks with proper closure handling
- Use weak references where appropriate
- Implement object pooling for frequently created objects

#### Rendering Optimization

- Minimize layout thrashing with CSS transforms
- Avoid `will-change` property - use `transform: translateZ(0)` for GPU acceleration only when needed
- Implement composite layers for animations using transform and opacity
- Avoid forced synchronous layouts
- Use CSS Grid and Flexbox efficiently
- Implement proper z-index management
- **Modal Performance**: Use separate scroll containers with `overscroll-contain` for smooth scrolling
- **Remove Performance CSS Classes**: Avoid classes like `mobile-perf` that create unnecessary composite layers
- **Optimize Touch Handling**: Remove touch event listeners that interfere with native scrolling performance

### Bundle Optimization

#### Code Splitting

- Implement route-based code splitting
- Use dynamic imports for lazy loading
- Split vendor libraries into separate chunks
- Implement intelligent chunk splitting strategies
- Use module federation for shared dependencies

#### Tree Shaking

- Use ES6 modules for better tree shaking
- Avoid importing entire libraries when possible
- Mark side-effect-free packages in package.json
- Use dynamic imports for conditional code
- Implement proper barrel exports

#### Dependency Management

- Audit and remove unused dependencies
- Use bundle analyzers to identify large dependencies
- Consider lighter alternatives for heavy libraries
- Implement polyfill strategies based on browser support
- Use CDN for popular libraries when beneficial

### Caching Strategies

#### Browser Caching

- Implement proper Cache-Control headers
- Use ETags for cache validation
- Implement service worker caching strategies
- Use local storage and session storage efficiently
- Implement IndexedDB for large client-side data

#### CDN and Edge Caching

- Use CDN for static assets
- Implement edge-side includes (ESI)
- Use geographic distribution for global performance
- Implement proper cache invalidation strategies
- Use push/pull CDN strategies appropriately

### Network Optimization

#### HTTP/2 & HTTP/3

- Enable HTTP/2 server push for critical resources
- Implement proper multiplexing strategies
- Use HTTP/3 when available for improved performance
- Optimize connection pooling
- Implement proper header compression

#### Compression

- Enable Gzip/Brotli compression for text assets
- Implement dynamic compression for API responses
- Use compression for client-side storage
- Optimize payload sizes for mobile networks
- Implement efficient data transfer protocols

### Monitoring and Measurement

#### Performance Metrics

- Implement Real User Monitoring (RUM)
- Use Performance Observer API for detailed metrics
- Monitor Core Web Vitals continuously
- Track custom performance metrics
- Implement performance budgets

#### Tools and Automation

- Use Lighthouse for performance auditing
- Implement performance regression testing
- Use WebPageTest for detailed performance analysis
- Monitor performance in CI/CD pipelines
- Implement automated performance alerts

### Vue 3 Specific Optimizations

#### Component Optimization

- Use `v-once` for static content
- Implement proper `key` attributes for v-for
- Use `shallowRef` and `shallowReactive` when appropriate
- Implement component lazy loading with Suspense
- Use `v-memo` for expensive list rendering

#### Reactivity Optimization

- Use `markRaw()` for non-reactive data
- Implement proper computed property dependencies
- Use `readonly()` for immutable data
- Optimize watchers with proper options
- Implement efficient state management patterns

## Performance Optimization

_Production-ready performance optimization strategies_

### Backend Performance Best Practices

_Comprehensive backend performance optimization strategies for production applications_

#### Database Performance

##### Query Optimization

- Use EXPLAIN and ANALYZE to identify slow queries
- Implement proper indexing strategies (B-tree, hash, partial, composite)
- Avoid N+1 queries with eager loading (`with()` in Eloquent)
- Use database-specific query hints and optimizations
- Implement query result caching with Redis/Memcached
- Use pagination instead of loading large datasets
- Implement database connection pooling
- Optimize JOIN operations and subqueries

##### Database Architecture

- Implement read/write database splitting (master/slave)
- Use database sharding for horizontal scaling
- Implement proper connection pooling and limits
- Use database transactions efficiently with proper isolation levels
- Implement database monitoring and slow query logging
- Use stored procedures for complex operations when appropriate
- Implement proper backup and recovery strategies

##### Laravel Eloquent Optimization

- Use `select()` to limit columns retrieved
- Implement `chunk()` for processing large datasets
- Use `exists()` instead of `count()` for existence checks
- Implement proper model relationships and avoid circular references
- Use `withCount()` for counting related models efficiently
- Implement custom collection methods for complex data manipulation

#### Caching Strategies

##### Application-Level Caching

- Implement `Cache::flexible()` for stale-while-revalidate patterns
- Use tagged caching for complex invalidation strategies
- Implement cache hierarchies (L1: in-memory, L2: Redis, L3: database)
- Use cache locks to prevent cache stampedes
- Implement cache warming strategies for critical data
- Use partial page caching for dynamic content

##### Laravel Caching Optimization

- Cache configuration with `config:cache`
- Cache routes with `route:cache`
- Cache views with `view:cache`
- Cache events with `event:cache`
- Implement model caching for frequently accessed data
- Use cache tags for granular invalidation

##### Distributed Caching

- Implement Redis clustering for high availability
- Use consistent hashing for cache distribution
- Implement cache replication and failover strategies
- Monitor cache hit/miss ratios and optimize accordingly
- Use compression for large cached objects

#### Memory Management

##### PHP Memory Optimization

- Configure Opcache with proper memory limits and settings
- Implement memory-efficient data structures
- Use generators for large dataset processing
- Implement proper garbage collection strategies
- Monitor memory usage and detect memory leaks
- Use memory profiling tools (Xdebug, Blackfire)

##### Laravel Memory Optimization

- Use `chunk()` for processing large collections
- Implement proper model serialization
- Use `unset()` to free memory in long-running processes
- Implement efficient queue job processing
- Use streaming responses for large file downloads

#### Server and Infrastructure

##### PHP-FPM Optimization

- Configure proper worker processes and request limits
- Implement health checks and monitoring
- Use process recycling to prevent memory leaks
- Configure timeout settings appropriately
- Implement load balancing across multiple PHP-FPM pools

##### Web Server Optimization

- Configure Nginx/Apache for optimal performance
- Enable HTTP/2 and HTTP/3 support
- Implement proper SSL/TLS configuration
- Use compression (Gzip/Brotli) for text responses
- Configure proper caching headers
- Implement rate limiting and DDoS protection

##### Load Balancing and Scaling

- Implement horizontal scaling with load balancers
- Use auto-scaling based on metrics
- Implement session affinity when necessary
- Use CDN for static asset delivery
- Implement microservices architecture for complex applications

#### API Performance

##### Response Optimization

- Implement JSON API pagination standards
- Use HTTP status codes correctly
- Implement response compression
- Use ETags for conditional requests
- Implement proper CORS configuration
- Use API versioning strategies

##### Request Processing

- Implement request validation early in the pipeline
- Use middleware for common operations
- Implement request/response logging and monitoring
- Use async processing for heavy operations
- Implement proper error handling and logging

##### Laravel API Optimization

- Use API resources for consistent response formatting
- Implement rate limiting with Laravel's built-in throttling
- Use form request validation for input sanitization
- Implement API authentication with Laravel Sanctum/Passport
- Use queue jobs for background processing

#### Queue and Background Processing

##### Queue Optimization

- Choose appropriate queue drivers (Redis, SQS, database)
- Implement queue prioritization and batching
- Use horizon for queue monitoring and management
- Implement failed job handling and retry strategies
- Use queue workers efficiently with proper scaling

##### Job Processing

- Keep jobs small and focused
- Implement idempotent job processing
- Use job chaining and batching appropriately
- Implement proper error handling and logging
- Monitor queue performance and job processing times

#### Security Performance

##### Authentication and Authorization

- Implement efficient session management
- Use proper password hashing (bcrypt, argon2)
- Implement rate limiting for authentication endpoints
- Use efficient authorization checks with policies
- Implement proper CSRF protection without performance impact

##### Data Protection

- Implement efficient encryption/decryption strategies
- Use secure headers without performance overhead
- Implement proper input validation and sanitization
- Use secure random number generation efficiently

#### Monitoring and Profiling

##### Application Performance Monitoring (APM)

- Implement comprehensive logging strategies
- Use performance monitoring tools (New Relic, Datadog)
- Monitor key performance indicators (KPIs)
- Implement alerting for performance degradation
- Use distributed tracing for microservices

##### Laravel-Specific Monitoring

- Use Laravel Telescope for development debugging
- Implement custom metrics collection
- Monitor queue job performance
- Track database query performance
- Monitor cache performance and hit rates

##### Performance Testing

- Implement load testing with tools like Apache Bench, Artillery
- Use performance regression testing in CI/CD
- Implement synthetic monitoring
- Conduct regular performance audits
- Use chaos engineering for resilience testing

#### File and Storage Optimization

##### File System Performance

- Use appropriate file system types for different use cases
- Implement file caching strategies
- Use CDN for static file delivery
- Implement efficient file upload handling
- Use streaming for large file operations

##### Cloud Storage Integration

- Implement efficient cloud storage operations (S3, GCS)
- Use pre-signed URLs for direct uploads
- Implement proper file compression and optimization
- Use content delivery networks (CDN) effectively
- Implement backup and disaster recovery strategies

#### Laravel-Specific Optimizations

##### Artisan Command Optimization

- Use `optimize` command for production deployment
- Implement custom optimization commands
- Use `queue:work` with proper configuration
- Implement efficient maintenance mode handling

##### Service Container Optimization

- Use singleton bindings for expensive objects
- Implement efficient service provider loading
- Use deferred providers for better performance
- Implement proper dependency injection patterns

##### Event and Listener Optimization

- Use queued event listeners for heavy operations
- Implement efficient event broadcasting
- Use event discovery for better organization
- Implement proper event serialization

## Security Best Practices

_Security standards for production applications_

### Backend Security

- Input validation and sanitization at all entry points
- CSRF protection with Laravel's built-in mechanisms
- SQL injection prevention with Eloquent ORM
- XSS protection with proper output escaping
- Rate limiting for API endpoints
- Secure session management with proper cookies
- Environment-based configuration management
- Regular security updates and dependency audits

### Frontend Security

- Content Security Policy (CSP) headers
- Secure cookie configuration
- HTTPS enforcement in production
- Input validation before server submission
- Sensitive data protection in client-side code
- Proper authentication token handling
- XSS prevention in dynamic content rendering

## Development Workflow

_Modern development workflow and tooling_

### Code Quality

- **Tool:** Prettier & ESLint
    - **Purpose:** JavaScript/TypeScript formatting and linting
    - **Usage:** Enforce consistent frontend code style
- **Tool:** TypeScript Compiler
    - **Purpose:** Type checking for frontend code
    - **Usage:** Ensure type safety in Vue components
- **Tool:** Composer Normalize
    - **Purpose:** PSR-4 autoloader validation
    - **Usage:** Ensure composer.json follows PSR-4 autoloading standards

## AI Assistant Guidelines

_Specific instructions for AI-assisted development_

### Code Generation

- Provide complete, runnable code without placeholders or TODOs
- Include all necessary imports and dependencies
- Follow established project patterns and conventions
- Implement proper TypeScript types for all interfaces
- Include comprehensive error handling and edge cases
- Add meaningful comments for complex business logic
- Consider accessibility and user experience in UI components
- Ensure all PHP code follows PSR-1, PSR-4, and PSR-12 standards
- Use PSR-7 HTTP message interfaces for API endpoints
- Implement PSR-11 container patterns in service classes
- Apply PSR-15 middleware patterns for request processing
- Use PSR-16 cache interfaces for caching implementations

### Best Practices

- Suggest performance optimizations proactively
- Recommend security improvements when applicable
- Provide alternative implementation approaches
- Explain complex architectural decisions
- Reference official documentation when relevant
- Consider backward compatibility implications
- Suggest testing strategies for new features

### Development Approach

- Start with simple, working implementations
- Refactor incrementally for better architecture
- Prioritize readability and maintainability
- Use composition over inheritance patterns
- Implement proper separation of concerns
- Consider scalability in architectural decisions

## Custom Instructions

_Project-specific development instructions_

### Communication

- Begin responses with --------------------START--------------------
- End responses with --------------------END--------------------
- Provide immediate, actionable solutions without high-level explanations
- Use terse, professional communication
- Anticipate needs beyond the immediate request
- Treat developer as an expert with relevant context
- Provide actual code implementations over theoretical explanations
- Give answers immediately, explain details after if necessary

### Code Standards

- Ensure all code is production-ready and complete
- Implement comprehensive functionality without gaps
- Respect existing code style and prettier configuration
- Split complex responses into focused sections
- Provide minimal context when modifying existing code
- Strictly enforce PSR-1, PSR-4, and PSR-12 compliance in all PHP code
- Use PSR-7 HTTP message interfaces for request/response handling
- Implement PSR-11 container interface patterns for dependency injection
- Apply PSR-15 middleware patterns for request processing pipelines
- Follow PSR-16 simple cache interface for all caching operations

### Styling Standards

- All component styles MUST be centralized in `resources/css/app.css`
- NEVER use `<style scoped>` or `<style>` blocks in Vue components
- Keep only dynamic/computed inline styles (e.g., `:style` bindings) in components
- Organize CSS with clear section comments for maintainability
- Use global CSS classes instead of component-scoped styles
- Maintain consistent naming conventions for reusable style classes
- Leverage Tailwind utilities first, custom CSS only when necessary
- Document complex CSS patterns with explanatory comments

### Animation and Interaction Standards

- **ALWAYS use smooth scrolling** for navigation: `behavior: 'smooth'` in `scrollIntoView()` and scroll-related functions
- **NEVER use animations** for UI elements, modals, transitions, or any visual effects
- **Disable all Chart.js animations** with `animation: false`, `hover: { animationDuration: 0 }`, `tooltip: { animation: false }`
- **Remove Vue transitions** and CSS animations for instant responsiveness
- **Eliminate CSS keyframes, transitions, and animation properties** from all components
- **Prioritize instant UI feedback** over visual effects for optimal user experience
- **Maintain accessibility** through immediate state changes without animation delays
- **Avoid performance-impacting CSS classes** like `mobile-perf`, `will-change`, and unnecessary composite layer promotion
- **Use `overscroll-contain`** for modal content to prevent scroll chaining and improve mobile performance
- **Separate scroll containers** from fixed elements (e.g., modal headers) for optimal scrolling performance
- **Remove touch event handlers** that interfere with native scrolling unless absolutely necessary

### Workflow Integration

- Perform impact analysis after implementing changes
- Suggest proactive improvements for security and performance
- Provide necessary fixes across all affected files
- Consider robustness and error handling in all implementations
- Maintain consistency with established patterns
- **NEVER run npm commands** (build, dev, type-check) or TypeScript compiler commands
- Focus on code implementation and validation through static analysis only
- Use built-in IDE tools and linting for code verification

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to enhance the user's satisfaction building Laravel applications.

## Foundational Context
This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.3.26
- inertiajs/inertia-laravel (INERTIA) - v2
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- tightenco/ziggy (ZIGGY) - v2
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v3
- phpunit/phpunit (PHPUNIT) - v11
- @inertiajs/vue3 (INERTIA) - v2
- tailwindcss (TAILWINDCSS) - v4
- vue (VUE) - v3
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3

## Conventions
- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts
- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature tests are more important.

## Application Structure & Architecture
- Stick to existing directory structure - don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling
- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Replies
- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Documentation Files
- You must only create documentation files if explicitly requested by the user.


=== boost rules ===

## Laravel Boost
- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan
- Use the `list-artisan-commands` tool when you need to call an Artisan command to double check the available parameters.

## URLs
- Whenever you share a project URL with the user you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain / IP, and port.

## Tinker / Debugging
- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool
- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)
- Boost comes with a powerful `search-docs` tool you should use before any other approaches. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation specific for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- The 'search-docs' tool is perfect for all Laravel related packages, including Laravel, Inertia, Livewire, Filament, Tailwind, Pest, Nova, Nightwatch, etc.
- You must use this tool to search for Laravel-ecosystem documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic based queries to start. For example: `['rate limiting', 'routing rate limiting', 'routing']`.
- Do not add package names to queries - package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax
- You can and should pass multiple queries at once. The most relevant results will be returned first.

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit"
3. Quoted Phrases (Exact Position) - query="infinite scroll" - Words must be adjacent and in that order
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit"
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms


=== php rules ===

## PHP

- Always use curly braces for control structures, even if it has one line.

### Constructors
- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function __construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters.

### Type Declarations
- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Comments
- Prefer PHPDoc blocks over comments. Never use comments within the code itself unless there is something _very_ complex going on.

## PHPDoc Blocks
- Add useful array shape type definitions for arrays when appropriate.

## Enums
- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.


=== inertia-laravel/core rules ===

## Inertia Core

- Inertia.js components should be placed in the `resources/js/Pages` directory unless specified differently in the JS bundler (vite.config.js).
- Use `Inertia::render()` for server-side routing instead of traditional Blade views.
- Use `search-docs` for accurate guidance on all things Inertia.

<code-snippet lang="php" name="Inertia::render Example">
// routes/web.php example
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all()
    ]);
});
</code-snippet>


=== inertia-laravel/v2 rules ===

## Inertia v2

- Make use of all Inertia features from v1 & v2. Check the documentation before making any changes to ensure we are taking the correct approach.

### Inertia v2 New Features
- Polling
- Prefetching
- Deferred props
- Infinite scrolling using merging props and `WhenVisible`
- Lazy loading data on scroll

### Deferred Props & Empty States
- When using deferred props on the frontend, you should add a nice empty state with pulsing / animated skeleton.

### Inertia Form General Guidance
- The recommended way to build forms when using Inertia is with the `<Form>` component - a useful example is below. Use `search-docs` with a query of `form component` for guidance.
- Forms can also be built using the `useForm` helper for more programmatic control, or to follow existing conventions. Use `search-docs` with a query of `useForm helper` for guidance.
- `resetOnError`, `resetOnSuccess`, and `setDefaultsOnSuccess` are available on the `<Form>` component. Use `search-docs` with a query of 'form component resetting' for guidance.


=== laravel/core rules ===

## Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Database
- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation
- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources
- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

### Controllers & Validation
- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

### Queues
- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

### Authentication & Authorization
- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

### URL Generation
- When generating links to other pages, prefer named routes and the `route()` function.

### Configuration
- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

### Testing
- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] <name>` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

### Vite Error
- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.


=== laravel/v12 rules ===

## Laravel 12

- Use the `search-docs` tool to get version specific documentation.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

### Laravel 12 Structure
- No middleware files in `app/Http/Middleware/`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- **No app\Console\Kernel.php** - use `bootstrap/app.php` or `routes/console.php` for console configuration.
- **Commands auto-register** - files in `app/Console/Commands/` are automatically available and do not require manual registration.

### Database
- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 11 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models
- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.


=== pint/core rules ===

## Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test`, simply run `vendor/bin/pint` to fix any formatting issues.


=== pest/core rules ===

## Pest

### Testing
- If you need to verify a feature is working, write or update a Unit / Feature test.

### Pest Tests
- All tests must be written using Pest. Use `php artisan make:test --pest <name>`.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files - these are core to the application.
- Tests should test all of the happy paths, failure paths, and weird paths.
- Tests live in the `tests/Feature` and `tests/Unit` directories.
- Pest tests look and behave like this:
<code-snippet name="Basic Pest Test Example" lang="php">
it('is true', function () {
    expect(true)->toBeTrue();
});
</code-snippet>

### Running Tests
- Run the minimal number of tests using an appropriate filter before finalizing code edits.
- To run all tests: `php artisan test`.
- To run all tests in a file: `php artisan test tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --filter=testName` (recommended after making a change to a related file).
- When the tests relating to your changes are passing, ask the user if they would like to run the entire test suite to ensure everything is still passing.

### Pest Assertions
- When asserting status codes on a response, use the specific method like `assertForbidden` and `assertNotFound` instead of using `assertStatus(403)` or similar, e.g.:
<code-snippet name="Pest Example Asserting postJson Response" lang="php">
it('returns all', function () {
    $response = $this->postJson('/api/docs', []);

    $response->assertSuccessful();
});
</code-snippet>

### Mocking
- Mocking can be very helpful when appropriate.
- When mocking, you can use the `Pest\Laravel\mock` Pest function, but always import it via `use function Pest\Laravel\mock;` before using it. Alternatively, you can use `$this->mock()` if existing tests do.
- You can also create partial mocks using the same import or self method.

### Datasets
- Use datasets in Pest to simplify tests which have a lot of duplicated data. This is often the case when testing validation rules, so consider going with this solution when writing tests for validation rules.

<code-snippet name="Pest Dataset Example" lang="php">
it('has emails', function (string $email) {
    expect($email)->not->toBeEmpty();
})->with([
    'james' => 'james@laravel.com',
    'taylor' => 'taylor@laravel.com',
]);
</code-snippet>


=== inertia-vue/core rules ===

## Inertia + Vue

- Vue components must have a single root element.
- Use `router.visit()` or `<Link>` for navigation instead of traditional links.

<code-snippet name="Inertia Client Navigation" lang="vue">

    import { Link } from '@inertiajs/vue3'
    <Link href="/">Home</Link>

</code-snippet>


=== inertia-vue/v2/forms rules ===

## Inertia + Vue Forms

<code-snippet name="`<Form>` Component Example" lang="vue">

<Form
    action="/users"
    method="post"
    #default="{
        errors,
        hasErrors,
        processing,
        progress,
        wasSuccessful,
        recentlySuccessful,
        setError,
        clearErrors,
        resetAndClearErrors,
        defaults,
        isDirty,
        reset,
        submit,
  }"
>
    <input type="text" name="name" />

    <div v-if="errors.name">
        {{ errors.name }}
    </div>

    <button type="submit" :disabled="processing">
        {{ processing ? 'Creating...' : 'Create User' }}
    </button>

    <div v-if="wasSuccessful">User created successfully!</div>
</Form>

</code-snippet>


=== tailwindcss/core rules ===

## Tailwind Core

- Use Tailwind CSS classes to style HTML, check and use existing tailwind conventions within the project before writing your own.
- Offer to extract repeated patterns into components that match the project's conventions (i.e. Blade, JSX, Vue, etc..)
- Think through class placement, order, priority, and defaults - remove redundant classes, add classes to parent or child carefully to limit repetition, group elements logically
- You can use the `search-docs` tool to get exact examples from the official documentation when needed.

### Spacing
- When listing items, use gap utilities for spacing, don't use margins.

    <code-snippet name="Valid Flex Gap Spacing Example" lang="html">
        <div class="flex gap-8">
            <div>Superior</div>
            <div>Michigan</div>
            <div>Erie</div>
        </div>
    </code-snippet>


### Dark Mode
- If existing pages and components support dark mode, new pages and components must support dark mode in a similar way, typically using `dark:`.


=== tailwindcss/v4 rules ===

## Tailwind 4

- Always use Tailwind CSS v4 - do not use the deprecated utilities.
- `corePlugins` is not supported in Tailwind v4.
- In Tailwind v4, configuration is CSS-first using the `@theme` directive — no separate `tailwind.config.js` file is needed.
<code-snippet name="Extending Theme in CSS" lang="css">
@theme {
  --color-brand: oklch(0.72 0.11 178);
}
</code-snippet>

- In Tailwind v4, you import Tailwind using a regular CSS `@import` statement, not using the `@tailwind` directives used in v3:

<code-snippet name="Tailwind v4 Import Tailwind Diff" lang="diff">
   - @tailwind base;
   - @tailwind components;
   - @tailwind utilities;
   + @import "tailwindcss";
</code-snippet>


### Replaced Utilities
- Tailwind v4 removed deprecated utilities. Do not use the deprecated option - use the replacement.
- Opacity values are still numeric.

| Deprecated |	Replacement |
|------------+--------------|
| bg-opacity-* | bg-black/* |
| text-opacity-* | text-black/* |
| border-opacity-* | border-black/* |
| divide-opacity-* | divide-black/* |
| ring-opacity-* | ring-black/* |
| placeholder-opacity-* | placeholder-black/* |
| flex-shrink-* | shrink-* |
| flex-grow-* | grow-* |
| overflow-ellipsis | text-ellipsis |
| decoration-slice | box-decoration-slice |
| decoration-clone | box-decoration-clone |


=== tests rules ===

## Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test` with a specific filename or filter.
</laravel-boost-guidelines>
