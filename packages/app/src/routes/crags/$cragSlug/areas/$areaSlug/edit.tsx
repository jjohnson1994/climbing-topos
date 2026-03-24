import { createFileRoute, redirect } from '@tanstack/react-router';
import { getFn as getAreaFn } from '@/data/actions/areas/get';
import { getFn as getCragFn } from '@/data/actions/crags/get';
import EditAreaForm from '@/components/EditAreaForm';
import { logError } from '@/lib/log';

export const Route = createFileRoute('/crags/$cragSlug/areas/$areaSlug/edit')({
  beforeLoad: async ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' });
  },
  loader: async ({ params, context }) => {
    const { cragSlug, areaSlug } = params;
    try {
      const user = context.user as any;

      const [area, crag] = await Promise.all([
        getAreaFn({ data: { areaSlug } }),
        getCragFn({ data: { cragSlug } }),
      ]);

      if (crag.managedBy.sub !== user.properties.sub) {
        throw redirect({
          to: '/crags/$cragSlug/areas/$areaSlug',
          params: { cragSlug, areaSlug },
        });
      }

      return { area, crag };
    } catch (err) {
      logError('loader:edit-area', err, { cragSlug, areaSlug });
      throw err;
    }
  },
  component: EditAreaPage,
});

function EditAreaPage() {
  const { area } = Route.useLoaderData();
  const { cragSlug, areaSlug } = Route.useParams();

  return (
    <EditAreaForm area={area} cragSlug={cragSlug} areaSlug={areaSlug} />
  );
}
