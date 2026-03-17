import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { getFn as getCragsFn } from '@/data/actions/crags/get'
import { logError } from '@/lib/log'

export const Route = createFileRoute('/home')({
  loader: async () => {
    const popularCrags = await getCragsFn({
      data: { sortBy: 'logCount', sortOrder: 'DESC' as const, limit: 3 },
    }).catch((err) => { logError('loader:home', err); return null }) as any[] | null

    return { popularCrags }
  },
  component: HomePage,
})

function HomePage() {
  const { popularCrags } = Route.useLoaderData()

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">Welcome to ClimbingTopos.com</h1>
          <h5 className="subtitle is-5">Made in Yorkshire</h5>
        </div>
      </section>

      {popularCrags?.length ? (
        <section className="section">
          <div className="container">
            <h1 className="title">Popular Crags</h1>
            <div className="columns">
              {popularCrags.map((crag) => (
                <div key={crag.slug} className="column">
                  <Link to="/crags/$cragSlug" params={{ cragSlug: crag.slug }}>
                    <div className="card">
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img
                            loading="lazy"
                            src={`${crag.image}`}
                            alt={crag.title}
                          />
                        </figure>
                      </div>
                      <div className="card-content">
                        <p className="title is-4">{crag.title}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
