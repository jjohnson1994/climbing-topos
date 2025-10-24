import { auth } from '@/app/actions';
import { get as getRoute } from '@/app/data/actions/routes/get';
import { get as getCrag } from '@/app/data/actions/crags/get';
import { patch } from '@/app/data/actions/routes/patch';
import { redirect } from 'next/navigation';
import EditRouteForm from './EditRouteForm';

async function EditRoutePage({
  params,
}: {
  params: {
    cragSlug: string;
    areaSlug: string;
    topoSlug: string;
    routeSlug: string;
  };
}) {
  const { cragSlug, areaSlug, topoSlug, routeSlug } = params;
  const user = await auth();

  if (!user) {
    redirect('/login');
  }

  const route = await getRoute(cragSlug, areaSlug, topoSlug, routeSlug);
  const crag = await getCrag(cragSlug);

  // Check if user is the crag maintainer
  if (crag.managedBy.sub !== user.properties.sub) {
    redirect(`/crags/${cragSlug}/areas/${areaSlug}/topos/${topoSlug}/routes/${routeSlug}`);
  }

  return (
    <EditRouteForm
      patch={patch}
      route={route}
      cragSlug={cragSlug}
      areaSlug={areaSlug}
      topoSlug={topoSlug}
      routeSlug={routeSlug}
    />
  );
}

export default EditRoutePage;
