'use client';

import { useState, useTransition } from 'react';
import { updateCragFields } from '@/app/actions';
import type { CragEditFields, ActionResult } from '@/app/data/types';

interface Props {
  slug: string;
  crag: Record<string, unknown>;
}

export default function EditCragForm({ slug, crag }: Props) {
  const [fields, setFields] = useState<CragEditFields>({
    title: String(crag.title ?? ''),
    description: String(crag.description ?? ''),
    access: String(crag.access ?? ''),
    accessDetails: String(crag.accessDetails ?? ''),
    accessLink: String(crag.accessLink ?? ''),
    approachNotes: String(crag.approachNotes ?? ''),
    latitude: String(crag.latitude ?? ''),
    longitude: String(crag.longitude ?? ''),
  });
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function set(key: keyof CragEditFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    startTransition(async () => {
      const res = await updateCragFields(slug, fields);
      setResult(res);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="detail-card">
        <h3>Edit Details</h3>

        <div className="field">
          <label className="label is-small">Title</label>
          <div className="control">
            <input
              className="input is-small"
              type="text"
              value={fields.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label is-small">Description</label>
          <div className="control">
            <textarea
              className="textarea is-small"
              rows={4}
              value={fields.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label is-small">Access</label>
          <div className="control">
            <input
              className="input is-small"
              type="text"
              value={fields.access}
              onChange={(e) => set('access', e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label is-small">Access Details</label>
          <div className="control">
            <textarea
              className="textarea is-small"
              rows={3}
              value={fields.accessDetails}
              onChange={(e) => set('accessDetails', e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label is-small">Access Link</label>
          <div className="control">
            <input
              className="input is-small"
              type="text"
              value={fields.accessLink}
              onChange={(e) => set('accessLink', e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label is-small">Approach Notes</label>
          <div className="control">
            <textarea
              className="textarea is-small"
              rows={3}
              value={fields.approachNotes}
              onChange={(e) => set('approachNotes', e.target.value)}
            />
          </div>
        </div>

        <div className="columns is-mobile">
          <div className="column">
            <div className="field">
              <label className="label is-small">Latitude</label>
              <div className="control">
                <input
                  className="input is-small"
                  type="text"
                  value={fields.latitude}
                  onChange={(e) => set('latitude', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label className="label is-small">Longitude</label>
              <div className="control">
                <input
                  className="input is-small"
                  type="text"
                  value={fields.longitude}
                  onChange={(e) => set('longitude', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button
              type="submit"
              className={`button is-primary is-small${isPending ? ' is-loading' : ''}`}
              disabled={isPending}
            >
              Save Changes
            </button>
          </div>
          {result?.success === true && (
            <p className="help is-success" style={{ marginTop: '0.5rem' }}>
              Saved successfully.
            </p>
          )}
          {result?.success === false && (
            <p className="help is-danger" style={{ marginTop: '0.5rem' }}>
              {result.error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
