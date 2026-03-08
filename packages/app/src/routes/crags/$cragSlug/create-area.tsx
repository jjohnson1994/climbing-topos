import { createFileRoute, redirect } from '@tanstack/react-router'
import { getFn as getCragFn } from '@/data/actions/crags/get'
import CreateAreaForm from '@/components/CreateAreaForm'

export const Route = createFileRoute('/crags/$cragSlug/create-area')({
  beforeLoad: async ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
  },
  loader: async ({ params }) => {
    const crag = await getCragFn({ data: { cragSlug: params.cragSlug } })
    return { crag }
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
