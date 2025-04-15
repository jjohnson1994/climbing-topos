'use server';

import CreateTopoForm from './CreateTopoForm';
import { post } from '@/app/data/actions/topos/post';
import AuthenticaedRoute from '@/app/components/AuthenticatedRoute';

async function CreateTopo({
  params: { cragSlug, areaSlug },
}: {
  params: { cragSlug: string; areaSlug: string };
}) {
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
