'use client';

import { useState, useTransition } from 'react';
import { gradingSystems, routeTypes, rockTypes } from '@climbingtopos/globals';
import { updateRouteFields } from '@/app/actions';
import type { RouteEditFields, ActionResult } from '@/app/data/types';

interface Props {
  hk: string;
  sk: string;
  slug: string;
  route: Record<string, unknown>;
}

export default function EditRouteForm({ hk, sk, slug, route }: Props) {
  const [fields, setFields] = useState<RouteEditFields>({
    title: String(route.title ?? ''),
    description: String(route.description ?? ''),
    grade: String(route.grade ?? ''),
    gradingSystem: String(route.gradingSystem ?? ''),
    routeType: String(route.routeType ?? ''),
    rockType: String(route.rockType ?? ''),
  });
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentGrades =
    gradingSystems.find((g) => g.title === fields.gradingSystem)?.grades ?? [];

  function set(key: keyof RouteEditFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  function handleGradingSystemChange(system: string) {
    const grades = gradingSystems.find((g) => g.title === system)?.grades ?? [];
    setFields((prev) => ({
      ...prev,
      gradingSystem: system,
      grade: grades.includes(prev.grade) ? prev.grade : (grades[0] ?? ''),
    }));
    setResult(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    startTransition(async () => {
      const res = await updateRouteFields(hk, sk, slug, fields);
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

        <div className="columns is-mobile">
          <div className="column">
            <div className="field">
              <label className="label is-small">Route Type</label>
              <div className="control">
                <div className="select is-small is-fullwidth">
                  <select
                    value={fields.routeType}
                    onChange={(e) => set('routeType', e.target.value)}
                  >
                    <option value="">— select —</option>
                    {routeTypes.map((rt) => (
                      <option key={rt} value={rt}>
                        {rt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
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
          </div>
        </div>

        <div className="columns is-mobile">
          <div className="column">
            <div className="field">
              <label className="label is-small">Grading System</label>
              <div className="control">
                <div className="select is-small is-fullwidth">
                  <select
                    value={fields.gradingSystem}
                    onChange={(e) => handleGradingSystemChange(e.target.value)}
                  >
                    <option value="">— select —</option>
                    {gradingSystems.map((g) => (
                      <option key={g.title} value={g.title}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label className="label is-small">Grade</label>
              <div className="control">
                <div className="select is-small is-fullwidth">
                  <select
                    value={fields.grade}
                    onChange={(e) => set('grade', e.target.value)}
                    disabled={currentGrades.length === 0}
                  >
                    <option value="">— select —</option>
                    {currentGrades.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
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
