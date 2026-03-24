import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate, useRouter, Link } from '@tanstack/react-router';
import { areaTags, rockTypes } from '@climbingtopos/globals';
import type { Area, AreaPatch } from '@climbingtopos/types';
import { popupError, popupSuccess } from '@/helpers/alerts';
import { patchFn } from '@/data/actions/areas/patch';

function EditAreaForm({
  area,
  cragSlug,
  areaSlug,
}: {
  area: Area;
  cragSlug: string;
  areaSlug: string;
}) {
  const navigate = useNavigate();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: area.title,
      description: area.description ?? '',
      tags: area.tags ?? [],
      access: area.access,
      rockType: area.rockType,
    },
  });

  const watchTags = watch('tags');

  const formOnSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true);

      const patch: AreaPatch = {};
      if (formData.title !== area.title) patch.title = formData.title;
      if (formData.description !== (area.description ?? ''))
        patch.description = formData.description;
      if (formData.access !== area.access) patch.access = formData.access;
      if (formData.rockType !== area.rockType) patch.rockType = formData.rockType;

      const selectedTags = (formData.tags ?? []) as string[];
      const currentTags = area.tags ?? [];
      const addTags = selectedTags.filter((t) => !currentTags.includes(t));
      const removeTags = currentTags.filter((t) => !selectedTags.includes(t));
      if (addTags.length) patch.addTags = addTags;
      if (removeTags.length) patch.removeTags = removeTags;

      if (Object.keys(patch).length === 0) {
        navigate({
          to: '/crags/$cragSlug/areas/$areaSlug',
          params: { cragSlug, areaSlug },
        });
        return;
      }

      await patchFn({ data: { areaSlug, body: patch } });
      await router.invalidate();
      await popupSuccess('Area Updated!');
      navigate({
        to: '/crags/$cragSlug/areas/$areaSlug',
        params: { cragSlug, areaSlug },
      });
    } catch {
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
                  {area.cragTitle}
                </Link>
              </li>
              <li>
                <Link
                  to="/crags/$cragSlug/areas/$areaSlug"
                  params={{ cragSlug, areaSlug }}
                >
                  {area.title}
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
          <h1 className="title">Edit Area</h1>
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
            </div>

            <div className="field">
              <label className="label" htmlFor="description">
                Description
              </label>
              <div className="control">
                <textarea className="textarea" {...register('description')} />
              </div>
            </div>

            <div className="field">
              <label className="label">Access</label>
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select {...register('access')}>
                    <option value="unknown">Unknown</option>
                    <option value="permitted">Permitted</option>
                    <option value="restricted">Restricted</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Rock Type</label>
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select {...register('rockType')}>
                    {rockTypes.map((rt) => (
                      <option key={rt} value={rt}>
                        {rt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Tags</label>
              <div className="field is-grouped is-grouped-multiline">
                <div role="group" className="tags">
                  {areaTags.map((tag) => (
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
                  to="/crags/$cragSlug/areas/$areaSlug"
                  params={{ cragSlug, areaSlug }}
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

export default EditAreaForm;
