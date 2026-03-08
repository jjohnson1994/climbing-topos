import { useContext } from 'react'
import { RouteLogContext } from '@/components/RouteLogContext'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@climbingtopos/types'

export default function ButtonSaveToList({
  isAuthenticated,
  route,
}: {
  isAuthenticated: boolean
  hasUserLoggedRoute?: boolean
  route: Route
}) {
  const context = useContext(RouteLogContext)
  const navigate = useNavigate()

  const btnSaveToListOnClick = () => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    } else if (route) {
      context.onSingleRouteAddToList(route)
    }
  }

  return (
    <button className="button" onClick={btnSaveToListOnClick}>
      <span className="icon is-small">
        <i className="fas fw fa-list"></i>
      </span>
      <span>Save to List</span>
    </button>
  )
}
