'use server';

import CreateAreaForm from './CreateAreaForm';
import { post as createArea } from '@/app/data/actions/areas/post';
import { get as getCragBySlug } from '@/app/data/actions/crags/get';
import AuthenticaedRoute from '@/app/components/AuthenticatedRoute';

async function CreateArea({
  params: { cragSlug },
}: {
  params: { cragSlug: string };
}) {
  const crag = await getCragBySlug(cragSlug);

  console.log('crag', crag);

  return (
    <AuthenticaedRoute>
      <section className="section">
        <div className="container box">
          <CreateAreaForm post={createArea} crag={crag} />
        </div>
      </section>
    </AuthenticaedRoute>
  );
}

export default CreateArea;
