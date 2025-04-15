'use server';

import CreateRouteForm from './CreateRouteForm';
import { post } from '@/app/data/actions/routes/post';
import AuthenticaedRoute from '@/app/components/AuthenticatedRoute';

async function CreateTopo({
  params: { cragSlug, areaSlug, topoSlug },
}: {
  params: { cragSlug: string; areaSlug: string; topoSlug: string };
}) {
  return (
    <AuthenticaedRoute>
      <CreateRouteForm
        post={post}
        topoSlug={topoSlug}
        cragSlug={cragSlug}
        areaSlug={areaSlug}
      />
    </AuthenticaedRoute>
  );
}

export default CreateTopo;
