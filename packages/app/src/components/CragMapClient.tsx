import { Suspense, lazy } from 'react'
import { Crag } from '@climbingtopos/types'

const CragMap = lazy(() => import('./CragMap'))

export default function CragMapClient({ crag }: { crag: Crag }) {
  return (
    <Suspense fallback={<div />}>
      <CragMap crag={crag} />
    </Suspense>
  )
}
