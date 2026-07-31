---
name: echo-vue-development
description: "Develops real-time broadcasting in Vue Options API applications with Laravel Echo. Activates when configuring Echo in Vue (configureEcho); subscribing to channels from lifecycle hooks; listening for broadcast events in Vue components; implementing client events (whisper) in Vue; or when the user mentions Echo with Vue, real-time Vue, or broadcasting in Vue components."
license: MIT
metadata:
  author: laravel
---

# Laravel Echo Vue Integration

## When to Apply

Activate this skill when:

- Configuring Echo in a Vue application (`configureEcho`)
- Subscribing to broadcast channels from Vue components
- Listening for broadcast events, model events, or notifications in Vue
- Implementing client events (whisper) in Vue

> **House rule: Options API only.** The `useEcho*` composables in `@laravel/echo-vue` call `onMounted` / `onUnmounted` internally, so they only work inside a `setup` context. In the Options API, use the `echo()` singleton directly from `mounted` and tear down in `beforeUnmount` — same underlying API, explicit lifecycle.

## Documentation

Use `search-docs` for detailed broadcasting patterns. Search for:

- "receiving broadcasts" — channel usage with full examples
- "model broadcasting" — Eloquent model events
- "client events" — whisper/listenForWhisper
- "presence channels" — presence with member tracking
- "broadcasting installation" — configureEcho setup

## Basic Usage

### Configure Echo

Call once in your app entry point (e.g., `app.ts`):

<!-- Configure Echo for Reverb -->
```typescript
import { configureEcho } from "@laravel/echo-vue";

configureEcho({
    broadcaster: "reverb",
});
```

All Reverb connection options (`key`, `wsHost`, `wsPort`, `wssPort`, `forceTLS`, `enabledTransports`) are auto-read from environment variables when omitted. Override explicitly only when needed.

For Pusher:

<!-- Configure Echo for Pusher -->
```typescript
import { configureEcho } from "@laravel/echo-vue";

configureEcho({
    broadcaster: "pusher",
});
```

### The Options API Pattern

Every example below follows the same shape:

1. Subscribe in `mounted` (never `created` — it also runs on the server during SSR).
2. Keep the handler as a **named method** so you can unbind exactly that reference.
3. Declare the channel in `data()` as `null`, then assign `markRaw(echo().private(...))`. Declaring it keeps `this.channel` typed under `defineComponent`; `markRaw` stops Vue deep-proxying the whole Echo channel object.
4. `stopListening(event, handler)` in `beforeUnmount`.

**Use `stopListening`, not `leaveChannel`.** Echo caches one channel object per name, so two components on `orders.5` share a subscription. `leaveChannel` / `leave` unsubscribes it for everyone. The `useEcho` composables reference-counted this for you; imperative code must not.

### Typing the Channel Handle

The concrete channel type depends on the configured broadcaster, so derive it once instead of importing a class name (`PrivateChannel` is not exported from `laravel-echo`):

```ts
// types/echo.ts
import type { echo } from '@laravel/echo-vue'

type EchoInstance = ReturnType<typeof echo<'reverb'>>   // match your broadcaster

export type EchoChannel = ReturnType<EchoInstance['private']>
export type EchoPublicChannel = ReturnType<EchoInstance['channel']>
export type EchoPresenceChannel = ReturnType<EchoInstance['join']>
```

### Listen for Events

<!-- Private Channel -->
```vue
<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { echo } from '@laravel/echo-vue'
import type { EchoChannel } from '@/types/echo'

export default defineComponent({
    name: 'OrderStatus',

    props: {
        orderId: { type: Number, required: true },
    },

    data() {
        return {
            channel: null as EchoChannel | null,
        }
    },

    mounted() {
        this.channel = markRaw(echo().private(`orders.${this.orderId}`))
        this.channel.listen('OrderShipmentStatusUpdated', this.onShipmentUpdated)
    },

    beforeUnmount() {
        this.channel?.stopListening('OrderShipmentStatusUpdated', this.onShipmentUpdated)
    },

    methods: {
        onShipmentUpdated(e: { order: { id: number } }): void {
            console.log(e.order)
        },
    },
})
</script>
```

`echo().private()` is the private-channel default. Public channels use `echo().channel()`, presence uses `echo().join()`.

Listen to multiple events — `listen` is chainable:

<!-- Multiple Events -->
```ts
mounted() {
    this.channel = markRaw(echo().private(`orders.${this.orderId}`))
    this.channel.listen('OrderShipmentStatusUpdated', this.onOrderEvent)
    this.channel.listen('OrderShipped', this.onOrderEvent)
},

beforeUnmount() {
    this.channel?.stopListening('OrderShipmentStatusUpdated', this.onOrderEvent)
    this.channel?.stopListening('OrderShipped', this.onOrderEvent)
},
```

### Public Channels

<!-- Public Channel -->
```vue
<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { echo } from '@laravel/echo-vue'
import type { EchoPublicChannel } from '@/types/echo'

export default defineComponent({
    name: 'PostFeed',

    data() {
        return {
            channel: null as EchoPublicChannel | null,
        }
    },

    mounted() {
        this.channel = markRaw(echo().channel('posts'))
        this.channel.listen('PostPublished', this.onPostPublished)
    },

    beforeUnmount() {
        this.channel?.stopListening('PostPublished', this.onPostPublished)
    },

    methods: {
        onPostPublished(e: { post: { id: number } }): void {
            console.log(e.post)
        },
    },
})
</script>
```

### Presence Channels

<!-- Presence Channel -->
```vue
<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { echo } from '@laravel/echo-vue'
import type { EchoPresenceChannel } from '@/types/echo'

export default defineComponent({
    name: 'ChatRoom',

    data() {
        return {
            members: [] as Array<{ id: number; name: string }>,
            channel: null as EchoPresenceChannel | null,
        }
    },

    mounted() {
        this.channel = markRaw(echo().join('chat.1'))
        this.channel
            .here((users) => { this.members = users })
            .joining((user) => { this.members.push(user) })
            .leaving((user) => {
                this.members = this.members.filter((m) => m.id !== user.id)
            })
            .listen('NewMessage', this.onNewMessage)
    },

    beforeUnmount() {
        this.channel?.stopListening('NewMessage', this.onNewMessage)
    },

    methods: {
        onNewMessage(e: { message: string }): void {
            console.log(e.message)
        },
    },
})
</script>
```

`here` / `joining` / `leaving` bind Pusher subscription events, not app events — they are cleared when the channel is finally left.

### Model Broadcasting

The channel name convention is `App.Models.User.{id}`, and model events need a **dot prefix**.

<!-- Model Broadcasting -->
```vue
<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { echo } from '@laravel/echo-vue'
import type { EchoChannel } from '@/types/echo'

export default defineComponent({
    name: 'UserWatcher',

    props: {
        userId: { type: Number, required: true },
    },

    data() {
        return {
            channel: null as EchoChannel | null,
        }
    },

    mounted() {
        this.channel = markRaw(echo().private(`App.Models.User.${this.userId}`))
        this.channel.listen('.UserUpdated', this.onUserUpdated)
    },

    beforeUnmount() {
        this.channel?.stopListening('.UserUpdated', this.onUserUpdated)
    },

    methods: {
        onUserUpdated(e: { model: { name: string } }): void {
            console.log(e.model)
        },
    },
})
</script>
```

`useEchoModel` added the dot prefix automatically. Doing it by hand, you must include it — without the dot Echo looks for `App.Events.UserUpdated` and silently never fires.

### Notifications

<!-- Notifications -->
```vue
<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { echo } from '@laravel/echo-vue'
import type { EchoChannel } from '@/types/echo'

export default defineComponent({
    name: 'NotificationBell',

    props: {
        userId: { type: Number, required: true },
    },

    data() {
        return {
            channel: null as EchoChannel | null,
        }
    },

    mounted() {
        this.channel = markRaw(echo().private(`App.Models.User.${this.userId}`))
        this.channel.notification(this.onNotification)
    },

    beforeUnmount() {
        this.channel?.stopListeningForNotification(this.onNotification)
    },

    methods: {
        onNotification(notification: { type: string }): void {
            console.log(notification)
        },
    },
})
</script>
```

### Client Events (Whisper)

<!-- Client Events -->
```vue
<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { echo } from '@laravel/echo-vue'
import type { EchoChannel } from '@/types/echo'

export default defineComponent({
    name: 'ChatTypingIndicator',

    props: {
        roomId: { type: Number, required: true },
        userName: { type: String, required: true },
    },

    data() {
        return {
            typingUser: null as string | null,
            channel: null as EchoChannel | null,
        }
    },

    mounted() {
        this.channel = markRaw(echo().private(`chat.${this.roomId}`))
        this.channel.listen('update', this.onUpdate)
        this.channel.listenForWhisper('typing', this.onTyping)
    },

    beforeUnmount() {
        this.channel?.stopListening('update', this.onUpdate)
        this.channel?.stopListeningForWhisper('typing', this.onTyping)
    },

    methods: {
        onUpdate(e: unknown): void {
            console.log('Chat event received:', e)
        },
        onTyping(e: { name: string }): void {
            this.typingUser = e.name
        },
        notifyTyping(): void {
            this.channel?.whisper('typing', { name: this.userName })
        },
    },
})
</script>
```

### Connection Status

<!-- Connection Status -->
```vue
<script lang="ts">
import { defineComponent } from 'vue'
import { echo } from '@laravel/echo-vue'
import type { ConnectionStatus } from 'laravel-echo'

export default defineComponent({
    name: 'ConnectionBadge',

    data() {
        return {
            // connected | connecting | reconnecting | disconnected | failed
            status: 'connecting' as ConnectionStatus,
            unsubscribeStatus: null as (() => void) | null,
        }
    },

    mounted() {
        this.status = echo().connectionStatus()
        this.unsubscribeStatus = echo().connector.onConnectionChange((status) => {
            this.status = status
        })
    },

    beforeUnmount() {
        this.unsubscribeStatus?.()
    },
})
</script>

<template>
    <div>Connection: {{ status }}</div>
</template>
```

`onConnectionChange` returns its own unsubscribe function — call it in `beforeUnmount`.

### Type Safety

Type the payload on the handler method:

<!-- Type-safe Event Listening -->
```ts
type OrderData = {
    order: { id: number; user: { id: number; name: string } }
}

methods: {
    onOrderShipped(e: OrderData): void {
        console.log(e.order.id)
        console.log(e.order.user.name)
    },
},
```

For the channel handle itself, declare it in `data()` with the derived alias from "Typing the Channel Handle" above, and assign it wrapped in `markRaw()`:

```ts
import { markRaw } from 'vue'
import type { EchoChannel } from '@/types/echo'

data() {
    return { channel: null as EchoChannel | null }
},

mounted() {
    this.channel = markRaw(echo().private(`orders.${this.orderId}`))
    this.channel.listen('OrderShipped', this.onOrderShipped)
},
```

Assigning to an undeclared `this.channel` compiles in plain JS but fails typecheck under `defineComponent` — and the property would not be tracked at all. Declare it.

### Re-subscribing When a Prop Changes

The composables took a deps array. In the Options API this is a `watch` that tears down and rebuilds:

```ts
data() {
    return { channel: null as EchoChannel | null }
},

watch: {
    orderId: {
        handler: 'resubscribe',
        immediate: false,
    },
},

mounted() {
    this.subscribe()
},

beforeUnmount() {
    this.unsubscribe()
},

methods: {
    subscribe(): void {
        this.channel = markRaw(echo().private(`orders.${this.orderId}`))
        this.channel.listen('OrderShipped', this.onOrderShipped)
    },
    unsubscribe(): void {
        this.channel?.stopListening('OrderShipped', this.onOrderShipped)
        this.channel = null
    },
    resubscribe(): void {
        this.unsubscribe()
        this.subscribe()
    },
},
```

## Imperative API Reference

Access via `echo()` from `@laravel/echo-vue`.

- `echo().channel(name)` — public channel (no auth)
- `echo().private(name)` — private channel (authorized)
- `echo().encryptedPrivate(name)` — encrypted private channel (Pusher/Reverb only)
- `echo().join(name)` — presence channel with `here` / `joining` / `leaving`
- `echo().leaveChannel(fullName)` — unsubscribe one channel **for the whole app**
- `echo().leave(name)` — leave the base, private, encrypted-private, and presence variants
- `echo().socketId()` — for the `X-Socket-ID` header
- `echo().connectionStatus()` — current status snapshot
- `echo().connector.onConnectionChange(cb)` — subscribe to status changes, returns an unsubscribe function

### On a channel handle

- `listen(event, cb)` / `stopListening(event, cb)`
- `listenForWhisper(event, cb)` / `stopListeningForWhisper(event, cb)` / `whisper(event, data)`
- `notification(cb)` / `stopListeningForNotification(cb)`
- `subscribed(cb)` / `error(cb)` — channel lifecycle

### Utilities

- `configureEcho(options)` — configure the singleton Echo instance (call once in app entry point)
- `echo()` — access the Echo instance directly
- `echoIsConfigured()` — check if Echo has been configured before accessing `echo()`

## Server-Side Reference

Use `search-docs` for detailed code examples. This section covers what's available on the backend so you can build the full end-to-end flow.

### Creating Broadcast Events

```bash
php artisan make:event OrderShipped
```

<!-- Broadcast Event -->
```php
namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class OrderShipped implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(public Order $order) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('orders.'.$this->order->id)];
    }
}
```

### Channel Authorization

Define in `routes/channels.php`:

<!-- Channel Authorization -->
```php
use App\Models\Order;
use App\Models\User;

Broadcast::channel('orders.{orderId}', function (User $user, int $orderId) {
    return $user->id === Order::findOrNew($orderId)->user_id;
});
```

Create a channel class for complex authorization:

```bash
php artisan make:channel OrderChannel
```

List all registered channels:

```bash
php artisan channel:list
```

### Channel Types

- Public (`new Channel`) — no auth, anyone can subscribe. Use for app-wide announcements, public feeds, or status pages.
- Private (`new PrivateChannel`) — requires authorization. Use for user-specific data like orders, messages, or account updates.
- Presence (`new PresenceChannel`) — authorized + tracks who's online. Use for chat rooms, collaborative editing, "who's viewing this" features, or typing indicators.
- EncryptedPrivate — end-to-end encryption, Pusher/Reverb only. Use when payload must be hidden from the broadcast server (e.g., sensitive financial data or private messages).
- Drivers: `reverb` (self-hosted WebSocket server), `pusher` (managed service), `ably` (managed service), `log` (writes to Laravel log, use for debugging), `null` (no-op, use for testing)

### Event Customization

- `broadcastAs()` — custom event name (client must use dot prefix: `.listen('.custom.name')`). Use when you want stable API names decoupled from PHP class names, or shorter event names for the frontend.
- `broadcastWith()` — control exact payload. Use to avoid leaking sensitive model attributes, slim down large payloads, or add computed data not on the model.
- `broadcastWhen()` — conditional broadcasting. Use to skip broadcasting when changes are trivial (e.g., only broadcast order updates above a threshold, or skip unchanged fields).
- `broadcastQueue()` / `$queue` — route to specific queue. Use to isolate real-time broadcasts from slow background jobs so they're processed faster.
- `$connection` — set queue connection per event. Use when broadcasts should go through a faster queue backend like Redis while other jobs use the database driver.

### Broadcasting Interfaces

- `ShouldBroadcast` — queue the broadcast (default). Use for most events to avoid blocking the HTTP response.
- `ShouldBroadcastNow` — broadcast synchronously, skip queue. Use during development or for time-critical events where queue latency is unacceptable.
- `ShouldDispatchAfterCommit` — wait for DB transaction commit. Use when the event references newly created records that listeners need to query (prevents race conditions).
- `ShouldRescue` — auto-catch broadcast exceptions. Use to prevent broadcast failures (e.g., WebSocket server down) from disrupting the user's HTTP request.
- `InteractsWithSockets` — required for `toOthers()`. Use on any event where you want to exclude the sender (optimistic UI updates).
- `InteractsWithBroadcasting` — override driver per event via `broadcastVia()`. Use in multi-driver setups (e.g., some events via Reverb, others via Pusher).

### Broadcasting Helpers

- `broadcast(new Event)->toOthers()` — exclude current user's socket. Use when the client already updates optimistically from the API response to avoid duplicate updates.
- `broadcast(new Event)->via('pusher')` — override connection. Use to route specific events through a different broadcast driver than the default.
- `Broadcast::on()`, `Broadcast::private()`, `Broadcast::presence()` — anonymous broadcasting without event classes. Chain `.as('name')->with($data)->send()` or `.sendNow()`. Use for simple one-off broadcasts where creating a full event class is overkill (e.g., quick status updates, simple notifications).

### Channel Authorization Options

- Closure-based in `routes/channels.php` — use for simple authorization logic (e.g., checking ownership).
- Model binding: `Broadcast::channel('orders.{order}', fn (User $user, Order $order) => ...)` — use when authorization depends on the model instance (auto-resolves from route parameter).
- Channel classes via `php artisan make:channel` — use for complex authorization logic that benefits from dependency injection or reusable logic across channels.
- Multiple guards: `['guards' => ['web', 'admin']]` — use when the channel should be accessible by users authenticated via different guards (e.g., both regular users and admins).

### Model Broadcasting (Server-Side)

- `BroadcastsEvents` trait auto-broadcasts created/updated/deleted/trashed/restored. Use to automatically keep clients in sync with Eloquent model changes without writing individual events.
- Channel convention: `App.Models.Post.{id}` — matches the channel name you pass to `echo().private()`.
- `broadcastAs($event)` and `broadcastWith($event)` for per-action customization. Use to send different payloads for create vs update, or suppress certain event types.
- `newBroadcastableEvent($event)` for event instance customization (e.g., `->dontBroadcastToCurrentUser()`). Use when you need to modify the underlying event object before it's dispatched.

### Running Required Processes

```bash
php artisan queue:work    # Required for ShouldBroadcast events

php artisan reverb:start  # Required for Reverb driver

```

## Common Pitfalls

- Queue worker must be running for `ShouldBroadcast` events. Use `ShouldBroadcastNow` during development.
- `BROADCAST_CONNECTION` not `BROADCAST_DRIVER`: Laravel 11+ renamed this env key.
- Presence channel auth must return an array of user data (`['id' => $user->id, 'name' => $user->name]`), not `true`. Returning `true` silently fails.
- Dot prefix rule: When using `broadcastAs()` or model broadcasting, the client must prefix with `.` (e.g., `.listen('.custom.name')`). Without the dot, Echo looks for `App\Events\custom.name` which silently fails. `useEchoModel` used to add this for you — imperative code does not.
- **No auto-cleanup.** The `useEcho*` composables unsubscribed on unmount. Subscribing imperatively means you own teardown — always `stopListening` in `beforeUnmount`, or the handler keeps firing against a destroyed component.
- **Do not call `leave()` / `leaveChannel()` on unmount.** Echo caches one channel object per name, so this force-unsubscribes every other component listening to it. Use `stopListening(event, handler)`.
- Anonymous arrow handlers cannot be unbound. `stopListening` needs the same function reference — declare handlers as `methods`.
- Subscribing in `created` instead of `mounted` breaks SSR — `created` runs on the server where there is no WebSocket.
- Arrow functions for `mounted` / `beforeUnmount` / `methods` lose `this` — the component is `undefined` inside.
- Storing the channel object in `data()` un-wrapped deep-proxies the whole Echo channel. Assign it to `this` in `mounted`, or wrap in `markRaw()`.
- Call `configureEcho` before any component mounts. Place it in your app entry point (e.g., `app.ts`), not inside a component.
- `X-Socket-ID` header is NOT auto-sent with Inertia requests. Manually add `echo().socketId()` when using `broadcast()->toOthers()`.
- SSR / "window is not defined": Guard `configureEcho` with `typeof window !== 'undefined'` in SSR contexts.
- One Echo instance: `configureEcho` creates a singleton. Multiple calls reuse the first configuration.
- Prop changes do not re-subscribe by themselves. Add a `watch` that tears down and re-subscribes.
