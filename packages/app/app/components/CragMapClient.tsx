'use client';

import dynamic from 'next/dynamic';
import { Crag } from '@climbingtopos/types';

const CragMap = dynamic(() => import('./CragMap'), { ssr: false });

export default function CragMapClient({ crag }: { crag: Crag }) {
  return <CragMap crag={crag} />;
}
