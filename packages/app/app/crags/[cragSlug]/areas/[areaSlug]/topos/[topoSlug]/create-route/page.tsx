'use server';

import CreateRouteForm from './CreateRouteForm';
import { post } from '@/app/data/actions/routes/post';
import AuthenticaedRoute from '@/app/components/AuthenticatedRoute';

async function CreateTopo(
  props: {
    params: Promise<{ cragSlug: string; areaSlug: string; topoSlug: string }>;
  }
) {
  const params = await props.params;

  const {
    cragSlug,
    areaSlug,
    topoSlug
  } = params;

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
