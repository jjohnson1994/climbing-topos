# TanStack Start Route-Based Tabs Quick Start

## Overview

This guide shows how to implement performant, accessible, SEO-friendly
tabs using TanStack Start with file-based routing.

------------------------------------------------------------------------

## 1. Create a project

``` bash
npx create-tsrouter-app@latest my-app --template file-router
cd my-app
npm run dev
```

------------------------------------------------------------------------

## 2. Core idea

Tabs = nested routes, not UI state.

------------------------------------------------------------------------

## 3. File structure

    src/routes/
    ├── product.$id.tsx
    ├── product.$id.overview.tsx
    ├── product.$id.reviews.tsx
    ├── product.$id.specs.tsx

------------------------------------------------------------------------

## 4. Layout (tabs shell)

``` tsx
import { createFileRoute, Outlet, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/product/$id')({
  component: ProductLayout,
})

function ProductLayout() {
  const { id } = Route.useParams()

  return (
    <div>
      <nav>
        <Link to="/product/$id/overview" params={{ id }}>Overview</Link>
        <Link to="/product/$id/reviews" params={{ id }}>Reviews</Link>
        <Link to="/product/$id/specs" params={{ id }}>Specs</Link>
      </nav>

      <Outlet />
    </div>
  )
}
```

------------------------------------------------------------------------

## 5. Example tab route

``` tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/product/$id/overview')({
  loader: async ({ params }) => {
    return fetch(`/api/products/${params.id}`).then(r => r.json())
  },
  component: OverviewPage,
})
```

------------------------------------------------------------------------

## 6. Preloading

``` tsx
<Link to="/product/$id/reviews" params={{ id }} preload="intent">
  Reviews
</Link>
```

------------------------------------------------------------------------

## 7. Accessibility

``` tsx
<Link
  to="/product/$id/reviews"
  params={{ id }}
  activeProps={{ 'aria-current': 'page' }}
>
  Reviews
</Link>
```

------------------------------------------------------------------------

## 8. SEO

``` tsx
export const Route = createFileRoute('/product/$id/reviews')({
  head: () => ({
    meta: [{ title: 'Product Reviews' }],
  }),
})
```

------------------------------------------------------------------------

## 9. Default redirect

``` tsx
import { redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/product/$id')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/product/$id/overview',
      params,
    })
  },
})
```

------------------------------------------------------------------------

## Best Practices

-   Use routes, not state
-   Fetch per tab
-   Use preloading
-   Use links (not ARIA tablist)

------------------------------------------------------------------------

## Summary

Route-based tabs give you: - SSR performance - Great UX -
Accessibility - SEO
