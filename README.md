# state-dispatcher-red-react
[![npm version](https://img.shields.io/npm/v/state-dispatcher-red)](https://www.npmjs.com/package/state-dispatcher-red-react)
React hooks connector for [`state-dispatcher-red`](https://www.npmjs.com/package/state-dispatcher-red).

`state-dispatcher-red-react` provides a lightweight and type-safe way to build React hooks on top of `StateDispatcher`.

The main purpose of this package is to create reusable **domain-specific React hooks** while keeping your components independent from dispatcher implementation details.

---

## Installation

```bash
npm install state-dispatcher-red-react
```

Requirements:

* React `>=16.8`
* `state-dispatcher-red`

---

# Core Concept

`state-dispatcher-red-react` separates your application into three layers:

```text
StateDispatcher
        |
        | createHook(manager)
        |
        v
Domain Hooks
        |
        |
        v
React Components
```

The dispatcher owns your state and events.

The connector creates React hooks.

Your components consume simple domain hooks.

---

# Recommended Usage

## Create a hook factory

The primary API is `createHook`.

Bind a dispatcher instance once:

```ts
import { createHook } from "state-dispatcher-red-react";

const useApp = createHook(manager);
```

`useApp` is now a hook factory connected to this dispatcher.

---

## Build domain hooks

Instead of exposing the dispatcher to components, create small focused hooks:

```ts
export const useUser = () => {
    const [user, setUser] = useApp(
        "userChanged",
        state => state.user,
    );

    return {
        user,
        setUser,
    };
};
```

Another example:

```ts
export const useActivity = () => {
    const [activity] = useApp(
        "activityChanged",
        state => state.main.activity,
    );

    return {
        activity,
    };
};
```

Your components now work only with application concepts:

```tsx
function Profile() {
    const { user } = useUser();

    return (
        <h1>
            {user.name}
        </h1>
    );
}
```

The component does not know:

* what dispatcher is used;
* what events exist;
* how subscriptions work.

---

# React Context Example

A common pattern is storing a dispatcher inside a provider.

Example:

```ts
export const useSnakeHook = () => {
    const { manager } = useSnake();

    return createHook(manager);
};
```

Now create hooks around your domain:

```ts
export const useSnakeActivity = () => {
    const [activity] = useSnakeHook()(
        "activityChanged",
        state => state.main.activity,
    );

    return {
        activity,
    };
};
```

This allows multiple components to share the same dispatcher while keeping their APIs clean.

---

# API

## `createHook`

Creates a reusable hook factory bound to a `StateDispatcher`.

This is the recommended way to use the connector.

### Signature

```ts
createHook(manager)
```

Returns:

```ts
(
    eventKey,
    selector
) => [
    value,
    setter
]
```

Example:

```ts
const useApp = createHook(manager);

const [count, setCount] = useApp(
    "countChanged",
    state => state.count,
);
```

---

## `useDispatcher`

A lower-level API for cases where you already have access to a dispatcher instance.

Example:

```ts
import { useDispatcher } from "state-dispatcher-red-react";

const [count, setCount] = useDispatcher(
    manager,
    "countChanged",
    state => state.count,
);
```

This is useful for:

* small applications;
* utility hooks;
* cases where creating a factory is unnecessary.

For larger applications, prefer `createHook`.

---

# Selectors

Selectors choose which part of the dispatcher state your hook receives.

Example:

```ts
const [userName] = useApp(
    "userChanged",
    state => state.user.name,
);
```

The selector receives the complete dispatcher state:

```ts
(state) => selectedValue
```

The returned value becomes the hook state.

---

# Returned Value

Both APIs return:

```ts
[
    selectedValue,
    setter
]
```

Example:

```ts
const [value, setValue] = useApp(
    "valueChanged",
    state => state.value,
);
```

Where:

* `value` is the selected state value;
* `setValue` triggers the dispatcher event.

---

# TypeScript Support

Types are inferred directly from your dispatcher.

Example:

```ts
interface State {
    count: number;
}

interface Events {
    countChanged: number;
}
```

Usage:

```ts
const [count, setCount] = useApp(
    "countChanged",
    state => state.count,
);
```

Automatically becomes:

```ts
count: number

setCount(value: number): void
```

No additional generic arguments are required.

---

# Architecture

The packages have separate responsibilities.

## `state-dispatcher-red`

Framework-independent state layer:

* stores state;
* defines events;
* handles mutations;
* manages subscriptions.

## `state-dispatcher-red-react`

React adapter:

* creates hooks;
* connects components;
* updates React state.

This keeps the dispatcher usable outside React applications.

---

# Why a Separate Package?

React is optional.

Applications that do not use React should not install React dependencies.

The ecosystem can grow independently:

```text
state-dispatcher-red
state-dispatcher-red-react
state-dispatcher-red-vue
state-dispatcher-red-devtools
```

---

# Features

* ⚛️ React Hooks support
* 🔒 Full TypeScript inference
* 🧩 Domain hook architecture
* 🪶 Minimal runtime code
* ♻️ Automatic cleanup
* 🔌 Framework-independent core

---

# License

ISC
