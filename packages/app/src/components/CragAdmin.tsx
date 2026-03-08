import { Area, Crag, Route, Topo } from '@climbingtopos/types'
import { popupError } from '@/helpers/alerts'
import { getFn as getCragItemsAwaitingApprovalFn } from '@/data/actions/crags/items-awaiting-approval/get'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

interface CragAdminProps {
  crag: Crag
}

const isNotError = (items: any): items is Array<Topo | Area | Route> => {
  return items?.error === undefined
}

function CragAdmin(props: CragAdminProps) {
  const [itemsAwaitingApproval, setItemsAwaitingApproval] = useState<
    Array<Topo | Area | Route>
  >([])

  useEffect(() => {
    const load = async () => {
      try {
        const newItems = await getCragItemsAwaitingApprovalFn({
          data: { slug: props.crag.slug },
        })

        if (isNotError(newItems)) {
          setItemsAwaitingApproval(newItems)
        }
      } catch (error) {
        popupError('There was an error loading this crag. Please try again.')
      }
    }

    load()
  }, [props.crag.slug])

  const renderTopoListItem = (topo: Topo) => (
    <Link
      to="/crags/$cragSlug/areas/$areaSlug"
      params={{ cragSlug: topo.cragSlug, areaSlug: topo.areaSlug }}
    >
      <div className="block box p-0 mb-5" style={{ overflow: 'hidden' }}>
        <div className="columns is-mobile is-gapless">
          <div className="column is-narrow">
            <img
              src={`${topo.image}`}
              className="image is-128x128"
              alt="new topo"
              style={{
                objectFit: 'cover',
                height: '100%',
              }}
            />
          </div>
          <div className="column m-3">
            <div className="tags">
              <span className="tag is-info">New Topos</span>
            </div>
            <p className="is-size-7">Uploaded by {topo.createdBy.nickname}</p>
          </div>
        </div>
      </div>
    </Link>
  )

  const renderRouteListItem = (route: Route) => (
    <Link
      to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug"
      params={{
        cragSlug: route.cragSlug,
        areaSlug: route.areaSlug,
        topoSlug: route.topoSlug,
        routeSlug: route.slug,
      }}
    >
      <div className="block box p-0 mb-5" style={{ overflow: 'hidden' }}>
        <div className="columns is-mobile is-gapless">
          <div className="column m-3">
            <p className="is-capitalized mb-1">
              <b>{route.title}</b>
            </p>
            <div className="tags">
              <span className="tag is-info">New Route</span>
              {route.tags.map((tag) => (
                <span className="tag">{tag}</span>
              ))}
            </div>
            <p className="is-size-7">Uploaded by {route.createdBy.nickname}</p>
          </div>
        </div>
      </div>
    </Link>
  )

  const renderAreaListItem = (area: Area) => (
    <Link
      to="/crags/$cragSlug/areas/$areaSlug"
      params={{ cragSlug: area.cragSlug, areaSlug: area.slug }}
    >
      <div className="block box p-0 mb-5" style={{ overflow: 'hidden' }}>
        <div className="columns is-mobile is-gapless">
          <div className="column m-3">
            <p className="is-capitalized mb-1">
              <b>{area.title}</b>
            </p>
            <div className="tags">
              <span className="tag is-info">New Area</span>
              <span className="tag">{area.rockType}</span>
              <span className="tag">Access {area.access}</span>
              {area.tags.map((tag) => (
                <span className="tag">{tag}</span>
              ))}
            </div>
            <p className="is-size-7">Uploaded by {area.createdBy.nickname}</p>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <>
      <div className="container">
        <h1 className="title">Awaiting Approval</h1>
        <div>
          {itemsAwaitingApproval.length === 0 && (
            <p>There are no items awaiting approval</p>
          )}
        </div>
        <div>
          {itemsAwaitingApproval.map((itemAwaitingApproval) => {
            if (itemAwaitingApproval.model === 'route') {
              return (
                <div key={itemAwaitingApproval.slug}>
                  {renderRouteListItem(
                    itemAwaitingApproval as unknown as Route,
                  )}
                </div>
              )
            }

            if (itemAwaitingApproval.model === 'area') {
              return (
                <div key={itemAwaitingApproval.slug}>
                  {renderAreaListItem(itemAwaitingApproval as unknown as Area)}
                </div>
              )
            }

            if (itemAwaitingApproval.model === 'topo') {
              return (
                <div key={itemAwaitingApproval.slug}>
                  {renderTopoListItem(itemAwaitingApproval as unknown as Topo)}
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </>
  )
}

export default CragAdmin
