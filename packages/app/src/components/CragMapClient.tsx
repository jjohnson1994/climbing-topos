import { Suspense, lazy } from 'react'
import { ClientOnly } from '@tanstack/react-router'
import { Crag } from '@climbingtopos/types'

const CragMap = lazy(() => import('./CragMap'))

export default function CragMapClient({ crag }: { crag: Crag }) {
  return (
    <ClientOnly>
      <Suspense fallback={<div />}>
        <CragMap crag={crag} />
      </Suspense>
    </ClientOnly>
  )
}
