import { createFileRoute, redirect } from '@tanstack/react-router'
import { getFn as getCragFn } from '@/data/actions/crags/get'
import CreateAreaForm from '@/components/CreateAreaForm'
import { logError } from '@/lib/log'

export const Route = createFileRoute('/crags/$cragSlug/create-area')({
  beforeLoad: async ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
  },
  loader: async ({ params }) => {
    try {
      const crag = await getCragFn({ data: { cragSlug: params.cragSlug } })
      return { crag }
    } catch (err) {
      logError('loader:create-area', err, { cragSlug: params.cragSlug })
      throw err
    }
  },
  component: CreateAreaPage,
})

function CreateAreaPage() {
  const { crag } = Route.useLoaderData()

  return (
    <section className="section">
      <div className="container box">
        <CreateAreaForm crag={crag} />
      </div>
    </section>
  )
}
