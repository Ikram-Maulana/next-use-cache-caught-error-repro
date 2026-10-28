# Caught error in a `'use cache'` fill fails the render

`/item/[id]` calls a `'use cache'` function that throws for ids starting with `bad`. The page catches the error and renders a fallback.

| Route | What it is |
|---|---|
| `/control/[id]` | The same page without `'use cache'` |
| `/nav/[id]` | The same page plus `ensureStatic = "navigation"` |
| `/uncaught/[id]` | The same `'use cache'` function, error not caught |
| `/suspense/[id]` | The caught read inside `<Suspense>` |

```sh
npm install

# 1. Build: fails, although the error is caught.
SAMPLE_ID=bad npx next build

# 2. Runtime: a caught error answers 500.
npx next build && npx next start -p 3124
curl -si localhost:3124/item/bad | head -1      # HTTP/1.1 500, body has "bad: fallback"
curl -si localhost:3124/control/bad | head -1   # HTTP/1.1 200, cached from the second request
```

With `partialPrefetching: true` in `next.config.ts`:
- `/item/bad` answers 200 with the fallback but is never cached. Every request renders again and calls the `'use cache'` function again.
- `/nav/bad` answers 500.

Works on 16.0.10. Fails on 16.1.0, 16.2.12, 16.4.3 and 16.5.0-canary.29.
