'use client';

import { useRef, useState, useTransition } from 'react';
import { rockTypes } from '@climbingtopos/globals';
import { updateAreaFields } from '@/app/actions';
import type { AreaEditFields, ActionResult } from '@/app/data/types';

interface Props {
  hk: string;
  sk: string;
  slug: string;
  area: Record<string, unknown>;
}

export default function EditAreaForm({ hk, sk, slug, area }: Props) {
  const [fields, setFields] = useState<AreaEditFields>({
    title: String(area.title ?? ''),
    description: String(area.description ?? ''),
    access: String(area.access ?? ''),
    accessDetails: String(area.accessDetails ?? ''),
    approachNotes: String(area.approachNotes ?? ''),
    rockType: String(area.rockType ?? ''),
    latitude: String(area.latitude ?? ''),
    longitude: String(area.longitude ?? ''),
  });
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const longitudeRef = useRef<HTMLInputElement>(null);

  function latitudeOnPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text');
    if (text.includes(',')) {
      e.preventDefault();
      const [lat, lng] = text.split(',');
      set('latitude', lat.trim());
      set('longitude', lng.trim());
      longitudeRef.current?.focus();
    }
  }

  function latitudeOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === ',') {
      e.preventDefault();
      longitudeRef.current?.focus();
    }
  }

  function set(key: keyof AreaEditFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    startTransition(async () => {
      const res = await updateAreaFields(hk, sk, slug, fields);
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
          <label className="label is-small">Rock Type</label>
          <div className="control">
            <div className="select is-small is-fullwidth">
              <select
                value={fields.rockType}
                onChange={(e) => set('rockType', e.target.value)}
              >
                <option value="">— select —</option>
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
                  onPaste={latitudeOnPaste}
                  onKeyDown={latitudeOnKeyDown}
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
                  ref={longitudeRef}
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
