# React 19 Best Practices for Client-Side Applications

This guide covers React 19's new features, breaking changes, and best practices specifically for client-side applications using Vite. It focuses on features relevant to non-server-rendered React applications.

## Table of Contents

1. [React Compiler and Automatic Memoization](#react-compiler-and-automatic-memoization)
2. [New Hooks](#new-hooks)
3. [Actions API](#actions-api)
4. [Enhanced Transitions](#enhanced-transitions)
5. [Document Metadata](#document-metadata)
6. [Ref as a Prop](#ref-as-a-prop)
7. [Improved TypeScript Support](#improved-typescript-support)
8. [Breaking Changes](#breaking-changes)
9. [Migration Guide](#migration-guide)
10. [Performance Best Practices](#performance-best-practices)

---

## React Compiler and Automatic Memoization

### Overview

The React Compiler is a build-time optimization tool that automatically memoizes your components and hooks, significantly reducing the need for manual optimization with `memo`, `useMemo`, and `useCallback`.

**Important Note**: The React Compiler is separate from React 19 but works seamlessly with it. It's currently in beta and can be adopted independently.

### How It Works

The compiler analyzes your React code and automatically:

- Wraps components with the equivalent of `React.memo`
- Memoizes expensive calculations
- Stabilizes function references to prevent unnecessary re-renders
- Optimizes hook dependencies

### Installation

```bash
npm install babel-plugin-react-compiler --save-dev
```

Add to your Vite config:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
});
```

### Best Practices

#### ✅ DO: Write Simple, Clean Code

With the compiler, focus on readability rather than premature optimization:

```typescript
// Before React 19 (manual optimization)
const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => item.value * 2);
  }, [data]);

  const handleClick = useCallback(() => {
    onUpdate(processedData);
  }, [processedData, onUpdate]);

  return <div onClick={handleClick}>{processedData.join(', ')}</div>;
});

// With React 19 Compiler (simplified)
const ExpensiveComponent = ({ data, onUpdate }) => {
  const processedData = data.map(item => item.value * 2);

  const handleClick = () => {
    onUpdate(processedData);
  };

  return <div onClick={handleClick}>{processedData.join(', ')}</div>;
};
```

#### ✅ DO: Trust the Compiler for Most Cases

The compiler handles optimization automatically. Remove manual memoization unless you have specific requirements:

```typescript
// You can remove these in most cases
const MyComponent = ({ items }) => {
  // No need for useMemo - compiler handles it
  const total = items.reduce((sum, item) => sum + item.price, 0);

  // No need for useCallback - compiler stabilizes references
  const handleSubmit = () => {
    console.log('Submitted with total:', total);
  };

  return <button onClick={handleSubmit}>Total: ${total}</button>;
};
```

#### ⚠️ WHEN TO KEEP MANUAL MEMOIZATION

Keep `useMemo`, `useCallback`, and `memo` only in these specific cases:

1. **Third-party libraries requiring strict reference equality**:

```typescript
// Some libraries rely on reference equality
const MyMap = ({ coordinates }) => {
  // Keep useMemo for libraries expecting stable references
  const mapOptions = useMemo(() => ({
    center: coordinates,
    zoom: 10,
  }), [coordinates]);

  return <ThirdPartyMap options={mapOptions} />;
};
```

2. **Extremely expensive calculations** (rarely needed):

```typescript
const DataAnalysis = ({ rawData }) => {
  // Only if this is genuinely expensive (>100ms)
  const analysis = useMemo(() => {
    return performComplexStatisticalAnalysis(rawData);
  }, [rawData]);

  return <AnalysisDisplay data={analysis} />;
};
```

3. **Legacy code** that hasn't been updated yet

#### ❌ DON'T: Over-optimize Prematurely

Avoid adding memoization "just in case":

```typescript
// ❌ Bad: Unnecessary memoization
const SimpleComponent = ({ name }) => {
  const greeting = useMemo(() => `Hello, ${name}!`, [name]);
  return <div>{greeting}</div>;
};

// ✅ Good: Let the compiler handle it
const SimpleComponent = ({ name }) => {
  const greeting = `Hello, ${name}!`;
  return <div>{greeting}</div>;
};
```

### Checking Compiler Output

Use the React DevTools Profiler to verify the compiler's optimizations are working:

1. Install React DevTools browser extension
2. Profile your application
3. Check for unnecessary re-renders
4. The compiler should minimize cascading updates

---

## New Hooks

React 19 introduces several powerful hooks designed to simplify common patterns and improve user experience.

### `use()` Hook

The `use()` hook allows you to read the value of a Promise or Context in render, with the unique ability to be called conditionally.

#### Reading Promises

```typescript
import { use, Suspense } from 'react';

// Create a promise that fetches data
const fetchUser = (userId: string) => {
  return fetch(`/api/users/${userId}`).then(res => res.json());
};

function UserProfile({ userId }: { userId: string }) {
  // use() can read the promise directly
  const user = use(fetchUser(userId));

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Must be wrapped in Suspense
function App() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile userId="123" />
    </Suspense>
  );
}
```

#### Conditional Use (Unlike Other Hooks!)

```typescript
function ConditionalData({ shouldFetch, dataPromise }: Props) {
  let data = null;

  // ✅ use() can be called conditionally!
  if (shouldFetch) {
    data = use(dataPromise);
  }

  return <div>{data ? data.value : 'No data'}</div>;
}
```

#### Reading Context

```typescript
import { createContext, use } from 'react';

const ThemeContext = createContext('light');

function ThemedButton() {
  // Alternative to useContext
  const theme = use(ThemeContext);

  return <button className={theme}>Click me</button>;
}
```

#### Best Practices for `use()`

✅ **DO**: Use with Suspense boundaries for promises

```typescript
<Suspense fallback={<Spinner />}>
  <DataComponent dataPromise={fetchData()} />
</Suspense>
```

✅ **DO**: Leverage conditional calling when needed

```typescript
function OptionalData({ enabled, promise }) {
  const data = enabled ? use(promise) : null;
  return <div>{data?.value}</div>;
}
```

❌ **DON'T**: Call in try/catch for error handling (use Error Boundaries instead)

```typescript
// ❌ Bad
function BadComponent({ promise }) {
  try {
    const data = use(promise);
    return <div>{data}</div>;
  } catch (error) {
    return <div>Error!</div>;
  }
}

// ✅ Good - Use Error Boundary
<ErrorBoundary fallback={<ErrorDisplay />}>
  <Suspense fallback={<Loading />}>
    <GoodComponent promise={promise} />
  </Suspense>
</ErrorBoundary>
```

### `useActionState` Hook

Manages the state of asynchronous actions, providing pending state, results, and error handling in one hook.

#### Basic Usage

```typescript
import { useActionState } from 'react';

type FormState = {
  message: string;
  success: boolean;
};

async function submitForm(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string;

  try {
    await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return { message: 'Subscribed successfully!', success: true };
  } catch (error) {
    return { message: 'Failed to subscribe', success: false };
  }
}

function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    submitForm,
    null // initial state
  );

  return (
    <form action={formAction}>
      <input type="email" name="email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Subscribing...' : 'Subscribe'}
      </button>
      {state?.message && (
        <p className={state.success ? 'success' : 'error'}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

#### Advanced Pattern: Multi-step Form

```typescript
type WizardState = {
  step: number;
  data: Record<string, any>;
  error?: string;
};

async function handleWizardAction(
  prevState: WizardState,
  formData: FormData
): Promise<WizardState> {
  const action = formData.get('action') as string;

  if (action === 'next') {
    // Validate current step
    const isValid = validateStep(prevState.step, formData);
    if (!isValid) {
      return { ...prevState, error: 'Please fill all fields' };
    }

    return {
      step: prevState.step + 1,
      data: { ...prevState.data, ...Object.fromEntries(formData) },
    };
  }

  if (action === 'submit') {
    await submitToServer(prevState.data);
    return { step: -1, data: {} }; // completion state
  }

  return prevState;
}

function MultiStepForm() {
  const [state, formAction, isPending] = useActionState(
    handleWizardAction,
    { step: 1, data: {} }
  );

  return (
    <form action={formAction}>
      {state.step === 1 && <Step1 />}
      {state.step === 2 && <Step2 />}
      {state.step === 3 && <Step3 />}

      {state.error && <p className="error">{state.error}</p>}

      <button name="action" value="next" disabled={isPending}>
        {isPending ? 'Processing...' : 'Next'}
      </button>
    </form>
  );
}
```

#### Best Practices for `useActionState`

✅ **DO**: Use for form submissions and async operations

```typescript
const [state, action, isPending] = useActionState(async (prev, formData) => {
  // Handle async operation
  const result = await apiCall(formData);
  return result;
}, initialState);
```

✅ **DO**: Combine with `useOptimistic` for instant feedback

✅ **DO**: Return meaningful state objects with success/error info

❌ **DON'T**: Use for simple synchronous state updates (use `useState` instead)

### `useOptimistic` Hook

Provides optimistic UI updates that automatically revert if the operation fails.

#### Basic Usage

```typescript
import { useOptimistic, useActionState } from 'react';

type Message = {
  id: string;
  text: string;
  sending?: boolean;
};

async function sendMessage(
  prevState: { messages: Message[] },
  formData: FormData
): Promise<{ messages: Message[] }> {
  const text = formData.get('message') as string;

  // Simulate API call
  const response = await fetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });

  const newMessage = await response.json();
  return { messages: [...prevState.messages, newMessage] };
}

function ChatRoom({ initialMessages }: { initialMessages: Message[] }) {
  const [state, formAction] = useActionState(
    sendMessage,
    { messages: initialMessages }
  );

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    state.messages,
    (currentMessages, newMessage: Message) => [
      ...currentMessages,
      { ...newMessage, sending: true },
    ]
  );

  async function handleSubmit(formData: FormData) {
    const text = formData.get('message') as string;

    // Add optimistic message immediately
    addOptimisticMessage({
      id: crypto.randomUUID(),
      text,
      sending: true,
    });

    // Clear input
    formData.set('message', '');

    // Submit form (will update or revert)
    formAction(formData);
  }

  return (
    <div>
      <MessageList messages={optimisticMessages} />
      <form action={handleSubmit}>
        <input name="message" placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <ul>
      {messages.map(msg => (
        <li key={msg.id} className={msg.sending ? 'opacity-50' : ''}>
          {msg.text}
          {msg.sending && ' (sending...)'}
        </li>
      ))}
    </ul>
  );
}
```

#### Advanced Pattern: Like Button

```typescript
function LikeButton({ postId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(likes);

  async function handleLike() {
    // Show optimistic update immediately
    setOptimisticLikes(likes + 1);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });
      const data = await response.json();

      // Update with real data
      setLikes(data.likes);
    } catch (error) {
      // useOptimistic automatically reverts on error
      console.error('Failed to like post');
    }
  }

  return (
    <button onClick={handleLike}>
      ❤️ {optimisticLikes}
    </button>
  );
}
```

#### Best Practices for `useOptimistic`

✅ **DO**: Use for operations that are likely to succeed

```typescript
// Good use cases: likes, follows, simple updates
const [optimisticFollowers, addFollower] = useOptimistic(
  followers,
  (current, newFollower) => [...current, newFollower]
);
```

✅ **DO**: Provide visual feedback that the action is pending

```typescript
<li className={item.sending ? 'opacity-50' : ''}>
  {item.text}
  {item.sending && <Spinner size="small" />}
</li>
```

❌ **DON'T**: Use for operations with high failure rates

❌ **DON'T**: Use for critical operations where accuracy is paramount (e.g., payments)

### `useFormStatus` Hook

Provides access to the parent form's submission status without prop drilling.

#### Basic Usage

```typescript
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function ContactForm() {
  async function handleSubmit(formData: FormData) {
    await fetch('/api/contact', {
      method: 'POST',
      body: formData,
    });
  }

  return (
    <form action={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <SubmitButton />
    </form>
  );
}
```

#### Advanced Pattern: Progress Indicator

```typescript
function FormProgress() {
  const { pending, data } = useFormStatus();

  if (!pending) return null;

  const fieldsFilled = data ? Array.from(data.keys()).length : 0;

  return (
    <div className="progress-bar">
      <div className="progress-text">
        Uploading {fieldsFilled} fields...
      </div>
      <div className="spinner" />
    </div>
  );
}

function ComplexForm() {
  return (
    <form action={handleSubmit}>
      <FormProgress />

      <input name="firstName" />
      <input name="lastName" />
      <input name="email" />
      <textarea name="message" />

      <SubmitButton />
    </form>
  );
}
```

#### Disabled Form Fields During Submission

```typescript
function FormInput({ name, label, type = 'text' }: Props) {
  const { pending } = useFormStatus();

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        disabled={pending}
        className={pending ? 'opacity-50' : ''}
      />
    </div>
  );
}

function RegistrationForm() {
  return (
    <form action={handleRegistration}>
      <FormInput name="username" label="Username" />
      <FormInput name="email" label="Email" type="email" />
      <FormInput name="password" label="Password" type="password" />
      <SubmitButton />
    </form>
  );
}
```

#### Best Practices for `useFormStatus`

✅ **DO**: Use in child components to avoid prop drilling

```typescript
// ✅ Good: No props needed
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}
```

✅ **DO**: Disable form elements during submission

```typescript
const { pending } = useFormStatus();
return <input disabled={pending} />;
```

❌ **DON'T**: Call in the same component as the form

```typescript
// ❌ Bad: useFormStatus must be in a child component
function MyForm() {
  const { pending } = useFormStatus(); // Won't work here!

  return (
    <form action={handleSubmit}>
      <button disabled={pending}>Submit</button>
    </form>
  );
}
```

✅ **DO**: Use in a child component

```typescript
// ✅ Good: useFormStatus in child
function MyForm() {
  return (
    <form action={handleSubmit}>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}
```

---

## Actions API

Actions are asynchronous functions that can be passed to form elements and handle pending states, errors, and optimistic updates automatically.

### Form Actions

#### Basic Form Action

```typescript
function SearchForm() {
  async function search(formData: FormData) {
    const query = formData.get('query') as string;
    const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
    // Handle results
  }

  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

#### With Error Handling

```typescript
function CreatePostForm() {
  const [error, setError] = useState<string | null>(null);

  async function createPost(formData: FormData) {
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.get('title'),
          content: formData.get('content'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const post = await response.json();
      // Navigate or update UI
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form action={createPost}>
      <input name="title" placeholder="Post title" required />
      <textarea name="content" placeholder="Post content" required />
      {error && <p className="error">{error}</p>}
      <SubmitButton />
    </form>
  );
}
```

### Combining Actions with Hooks

#### Full-Featured Form with All New Hooks

```typescript
import { useActionState, useOptimistic } from 'react';
import { useFormStatus } from 'react-dom';

type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

type TodoState = {
  items: TodoItem[];
  error?: string;
};

async function addTodoAction(
  prevState: TodoState,
  formData: FormData
): Promise<TodoState> {
  const text = formData.get('todo') as string;

  if (!text.trim()) {
    return { ...prevState, error: 'Todo cannot be empty' };
  }

  try {
    const response = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });

    const newTodo = await response.json();

    return {
      items: [...prevState.items, newTodo],
      error: undefined,
    };
  } catch (error) {
    return { ...prevState, error: 'Failed to add todo' };
  }
}

function TodoForm() {
  const [state, formAction] = useActionState(addTodoAction, {
    items: [],
  });

  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    state.items,
    (currentTodos, newTodo: TodoItem) => [...currentTodos, newTodo]
  );

  function handleSubmit(formData: FormData) {
    const text = formData.get('todo') as string;

    // Add optimistic todo
    addOptimisticTodo({
      id: crypto.randomUUID(),
      text,
      completed: false,
    });

    // Submit action
    formAction(formData);
  }

  return (
    <div>
      <form action={handleSubmit}>
        <input name="todo" placeholder="What needs to be done?" />
        <AddButton />
        {state.error && <p className="error">{state.error}</p>}
      </form>

      <TodoList items={optimisticTodos} />
    </div>
  );
}

function AddButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add Todo'}
    </button>
  );
}

function TodoList({ items }: { items: TodoItem[] }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}
```

### Best Practices for Actions

✅ **DO**: Use native form actions for progressive enhancement

```typescript
// Form works even without JavaScript
<form action={handleSubmit}>
  <input name="email" type="email" />
  <button type="submit">Subscribe</button>
</form>
```

✅ **DO**: Handle errors gracefully

```typescript
async function action(formData: FormData) {
  try {
    await submitData(formData);
  } catch (error) {
    return { error: error.message };
  }
}
```

✅ **DO**: Provide feedback during pending state

❌ **DON'T**: Perform synchronous operations in actions (use regular handlers)

---

## Enhanced Transitions

React 19 improves transitions by allowing async functions in `startTransition`.

### Async Transitions

```typescript
import { useState, useTransition } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(newQuery: string) {
    setQuery(newQuery);

    // Start async transition
    startTransition(async () => {
      const data = await fetch(`/api/search?q=${newQuery}`).then(r => r.json());
      setResults(data);
    });
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />

      {isPending && <Spinner />}

      <SearchResults results={results} />
    </div>
  );
}
```

### Keeping UI Responsive

```typescript
function DataTable({ data }: Props) {
  const [sortedData, setSortedData] = useState(data);
  const [isPending, startTransition] = useTransition();

  function handleSort(column: string) {
    startTransition(async () => {
      // Expensive sorting operation
      const sorted = await heavySortOperation(data, column);
      setSortedData(sorted);
    });
  }

  return (
    <div>
      <button onClick={() => handleSort('name')} disabled={isPending}>
        Sort by Name {isPending && '...'}
      </button>

      <table className={isPending ? 'opacity-50' : ''}>
        {sortedData.map(row => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
```

### Best Practices for Transitions

✅ **DO**: Use for expensive UI updates that should be interruptible

```typescript
// Good: Heavy rendering work
startTransition(() => {
  setFilteredList(expensiveFilterOperation(items));
});
```

✅ **DO**: Use async transitions for data fetching during state updates

```typescript
startTransition(async () => {
  const data = await fetchData();
  setData(data);
});
```

✅ **DO**: Show visual feedback during pending state

```typescript
{isPending && <ProgressBar />}
<DataTable className={isPending ? 'loading' : ''} />
```

❌ **DON'T**: Use transitions for critical updates that must be immediate

❌ **DON'T**: Use for fast operations (unnecessary overhead)

---

## Document Metadata

React 19 supports rendering document metadata tags (`<title>`, `<meta>`, `<link>`) directly in components, automatically hoisting them to `<head>`.

### Basic Usage

```typescript
function BlogPost({ post }: Props) {
  return (
    <article>
      <title>{post.title} - My Blog</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />

      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

### Dynamic Metadata Based on Route

```typescript
function ProductPage({ product }: Props) {
  return (
    <div>
      <title>{product.name} - Shop</title>
      <meta name="description" content={product.description} />
      <meta property="og:image" content={product.imageUrl} />
      <meta property="og:type" content="product" />
      <meta property="og:price:amount" content={product.price} />
      <link rel="canonical" href={`https://shop.com/products/${product.id}`} />

      <ProductDetails product={product} />
    </div>
  );
}
```

### Precedence Rules

When multiple components render the same metadata tag, the last one wins:

```typescript
function App() {
  return (
    <>
      <title>My App</title> {/* Base title */}

      <Routes>
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}

function AboutPage() {
  return (
    <div>
      <title>About Us - My App</title> {/* Overrides base title */}
      <h1>About</h1>
    </div>
  );
}
```

### Best Practices for Metadata

✅ **DO**: Place metadata close to relevant content

```typescript
function ProfilePage({ user }) {
  return (
    <div>
      <title>{user.name}'s Profile</title>
      <meta name="description" content={user.bio} />
      {/* Profile content */}
    </div>
  );
}
```

✅ **DO**: Include essential SEO tags

```typescript
<>
  <title>{pageTitle}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:image" content={imageUrl} />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href={canonicalUrl} />
</>
```

✅ **DO**: Update metadata when content changes

```typescript
function ArticlePage({ articleId }: Props) {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchArticle(articleId).then(setArticle);
  }, [articleId]);

  if (!article) return <LoadingSpinner />;

  return (
    <div>
      <title>{article.title}</title>
      <meta name="description" content={article.summary} />
      {/* Article content */}
    </div>
  );
}
```

❌ **DON'T**: Forget to include unique titles and descriptions for each page

---

## Ref as a Prop

In React 19, `ref` is now a regular prop, eliminating the need for `forwardRef` in most cases.

### Before React 19

```typescript
import { forwardRef } from 'react';

const MyInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

### React 19 - Simplified

```typescript
function MyInput({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}
```

### With TypeScript

```typescript
import { ComponentPropsWithRef } from 'react';

type InputProps = ComponentPropsWithRef<'input'> & {
  label: string;
};

function LabeledInput({ label, ref, ...props }: InputProps) {
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} {...props} />
    </div>
  );
}

// Usage
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <LabeledInput
      label="Name"
      ref={inputRef}
      onChange={() => inputRef.current?.focus()}
    />
  );
}
```

### Callback Refs

```typescript
function AutoFocusInput() {
  const handleRef = (element: HTMLInputElement | null) => {
    if (element) {
      element.focus();
    }
  };

  return <input ref={handleRef} />;
}
```

### Best Practices for Refs

✅ **DO**: Use `ref` as a prop directly in React 19

```typescript
function CustomButton({ ref, children, ...props }) {
  return <button ref={ref} {...props}>{children}</button>;
}
```

✅ **DO**: Use proper TypeScript types

```typescript
import { Ref } from 'react';

function Input({ ref }: { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} />;
}
```

❌ **DON'T**: Use `forwardRef` unless maintaining backward compatibility

✅ **DO**: Use callback refs for setup/cleanup logic

```typescript
function VideoPlayer({ src }) {
  const videoRef = (element: HTMLVideoElement | null) => {
    if (element) {
      element.play();
    }
  };

  return <video ref={videoRef} src={src} />;
}
```

---

## Improved TypeScript Support

React 19 includes better TypeScript support with improved type inference and stricter types.

### Better Ref Typing

```typescript
// Automatically infers correct ref type
function FocusableInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focus() {
    inputRef.current?.focus(); // Type-safe
  }

  return <input ref={inputRef} />;
}
```

### Form Action Types

```typescript
// Actions are properly typed
async function handleSubmit(formData: FormData): Promise<void> {
  const email = formData.get('email'); // string | File | null

  if (typeof email === 'string') {
    await submitEmail(email);
  }
}
```

### Component Props with Ref

```typescript
import { ComponentPropsWithRef } from 'react';

// Properly typed component with ref
type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant: 'primary' | 'secondary';
};

function Button({ variant, ref, ...props }: ButtonProps) {
  return <button ref={ref} className={`btn-${variant}`} {...props} />;
}
```

### Hook Return Types

```typescript
// useActionState with proper typing
type State = { count: number; error?: string };

const [state, dispatch, isPending] = useActionState<State, FormData>(
  async (prevState, formData) => {
    const increment = formData.get('increment') === 'true';
    return { count: prevState.count + (increment ? 1 : -1) };
  },
  { count: 0 }
);

// state: State
// dispatch: (formData: FormData) => void
// isPending: boolean
```

### Best Practices for TypeScript

✅ **DO**: Use provided utility types

```typescript
import {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementRef,
} from 'react';

type MyComponentProps = ComponentPropsWithRef<'div'> & {
  customProp: string;
};

type MyElementRef = ElementRef<'input'>; // HTMLInputElement
```

✅ **DO**: Type your form actions

```typescript
type FormState = {
  data: User | null;
  error: string | null;
};

async function updateUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Implementation
}
```

✅ **DO**: Enable strict mode in tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

❌ **DON'T**: Use `any` types (defeats the purpose of TypeScript)

---

## Breaking Changes

### Removed Deprecated APIs

#### 1. Legacy Context (`contextTypes` and `getChildContext`)

**Before**:

```typescript
// ❌ No longer supported
class OldComponent extends Component {
  static childContextTypes = {
    theme: PropTypes.string,
  };

  getChildContext() {
    return { theme: 'dark' };
  }
}
```

**After**:

```typescript
// ✅ Use modern Context API
const ThemeContext = createContext('light');

function ModernComponent({ children }) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  );
}
```

#### 2. String Refs

**Before**:

```typescript
// ❌ No longer supported
class MyComponent extends Component {
  render() {
    return <input ref="myInput" />;
  }

  componentDidMount() {
    this.refs.myInput.focus();
  }
}
```

**After**:

```typescript
// ✅ Use useRef or callback refs
function MyComponent() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

#### 3. Module Pattern Factories

**Before**:

```typescript
// ❌ No longer supported
function createComponent() {
  return {
    render() {
      return <div>Hello</div>;
    },
  };
}
```

**After**:

```typescript
// ✅ Use regular components
function Component() {
  return <div>Hello</div>;
}
```

#### 4. `defaultProps` in Function Components

**Before**:

```typescript
// ❌ No longer supported for function components
function Button({ variant }) {
  return <button className={variant}>Click me</button>;
}

Button.defaultProps = {
  variant: 'primary',
};
```

**After**:

```typescript
// ✅ Use default parameters
function Button({ variant = 'primary' }) {
  return <button className={variant}>Click me</button>;
}

// Or destructuring with defaults
function Button(props) {
  const { variant = 'primary' } = props;
  return <button className={variant}>Click me</button>;
}
```

### Behavior Changes

#### 1. Ref Cleanup Function

Refs now support cleanup functions:

```typescript
function VideoPlayer({ src }) {
  return (
    <video
      ref={(element) => {
        if (element) {
          element.play();

          // Cleanup function
          return () => {
            element.pause();
          };
        }
      }}
      src={src}
    />
  );
}
```

#### 2. Hydration Error Handling

React 19 is more forgiving with hydration mismatches:

```typescript
// Client-only content is now easier to handle
function ClientTime() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  // React 19 handles this gracefully
  return <div>{time || 'Loading...'}</div>;
}
```

#### 3. useContext Optimization

Context updates are now more optimized - components only re-render when their specific context value changes:

```typescript
const UserContext = createContext({ name: '', email: '' });

function UserName() {
  const { name } = useContext(UserContext);
  // Only re-renders when 'name' changes (in React 19)
  return <div>{name}</div>;
}
```

---

## Migration Guide

### Step 1: Update Dependencies

```bash
npm install react@19 react-dom@19
```

Update `@types` packages if using TypeScript:

```bash
npm install -D @types/react@19 @types/react-dom@19
```

### Step 2: Remove Deprecated Code

Use codemod tools to automate migration:

```bash
npx codemod@latest react/19/replace-string-ref
npx codemod@latest react/19/replace-reactdom-render
npx codemod@latest react/19/replace-default-props
```

### Step 3: Update forwardRef (Optional)

While `forwardRef` still works, you can modernize components:

```typescript
// Before
const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return <button ref={ref} {...props} />;
});

// After
function Button({ ref, ...props }: Props & { ref?: Ref<HTMLButtonElement> }) {
  return <button ref={ref} {...props} />;
}
```

### Step 4: Add React Compiler (Optional but Recommended)

```bash
npm install babel-plugin-react-compiler --save-dev
```

Update Vite config:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
});
```

### Step 5: Adopt New Patterns Gradually

Start using new hooks and patterns in new code:

1. Use `useActionState` for new forms
2. Add `useOptimistic` where appropriate
3. Use `use()` hook with Suspense for data fetching
4. Replace manual memoization with compiler optimizations

### Step 6: Test Thoroughly

- Run your test suite
- Check for console warnings
- Test forms and user interactions
- Verify performance hasn't degraded

---

## Performance Best Practices

### 1. Leverage Automatic Memoization

With the React Compiler, focus on clean code:

```typescript
// ✅ Simple, readable code - compiler optimizes
function DataDisplay({ items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const average = total / items.length;

  return (
    <div>
      <p>Total: {total}</p>
      <p>Average: {average}</p>
    </div>
  );
}
```

### 2. Use Suspense for Code Splitting

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 3. Optimize with Transitions

```typescript
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(value: string) {
    setQuery(value); // Urgent update

    startTransition(async () => {
      // Non-urgent update
      const data = await searchAPI(value);
      setResults(data);
    });
  }

  return (
    <>
      <SearchInput value={query} onChange={handleSearch} />
      {isPending ? <Skeleton /> : <Results data={results} />}
    </>
  );
}
```

### 4. Batch Related Updates

React 19 automatically batches all state updates:

```typescript
function Counter() {
  const [count, setCount] = useState(0);
  const [doubled, setDoubled] = useState(0);

  function increment() {
    // Both updates batched automatically in React 19
    setCount(c => c + 1);
    setDoubled(d => d + 2);
    // Only one re-render occurs
  }

  return <button onClick={increment}>{count} / {doubled}</button>;
}
```

### 5. Use Proper Key Props

```typescript
// ✅ Good: Stable, unique keys
function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// ❌ Bad: Index as key (can cause issues)
function BadItemList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 6. Optimize Large Lists with Virtualization

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 7. Debounce Expensive Operations

```typescript
import { useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);

  // Only re-renders with deferredQuery, allowing UI to stay responsive
  const results = useMemo(() => {
    return expensiveSearch(deferredQuery);
  }, [deferredQuery]);

  return <ResultList items={results} />;
}
```

### 8. Monitor Performance with Profiler

```typescript
import { Profiler } from 'react';

function App() {
  function onRenderCallback(
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
  ) {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  }

  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MainContent />
    </Profiler>
  );
}
```

---

## Common Patterns and Recipes

### Progressive Enhancement with Forms

```typescript
function ContactForm() {
  const [state, formAction] = useActionState(submitContact, null);

  async function submitContact(prevState: any, formData: FormData) {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to send message');

      return { success: true, message: 'Message sent!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  return (
    <form action={formAction}>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message" required />

      {state?.message && (
        <p className={state.success ? 'success' : 'error'}>
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}
```

### Optimistic Updates with Rollback

```typescript
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos);

  async function toggleTodo(id: string) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // Optimistic update
    setOptimisticTodos(current =>
      current.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !todo.completed }),
      });

      // Update real state
      setTodos(current =>
        current.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error) {
      // Automatically reverts optimistic update
      console.error('Failed to toggle todo');
    }
  }

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span className={todo.completed ? 'line-through' : ''}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

### Data Fetching with Suspense

```typescript
import { use, Suspense } from 'react';

// Resource wrapper for fetch
function fetchUser(userId: string) {
  return fetch(`/api/users/${userId}`)
    .then(res => res.json());
}

function UserProfile({ userId }: Props) {
  const user = use(fetchUser(userId));

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.bio}</p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserProfile userId="123" />
    </Suspense>
  );
}
```

### Conditional Data Loading

```typescript
function ConditionalDataComponent({ shouldLoad, dataId }: Props) {
  let data = null;

  // use() can be called conditionally!
  if (shouldLoad && dataId) {
    data = use(fetchData(dataId));
  }

  return (
    <div>
      {data ? (
        <DataDisplay data={data} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
```

---

## Additional Resources

### Official Documentation

- [React 19 Blog Post](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/12/05/react-19-upgrade-guide)
- [React Compiler Documentation](https://react.dev/learn/react-compiler)

### TypeScript

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React 19 TypeScript Guide](https://react.dev/learn/typescript)

### Tools

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [React Compiler Playground](https://playground.react.dev/)

### Migration Tools

- [React Codemods](https://github.com/reactjs/react-codemod)
- React 19 Migration Scripts (included in npm codemods)

---

## Summary

React 19 represents a significant evolution focused on:

1. **Automatic Optimization**: The React Compiler eliminates most manual memoization
2. **Better DX**: New hooks simplify complex patterns (Actions, Optimistic Updates)
3. **Performance**: Improved concurrent rendering and transitions
4. **Type Safety**: Enhanced TypeScript support
5. **Simplicity**: Ref as a prop, native metadata support

### Key Takeaways

- **Remove manual memoization** in most cases - trust the compiler
- **Use new hooks** for forms and async operations: `useActionState`, `useOptimistic`, `useFormStatus`
- **Leverage Actions API** for progressive enhancement
- **Adopt `use()` hook** with Suspense for cleaner data fetching
- **Simplify refs** by treating them as regular props
- **Update metadata** directly in components for better SEO

### Migration Priority

1. ✅ Update to React 19 and test existing code
2. ✅ Remove deprecated APIs (string refs, legacy context)
3. ✅ Install React Compiler for automatic optimization
4. ✅ Adopt new patterns in new code
5. ✅ Gradually refactor existing code to use new features

React 19 makes building performant, user-friendly applications easier than ever. Focus on writing clean, maintainable code, and let React handle the optimization!
