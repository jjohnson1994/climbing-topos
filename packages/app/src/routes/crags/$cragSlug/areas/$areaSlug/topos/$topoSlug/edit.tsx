import { createFileRoute, redirect } from '@tanstack/react-router';
import { getFn as getTopoFn } from '@/data/actions/topos/get';
import { getFn as getAreaFn } from '@/data/actions/areas/get';
import { getFn as getCragFn } from '@/data/actions/crags/get';
import EditTopoForm from '@/components/EditTopoForm';
import { logError } from '@/lib/log';

export const Route = createFileRoute(
  '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/edit',
)({
  beforeLoad: async ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' });
  },
  loader: async ({ params, context }) => {
    const { cragSlug, areaSlug, topoSlug } = params;
    try {
      const user = context.user as any;

      const [topo, area, crag] = await Promise.all([
        getTopoFn({ data: { topoSlug } }),
        getAreaFn({ data: { areaSlug } }),
        getCragFn({ data: { cragSlug } }),
      ]);

      if (crag.managedBy.sub !== user.properties.sub) {
        throw redirect({
          to: '/crags/$cragSlug/areas/$areaSlug',
          params: { cragSlug, areaSlug },
        });
      }

      return { topo, area, crag };
    } catch (err) {
      logError('loader:edit-topo', err, { cragSlug, areaSlug, topoSlug });
      throw err;
    }
  },
  component: EditTopoPage,
});

function EditTopoPage() {
  const { topo, area, crag } = Route.useLoaderData();
  const { cragSlug, areaSlug } = Route.useParams();

  return (
    <EditTopoForm
      topo={topo}
      cragSlug={cragSlug}
      areaSlug={areaSlug}
      areaTitle={area.title}
      cragTitle={crag.title}
    />
  );
}
