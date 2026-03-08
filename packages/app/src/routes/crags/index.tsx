import { createFileRoute, Link } from '@tanstack/react-router'
import { getFn as getCragsFn } from '@/data/actions/crags/get'

export const Route = createFileRoute('/crags/')({
  loader: async () => {
    const response = await getCragsFn({ data: { limit: 100 } })
    const crags = Array.isArray(response)
      ? response.sort((a, b) => (a.title > b.title ? 1 : -1))
      : []
    return { crags }
  },
  component: CragsPage,
})

function CragsPage() {
  const { crags } = Route.useLoaderData()

  return (
    <section className="section">
      <div className="container">
        <div className="block">
          <div className="field is-grouped">
            <div className="control is-expanded has-icons-left">
              <span className="icon is-icon-left">
                <i className="fas fa-search"></i>
              </span>
              <input
                className="input is-rounded"
                type="text"
                placeholder="Filter"
              />
            </div>
            <div className="control">
              <Link to="/create-crag" className="button is-rounded">
                <span className="icon is-small">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Add Crag</span>
              </Link>
            </div>
          </div>
        </div>
        {crags?.map((crag) => (
          <div key={crag.slug} className="block">
            <Link to="/crags/$cragSlug" params={{ cragSlug: crag.slug }}>
              <div className="block box p-0" style={{ overflow: 'hidden' }}>
                <div className="columns is-mobile is-gapless">
                  <div className="column is-narrow">
                    <img
                      src={`${crag.image}`}
                      className="image is-128x128"
                      alt={crag.title}
                      style={{
                        objectFit: 'cover',
                        height: '100%',
                      }}
                    />
                  </div>
                  <div className="column m-3">
                    <p className="is-capitalized">
                      <b>{crag.title}</b> {(crag as any).county}, {(crag as any).country}
                    </p>
                    <div className="tags">
                      <span className="tag">Routes {crag.routeCount}</span>
                      <span className="tag">Areas {crag.areaCount}</span>
                      <span className="tag">Logs {crag.logCount}</span>
                    </div>
                    <p className="is-capitalized">
                      {crag.description.substring(0, 280)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
