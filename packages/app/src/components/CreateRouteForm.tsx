import { yupResolver } from '@hookform/resolvers/yup';
import { NewRouteScheme } from '@climbingtopos/schemas';
import { Area, RouteDrawing } from '@climbingtopos/types';
import { gradingSystems, routeTags, routeTypes } from '@climbingtopos/globals';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getFn as getAreaFn } from '@/data/actions/areas/get';
import { getFn as getTopoFn } from '@/data/actions/topos/get';
import { useNavigate } from '@tanstack/react-router';
import TopoCanvas from '@/components/TopoCanvas';
import { popupError, popupSuccess } from '@/helpers/alerts';
import { postFn } from '@/data/actions/routes/post';

const schema = NewRouteScheme();

function CreateRouteForm({
  areaSlug,
  cragSlug,
  topoSlug,
}: {
  areaSlug: string;
  cragSlug: string;
  topoSlug: string;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [area, setArea] = useState<Area | undefined>();
  const [backgroundImageURL, setBackgroundImageURL] = useState('');

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema as any) as any,
    mode: 'onChange',
    defaultValues: {
      areaSlug,
      cragSlug,
      description: '',
      drawing: { points: [] } as RouteDrawing,
      grade: '',
      gradingSystem: '',
      routeType: '',
      tags: [] as string[],
      title: '',
      topoSlug,
    },
  });

  const watchTags = watch('tags');
  const watchGradingSystem = watch('gradingSystem', '');

  useEffect(() => {
    const doGetArea = async () => {
      try {
        const area = await getAreaFn({ data: { areaSlug } });
        setArea(area);
      } catch (error) {
        popupError('Oh dear, there was a problem loading this area');
        console.error('Error creating route', { error });
      }
    };

    const doGetTopo = async () => {
      const topo = await getTopoFn({ data: { topoSlug } });
      setBackgroundImageURL(`${topo.image}`);
    };

    doGetArea();
    doGetTopo();
  }, [areaSlug, topoSlug]);

  const getGradesFromGradingSystem = (gradingSystem: string) => {
    const grades = gradingSystems?.find(
      (_gradingSystem) => _gradingSystem.title === gradingSystem,
    )?.grades;
    return Array.from(new Set(grades));
  };

  const onDrawingChanged = (drawing: RouteDrawing) => {
    setValue('drawing', drawing);
  };

  const formOnSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true);

      if (!area) {
        throw new Error('Error creating route, area not found');
      }

      const result = await postFn({
        data: {
          ...formData,
          areaTitle: area.title,
          country: area.country,
          countryCode: area.countryCode,
          county: area.county,
          cragTitle: area.cragTitle,
          latitude: area.latitude,
          longitude: area.longitude,
          rockType: area.rockType,
          state: area.state,
        },
      });

      const routeSlug = result?.inserted?.slug;
      await popupSuccess('Route Created!');
      navigate({
        to: '/crags/$cragSlug/areas/$areaSlug',
        params: { cragSlug, areaSlug },
        hash: routeSlug,
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
          <TopoCanvas
            routes={area?.routes?.filter(
              (route) => route.topoSlug === topoSlug,
            )}
            backgroundImageURL={backgroundImageURL}
            onDrawingChanged={onDrawingChanged}
          />
        </div>
      </section>
      <section className="section">
        <div className="container box">
          <form
            onSubmit={formOnSubmit}
            style={{ display: 'flex', flexDirection: 'column' }}
            autoComplete="off"
          >
            <input
              className="is-hidden"
              defaultValue={cragSlug}
              {...register('cragSlug')}
            />
            <input
              className="is-hidden"
              defaultValue={areaSlug}
              {...register('areaSlug')}
            />
            <input
              className="is-hidden"
              defaultValue={topoSlug}
              {...register('topoSlug')}
            />
            <input className="is-hidden" {...register('drawing')} />

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

            <div className="field">
              <div className="field is-flex is-justified-end">
                <div className="control">
                  <button
                    className={`button is-primary ${loading ? 'is-loading' : ''}`}
                  >
                    Create Route
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default CreateRouteForm;
