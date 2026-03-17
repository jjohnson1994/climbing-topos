import {
  createRootRouteWithContext,
  Outlet,
  HeadContent,
  Scripts,
  redirect,
  ErrorComponent,
} from '@tanstack/react-router'
import type { JwtPayload } from '@/lib/jwt'
import { getAuthUser } from '@/lib/auth'
import Nav from '@/components/Nav'
import Providers from '@/components/providers'
import Footer from '@/components/Footer'
import '../globals.scss'

interface RouterContext {
  user: JwtPayload | false | undefined
}

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: ({ error }) => {
    return (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <section className="section">
            <div className="container">
              <ErrorComponent error={error} />
            </div>
          </section>
          <Scripts />
        </body>
      </html>
    )
  },
  beforeLoad: async ({ location }) => {
    const user = await getAuthUser()

    if (!user) return { user: false as false }

    const isAccountSetupComplete = !!user.properties?.picture
    const isPendingUser = user.properties?.status === 'pending'
    const path = location.pathname

    const isSignupConfirmPage = path === '/signup-confirm'
    const isFirstLoginPage = path === '/first-login'
    const isAuthPage =
      path === '/login' ||
      path === '/signup' ||
      path.startsWith('/reset-password') ||
      path.startsWith('/api/')

    if (isSignupConfirmPage || isAuthPage) return { user }

    if (isPendingUser) {
      throw redirect({ to: '/signup-confirm' })
    }

    if (!isAccountSetupComplete && !isFirstLoginPage) {
      throw redirect({ to: '/first-login' })
    }

    return { user }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'ClimbingTopos' },
    ],
    scripts: [
      {
        src: 'https://kit.fontawesome.com/4b877c229a.js',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function NotFoundComponent() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="title">404 - Page Not Found</h1>
      </div>
    </section>
  )
}

function RootComponent() {
  const { user } = Route.useRouteContext()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Nav subject={user || false} />
        <Providers>
          <Outlet />
        </Providers>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
