import { yupResolver } from '@hookform/resolvers/yup';
import { UpdateRouteScheme } from '@climbingtopos/schemas';
import { Route, RoutePatch } from '@climbingtopos/types';
import { gradingSystems, routeTypes, routeTags } from '@climbingtopos/globals';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useRouter, Link } from '@tanstack/react-router';
import { popupError, popupSuccess } from '@/helpers/alerts';
import { patchFn } from '@/data/actions/routes/patch';

const schema = UpdateRouteScheme();

function EditRouteForm({
  route,
  cragSlug,
  areaSlug,
  topoSlug,
  routeSlug,
}: {
  route: Route;
  cragSlug: string;
  areaSlug: string;
  topoSlug: string;
  routeSlug: string;
}) {
  const navigate = useNavigate();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema as any) as any,
    mode: 'onChange',
    defaultValues: {
      title: route.title,
      description: route.description,
      tags: route.tags ?? [],
      routeType: route.routeType,
      gradingSystem: route.gradingSystem,
      grade: route.grade,
      drawing: route.drawing,
    },
  });

  const watchGradingSystem = watch('gradingSystem', route.gradingSystem);
  const watchTags = watch('tags');

  const getGradesFromGradingSystem = (gradingSystem: string) => {
    const grades = gradingSystems?.find(
      (_gradingSystem) => _gradingSystem.title === gradingSystem,
    )?.grades;
    return Array.from(new Set(grades));
  };

  const formOnSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true);

      const routePatch: RoutePatch = {};
      if (formData.title !== route.title) routePatch.title = formData.title;
      if (formData.description !== route.description)
        routePatch.description = formData.description;
      if (JSON.stringify(formData.tags) !== JSON.stringify(route.tags ?? []))
        routePatch.tags = formData.tags as string[];
      if (formData.routeType !== route.routeType)
        routePatch.routeType = formData.routeType;
      if (formData.gradingSystem !== route.gradingSystem)
        routePatch.gradingSystem = formData.gradingSystem;
      if (formData.grade !== route.grade) routePatch.grade = formData.grade;

      if (Object.keys(routePatch).length === 0) {
        navigate({
          to: '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug',
          params: { cragSlug, areaSlug, topoSlug, routeSlug },
        });
        return;
      }

      await patchFn({ data: { routeSlug, body: routePatch } });
      await router.invalidate();
      await popupSuccess('Route Updated!');
      navigate({
        to: '/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug',
        params: { cragSlug, areaSlug, topoSlug, routeSlug },
      });
    } catch (error) {
      popupError('Ahh, something has gone wrong...');
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      <section className="section">
        <div className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <Link to="/crags/$cragSlug" params={{ cragSlug }}>
                  {route.cragTitle}
                </Link>
              </li>
              <li>
                <Link
                  to="/crags/$cragSlug/areas/$areaSlug"
                  params={{ cragSlug, areaSlug }}
                >
                  {route.areaTitle}
                </Link>
              </li>
              <li>
                <Link
                  to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug"
                  params={{ cragSlug, areaSlug, topoSlug, routeSlug }}
                >
                  {route.title}
                </Link>
              </li>
              <li className="is-active">
                <a>Edit</a>
              </li>
            </ul>
          </nav>
        </div>
      </section>
      <section className="section">
        <div className="container box">
          <h1 className="title">Edit Route</h1>
          <form
            onSubmit={formOnSubmit}
            style={{ display: 'flex', flexDirection: 'column' }}
            autoComplete="off"
          >
            <div className="field">
              <label className="label" htmlFor="title">
                Title
              </label>
              <div className="control">
                <input className="input" type="text" {...register('title')} />
              </div>
              <p className="help is-danger">{errors.title?.message}</p>
            </div>

            <div className="field">
              <label className="label" htmlFor="description">
                Description
              </label>
              <div className="control">
                <textarea
                  className="textarea"
                  {...register('description')}
                ></textarea>
              </div>
              <p className="help is-danger">{errors.description?.message}</p>
            </div>

            <div className="field">
              <label className="label">Tags</label>
              <div className="field is-grouped is-grouped-multiline">
                <div role="group" className="tags">
                  {routeTags.map((tag) => (
                    <label
                      key={tag}
                      className={`tag ${watchTags?.includes(tag) ? 'is-primary' : ''}`}
                    >
                      <input
                        type="checkbox"
                        value={tag}
                        {...register('tags')}
                        style={{ display: 'none' }}
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>
              <p className="help is-danger">{(errors.tags as any)?.message}</p>
            </div>

            <div className="field">
              <label className="label">Route Type</label>
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select {...register('routeType')}>
                    {routeTypes.map((routeType) => (
                      <option key={routeType} value={routeType}>
                        {routeType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="help is-danger">{errors.routeType?.message}</p>
            </div>

            <div className="field">
              <label className="label">Grading System</label>
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select {...register('gradingSystem')}>
                    {gradingSystems.map((gradingSystem) => (
                      <option
                        key={gradingSystem.title}
                        value={gradingSystem.title}
                      >
                        {gradingSystem.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="help is-danger">{errors.gradingSystem?.message}</p>
            </div>

            <div className="field">
              <label className="label">Grade</label>
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select {...register('grade')}>
                    {watchGradingSystem &&
                      getGradesFromGradingSystem(
                        getValues('gradingSystem'),
                      )?.map((grade, index) => (
                        <option key={grade} value={index}>
                          {grade}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <p className="help is-danger">{errors.grade?.message}</p>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button
                  className={`button is-primary ${loading ? 'is-loading' : ''}`}
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
              <div className="control">
                <Link
                  to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug"
                  params={{ cragSlug, areaSlug, topoSlug, routeSlug }}
                  className="button is-light"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default EditRouteForm;
