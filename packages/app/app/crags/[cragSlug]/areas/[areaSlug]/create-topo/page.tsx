'use server';

import CreateTopoForm from './CreateTopoForm';
import { post } from '@/app/data/actions/topos/post';
import AuthenticaedRoute from '@/app/components/AuthenticatedRoute';

async function CreateTopo(
  props: {
    params: Promise<{ cragSlug: string; areaSlug: string }>;
  }
) {
  const params = await props.params;

  const {
    cragSlug,
    areaSlug
  } = params;

  return (
    <AuthenticaedRoute>
      <section className="section">
        <div className="container box">
          <CreateTopoForm post={post} cragSlug={cragSlug} areaSlug={areaSlug} />
        </div>
      </section>
    </AuthenticaedRoute>
  );
}

export default CreateTopo;
