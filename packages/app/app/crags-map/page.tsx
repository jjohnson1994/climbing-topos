"use client"

import dynamic from 'next/dynamic'

const CragsMap = dynamic(() => import('@/app/components/CragsMap'), { ssr: false })

function CragsMapPage() {
  return (
   <CragsMap />
  );
}

export default CragsMapPage;
