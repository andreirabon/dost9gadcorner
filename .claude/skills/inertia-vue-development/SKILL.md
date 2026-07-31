---
name: inertia-vue-development
description: "Develops Inertia.js v2 Vue client-side applications using the Options API. Activates when creating Vue pages, forms, or navigation; using <Link>, <Form>, useForm, or router; working with deferred props, prefetching, or polling; or when user mentions Vue with Inertia, Vue pages, Vue forms, or Vue navigation."
license: MIT
metadata:
  author: laravel
---

# Inertia Vue Development

## When to Apply

Activate this skill when:

- Creating or modifying Vue page components for Inertia
- Working with forms in Vue (using `<Form>` or `useForm`)
- Implementing client-side navigation with `<Link>` or `router`
- Using v2 features: deferred props, prefetching, WhenVisible, InfiniteScroll, once props, flash data, or polling
- Building Vue-specific features with the Inertia protocol

> **House rule: Options API only.** Components use `<script>` with `export default defineComponent({ ... })`. No `<script setup>`, no `setup()`, no `defineProps`/`defineEmits` macros.

## Documentation

Use `search-docs` for detailed Inertia v2 Vue patterns and documentation.

## Options API Access to Inertia

The Inertia Vue 3 plugin registers global properties, so no imports are needed for these:

| Global | What it is |
|--------|-----------|
| `this.$inertia` | The `router` object — `visit`, `get`, `post`, `reload`, `poll`, `prefetch` |
| `this.$page` | The current page object — `props`, `url`, `component`, `version` |

Shared props are `this.$page.props` (e.g. `this.$page.props.auth.user`), which is how you read flash data and the authenticated user.

`useForm` is a plain factory — it uses `watch` internally but no lifecycle hooks, so calling it from `data()` is safe and is the standard Options API pattern.

## Basic Usage

### Page Components Location

Vue page components should be placed in the `resources/js/pages` directory.

### Page Component Structure

Important: Vue components must have a single root element.

<!-- Basic Vue Page Component -->
```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'UsersIndex',

    props: {
        users: { type: Array, default: () => [] },
    },
})
</script>

<template>
    <div>
        <h1>Users</h1>
        <ul>
            <li v-for="user in users" :key="user.id">
                {{ user.name }}
            </li>
        </ul>
    </div>
</template>
```

Inertia page props arrive as normal component props — declare them in `props` with a `type` and a factory `default` for arrays and objects.

## Client-Side Navigation

### Basic Link Component

Use `<Link>` for client-side navigation instead of traditional `<a>` tags:

<!-- Inertia Vue Navigation -->
```vue
<script>
import { defineComponent } from 'vue'
import { Link } from '@inertiajs/vue3'

export default defineComponent({
    name: 'MainNav',

    components: { Link },

    props: {
        user: { type: Object, required: true },
    },
})
</script>

<template>
    <div>
        <Link href="/">Home</Link>
        <Link href="/users">Users</Link>
        <Link :href="`/users/${user.id}`">View User</Link>
    </div>
</template>
```

Imported components must be registered in the `components` option — there is no auto-registration outside `<script setup>`.

### Link with Method

<!-- Link with POST Method -->
```vue
<script>
import { defineComponent } from 'vue'
import { Link } from '@inertiajs/vue3'

export default defineComponent({
    name: 'LogoutButton',
    components: { Link },
})
</script>

<template>
    <Link href="/logout" method="post" as="button">
        Logout
    </Link>
</template>
```

### Prefetching

Prefetch pages to improve perceived performance:

<!-- Prefetch on Hover -->
```vue
<script>
import { defineComponent } from 'vue'
import { Link } from '@inertiajs/vue3'

export default defineComponent({
    name: 'UsersLink',
    components: { Link },
})
</script>

<template>
    <Link href="/users" prefetch>
        Users
    </Link>
</template>
```

### Programmatic Navigation

Use `this.$inertia` — no import required.

<!-- Router Visit -->
```vue
<script>
import { defineComponent } from 'vue'
import { Link } from '@inertiajs/vue3'

export default defineComponent({
    name: 'UserActions',

    components: { Link },

    methods: {
        handleClick() {
            this.$inertia.visit('/users')
        },

        createUser() {
            this.$inertia.visit('/users', {
                method: 'post',
                data: { name: 'John' },
                onSuccess: () => console.log('Done'),
            })
        },
    },
})
</script>

<template>
    <div>
        <button type="button" @click="handleClick">Users</button>
        <Link href="/logout" method="post" as="button">Logout</Link>
    </div>
</template>
```

Outside a component (a store action, a plain module), import `router` directly: `import { router } from '@inertiajs/vue3'`.

## Form Handling

### Form Component (Recommended)

The recommended way to build forms is with the `<Form>` component. It is a renderless component driven entirely by its scoped slot, so the Options API version is identical apart from registration:

<!-- Form Component Example -->
```vue
<script>
import { defineComponent } from 'vue'
import { Form } from '@inertiajs/vue3'

export default defineComponent({
    name: 'CreateUser',
    components: { Form },
})
</script>

<template>
    <Form action="/users" method="post" #default="{ errors, processing, wasSuccessful }">
        <input type="text" name="name" />
        <div v-if="errors.name">{{ errors.name }}</div>

        <input type="email" name="email" />
        <div v-if="errors.email">{{ errors.email }}</div>

        <button type="submit" :disabled="processing">
            {{ processing ? 'Creating...' : 'Create User' }}
        </button>

        <div v-if="wasSuccessful">User created!</div>
    </Form>
</template>
```

### Form Component With All Props

<!-- Form Component Full Example -->
```vue
<script>
import { defineComponent } from 'vue'
import { Form } from '@inertiajs/vue3'

export default defineComponent({
    name: 'UserForm',
    components: { Form },
})
</script>

<template>
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
            submit
        }"
    >
        <input type="text" name="name" :value="defaults.name" />
        <div v-if="errors.name">{{ errors.name }}</div>

        <button type="submit" :disabled="processing">
            {{ processing ? 'Saving...' : 'Save' }}
        </button>

        <progress v-if="progress" :value="progress.percentage" max="100">
            {{ progress.percentage }}%
        </progress>

        <div v-if="wasSuccessful">Saved!</div>
    </Form>
</template>
```

### Form Component Reset Props

The `<Form>` component supports automatic resetting:

- `resetOnError` - Reset form data when the request fails
- `resetOnSuccess` - Reset form data when the request succeeds
- `setDefaultsOnSuccess` - Update default values on success

Use the `search-docs` tool with a query of `form component resetting` for detailed guidance.

<!-- Form with Reset Props -->
```vue
<script>
import { defineComponent } from 'vue'
import { Form } from '@inertiajs/vue3'

export default defineComponent({
    name: 'ResettingUserForm',
    components: { Form },
})
</script>

<template>
    <Form
        action="/users"
        method="post"
        reset-on-success
        set-defaults-on-success
        #default="{ errors, processing, wasSuccessful }"
    >
        <input type="text" name="name" />
        <div v-if="errors.name">{{ errors.name }}</div>

        <button type="submit" :disabled="processing">
            Submit
        </button>
    </Form>
</template>
```

Forms can also be built using the `useForm` helper for more programmatic control. Use the `search-docs` tool with a query of `useForm helper` for guidance.

### `useForm` in the Options API

For more programmatic control or to follow existing conventions, create the form in `data()`. `useForm` returns a reactive object, so it lives in `data()` exactly like any other state.

<!-- useForm in data() -->
```vue
<script>
import { defineComponent } from 'vue'
import { useForm } from '@inertiajs/vue3'

export default defineComponent({
    name: 'RegisterUser',

    data() {
        return {
            form: useForm({
                name: '',
                email: '',
                password: '',
            }),
        }
    },

    methods: {
        submit() {
            this.form.post('/users', {
                onSuccess: () => this.form.reset('password'),
            })
        },
    },
})
</script>

<template>
    <form @submit.prevent="submit">
        <input type="text" v-model="form.name" />
        <div v-if="form.errors.name">{{ form.errors.name }}</div>

        <input type="email" v-model="form.email" />
        <div v-if="form.errors.email">{{ form.errors.email }}</div>

        <input type="password" v-model="form.password" />
        <div v-if="form.errors.password">{{ form.errors.password }}</div>

        <button type="submit" :disabled="form.processing">
            Create User
        </button>
    </form>
</template>
```

To seed a form from page props, reference `this.$props` inside `data()` — `data()` runs after props are resolved:

```js
props: {
    user: { type: Object, required: true },
},

data() {
    return {
        form: useForm({
            name: this.user.name,
            email: this.user.email,
        }),
    }
},
```

## Inertia v2 Features

### Deferred Props

Use deferred props to load data after initial page render:

<!-- Deferred Props with Empty State -->
```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'UsersDeferred',

    props: {
        users: { type: Array, default: null },
    },
})
</script>

<template>
    <div>
        <h1>Users</h1>
        <div v-if="!users" class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <ul v-else>
            <li v-for="user in users" :key="user.id">
                {{ user.name }}
            </li>
        </ul>
    </div>
</template>
```

A deferred prop is `undefined` until it arrives, so declare it `default: null` (never `default: () => []`) — otherwise the loading state is unreachable.

### Polling

`this.$inertia.poll(interval, requestOptions, options)` returns `{ start, stop, destroy }`. In the Options API you own the lifecycle: start in `mounted`, `destroy` in `beforeUnmount`. It still throttles when the tab is inactive.

<!-- Basic Polling -->
```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Dashboard',

    props: {
        stats: { type: Object, required: true },
    },

    data() {
        return {
            poll: null,
        }
    },

    mounted() {
        this.poll = this.$inertia.poll(5000, {}, { autoStart: false })
        this.poll.start()
    },

    beforeUnmount() {
        this.poll?.destroy()
    },
})
</script>

<template>
    <div>
        <h1>Dashboard</h1>
        <div>Active Users: {{ stats.activeUsers }}</div>
    </div>
</template>
```

Declare `poll` in `data()` so it exists on the instance, but create it in `mounted` — `data()` runs on the server during SSR, where you do not want a polling interval. Wrap it in `markRaw()` if you are on TypeScript and want to avoid proxying the controller object.

<!-- Polling With Request Options and Manual Control -->
```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'DashboardManualPoll',

    props: {
        stats: { type: Object, required: true },
    },

    data() {
        return {
            poll: null,
        }
    },

    mounted() {
        this.poll = this.$inertia.poll(5000, {
            only: ['stats'],
            onStart() {
                console.log('Polling request started')
            },
            onFinish() {
                console.log('Polling request finished')
            },
        }, {
            autoStart: false,
            keepAlive: true,
        })
    },

    beforeUnmount() {
        this.poll?.destroy()
    },

    methods: {
        start() {
            this.poll?.start()
        },
        stop() {
            this.poll?.stop()
        },
    },
})
</script>

<template>
    <div>
        <h1>Dashboard</h1>
        <div>Active Users: {{ stats.activeUsers }}</div>
        <button type="button" @click="start">Start Polling</button>
        <button type="button" @click="stop">Stop Polling</button>
    </div>
</template>
```

- `autoStart` (default `true`) — `false` means you call `start()` yourself. Always pass `autoStart: false` when creating the poll in `mounted` and starting it explicitly, so the intent is visible.
- `keepAlive` (default `false`) — set to `true` to prevent throttling when the browser tab is inactive.
- **Always call `destroy()` in `beforeUnmount`.** `usePoll` did this for you; the imperative API does not.

### WhenVisible

Lazy-load a prop when an element scrolls into view. Useful for deferring expensive data that sits below the fold:

<!-- WhenVisible Example -->
```vue
<script>
import { defineComponent } from 'vue'
import { WhenVisible } from '@inertiajs/vue3'

export default defineComponent({
    name: 'DashboardStats',

    components: { WhenVisible },

    props: {
        stats: { type: Object, default: null },
    },
})
</script>

<template>
    <div>
        <h1>Dashboard</h1>

        <WhenVisible data="stats" :buffer="200">
            <template #fallback>
                <div class="animate-pulse">Loading stats...</div>
            </template>

            <template #default="{ fetching }">
                <div>
                    <p>Total Users: {{ stats.total_users }}</p>
                    <p>Revenue: {{ stats.revenue }}</p>
                    <span v-if="fetching">Refreshing...</span>
                </div>
            </template>
        </WhenVisible>
    </div>
</template>
```

### InfiniteScroll

Automatically load additional pages of paginated data as users scroll:

<!-- InfiniteScroll Example -->
```vue
<script>
import { defineComponent } from 'vue'
import { InfiniteScroll } from '@inertiajs/vue3'

export default defineComponent({
    name: 'UsersInfinite',

    components: { InfiniteScroll },

    props: {
        users: { type: Object, required: true },
    },
})
</script>

<template>
    <InfiniteScroll data="users">
        <div v-for="user in users.data" :key="user.id">
            {{ user.name }}
        </div>
    </InfiniteScroll>
</template>
```

The server must use `Inertia::scroll()` to configure the paginated data. Use the `search-docs` tool with a query of `infinite scroll` for detailed guidance on buffers, manual loading, reverse mode, and custom trigger elements.

## Server-Side Patterns

Server-side patterns (Inertia::render, props, middleware) are covered in inertia-laravel guidelines.

## Common Pitfalls

- Using traditional `<a>` links instead of Inertia's `<Link>` component (breaks SPA behavior)
- Forgetting to register imported Inertia components (`Link`, `Form`, `WhenVisible`, `InfiniteScroll`) in the `components` option — outside `<script setup>` there is no auto-registration, and the tag renders as unknown HTML
- Forgetting that Vue components must have a single root element
- Declaring an Object or Array page prop with a literal `default` (`default: []`) instead of a factory (`default: () => []`) — the literal is shared by every instance
- Forgetting to add loading states (skeleton screens) when using deferred props
- Not handling the `undefined` state of deferred props before data loads — give them `default: null`, not an empty array
- Creating a poll with `this.$inertia.poll()` and never calling `destroy()` in `beforeUnmount` — the interval outlives the component
- Using `<form>` without preventing default submission (use `<Form>` component or `@submit.prevent`)
- Using an arrow function for `data`, `methods`, or lifecycle hooks — `this` is not the component and `this.$inertia` is `undefined`
- Forgetting to check if `<Form>` component is available in your Inertia version
