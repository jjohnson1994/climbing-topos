import { useContext } from 'react'
import { RouteLogContext } from '@/components/RouteLogContext'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@climbingtopos/types'

export default function ButtonLogRoute({
  isAuthenticated,
  route,
}: {
  isAuthenticated: boolean
  route: Route
}) {
  const context = useContext(RouteLogContext)
  const navigate = useNavigate()

  const btnDoneOnClick = () => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    } else if (route) {
      context.onSingleRouteDone(route)
    }
  }

  const hasUserLoggedRoute = () => {
    if (route) {
      return (
        route.userLogs.length ||
        context.routesJustLogged.findIndex(
          (logged) => logged.slug === route.slug,
        ) !== -1
      )
    }

    return false
  }

  return (
    <button className="button" onClick={btnDoneOnClick}>
      {hasUserLoggedRoute() ? (
        <>
          <span className="icon is-small">
            <i className="fas fw fa-check"></i>
          </span>
          <span>Done</span>
        </>
      ) : (
        <>
          <span className="icon is-small">
            <i className="fas fw fa-plus"></i>
          </span>
          <span>Log Book</span>
        </>
      )}
    </button>
  )
}
