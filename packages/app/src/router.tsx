import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import type { JwtPayload } from './lib/jwt'

let router: ReturnType<typeof createRouter>

export function createRouter() {
  return createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: { user: undefined as JwtPayload | false | undefined },
  })
}

export function getRouter() {
  if (!router) {
    router = createRouter()
  }
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
