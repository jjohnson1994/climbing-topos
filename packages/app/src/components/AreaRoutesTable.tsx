import { lazy, Suspense, useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Log, Route } from '@climbingtopos/types'
import { useGradeHelpers } from '@/api/grades'
import RatingStarsDisplay from '@/components/RatingStarsDisplay'

const AreaRouteTableMenu = lazy(() => import('./AreaRouteTableMenu'))

interface Props {
  routes: Route[] | undefined
  loggedRoutes: Log[]
  isAuthenticated: boolean
}

function AreaRoutesTable({ routes, loggedRoutes, isAuthenticated }: Props) {
  const { convertGradeValueToGradeLabel } = useGradeHelpers()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const hasUserLoggedRoute = (routeSlug: string) => {
    return loggedRoutes.findIndex((log) => log.routeSlug === routeSlug) !== -1
  }

  return (
    <>
      <div>
        {routes?.map((route, index) => (
          <div className="box block is-flex" key={index}>
            <div className="is-flex mr-4 is-justify-content-center is-align-items-center">
              <span>{index + 1}</span>
            </div>
            <div className="is-flex is-flex-direction-column is-flex-grow-1">
              <span className="mb-2">
                <Link
                  to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug"
                  params={{
                    cragSlug: route.cragSlug,
                    areaSlug: route.areaSlug,
                    topoSlug: route.topoSlug,
                    routeSlug: route.slug,
                  }}
                  className={
                    hasUserLoggedRoute(String(route.slug)) ? 'line-through' : ''
                  }
                >
                  {route.title}
                </Link>
                <span className="mr-2"></span>
                <RatingStarsDisplay stars={route.rating} />
              </span>
              <div className="tags">
                {route.verified !== true && (
                  <span className="tag is-info">Not Verified</span>
                )}
                <span className="tag">
                  {convertGradeValueToGradeLabel(
                    route.gradeModal,
                    route.gradingSystem,
                  )}
                </span>
                <span className="tag">{route.routeType}</span>
                <span className="tag">{route.logCount} Ticks</span>
              </div>
            </div>
            <div>
              {mounted && (
                <Suspense fallback={null}>
                  <AreaRouteTableMenu
                    isAuthenticated={isAuthenticated}
                    route={route}
                  />
                </Suspense>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default AreaRoutesTable
