import { createFileRoute, redirect } from '@tanstack/react-router'
import CreateTopoForm from '@/components/CreateTopoForm'

export const Route = createFileRoute('/crags/$cragSlug/create-topo/$areaSlug')({
  beforeLoad: async ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
  },
  component: CreateTopoPage,
})

function CreateTopoPage() {
  const { cragSlug, areaSlug } = Route.useParams()

  return (
    <section className="section">
      <div className="container box">
        <CreateTopoForm cragSlug={cragSlug} areaSlug={areaSlug} />
      </div>
    </section>
  )
}
