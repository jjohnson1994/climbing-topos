'use client';

import { useActionState } from 'react';
import { dryRun, executeMigration, type DryRunState, type ExecuteState } from './actions';

export default function MigrationClient({ currentEnv }: { currentEnv: string }) {
  const [dryRunState, dryRunAction, isDryRunPending] = useActionState<DryRunState, FormData>(dryRun, null);
  const [executeState, executeAction, isExecutePending] = useActionState<ExecuteState, FormData>(executeMigration, null);

  const isProduction = currentEnv === 'production';
  const migrationComplete = executeState && !executeState.error && executeState.failed === 0;

  return (
    <div className="admin-content">
      <div className="detail-card">
        <h3>About this migration</h3>
        <p>
          Rewrites all image URLs stored in DynamoDB from direct S3 URLs to CloudFront CDN URLs.
          Affects: crag images, topo images, user profile pictures, and embedded profile pictures in
          crags, areas, routes, and logs.
        </p>
        <p>
          Current environment:{' '}
          <strong className={isProduction ? 'has-text-danger' : 'has-text-info'}>
            {currentEnv.toUpperCase()}
          </strong>
        </p>
        {isProduction && (
          <p className="has-text-danger">
            <strong>You are migrating PRODUCTION data. Proceed with caution.</strong>
          </p>
        )}
      </div>

      <div className="detail-card">
        <h3>Step 1 — Scan for S3 URLs</h3>
        <p>Performs a full consistent table scan. No data is written.</p>
        <form action={dryRunAction}>
          <button type="submit" className="button is-primary" disabled={isDryRunPending}>
            {isDryRunPending ? 'Scanning…' : 'Scan database'}
          </button>
        </form>

        {dryRunState?.error && (
          <p className="has-text-danger" style={{ marginTop: '1rem' }}>
            Error: {dryRunState.error}
          </p>
        )}

        {dryRunState && !dryRunState.error && (
          <div style={{ marginTop: '1.25rem' }}>
            <dl>
              <div className="field-row">
                <dt>S3 prefix being replaced</dt>
                <dd><code style={{ wordBreak: 'break-all' }}>{dryRunState.s3Prefix}</code></dd>
              </div>
              <div className="field-row">
                <dt>New CDN URL</dt>
                <dd><code>{dryRunState.cdnUrl}</code></dd>
              </div>
              <div className="field-row">
                <dt>Items to update</dt>
                <dd><strong>{dryRunState.totalItems}</strong></dd>
              </div>
            </dl>

            {dryRunState.totalItems === 0 ? (
              <p className="has-text-success" style={{ marginTop: '0.75rem' }}>
                No S3 URLs found — migration already complete or no images uploaded yet.
              </p>
            ) : (
              <>
                <h4 style={{ marginTop: '1rem' }}>By entity type</h4>
                <table style={{ marginBottom: '1rem' }}>
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(dryRunState.summary).map(([model, count]) => (
                      <tr key={model}>
                        <td>{model}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {dryRunState.examples.length > 0 && (
                  <>
                    <h4>Sample items (first {dryRunState.examples.length})</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Model</th>
                          <th>Key (hk)</th>
                          <th>Fields</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dryRunState.examples.map((ex, i) => (
                          <tr key={i}>
                            <td>{ex.model}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{ex.hk}</td>
                            <td style={{ fontSize: '0.8rem' }}>{ex.fields.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {dryRunState.totalItems > 20 && (
                      <p className="has-text-grey" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        …and {dryRunState.totalItems - 20} more
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {dryRunState && !dryRunState.error && dryRunState.totalItems > 0 && !migrationComplete && (
        <div
          className="detail-card"
          style={{ borderLeft: '4px solid var(--danger, #f14668)', borderRadius: 0 }}
        >
          <h3>Step 2 — Execute migration</h3>
          <p>
            This will write <strong>{dryRunState.totalItems} DynamoDB update(s)</strong> against{' '}
            <strong className={isProduction ? 'has-text-danger' : 'has-text-info'}>
              {currentEnv.toUpperCase()}
            </strong>
            . The operation is safe to re-run — items that have already been migrated will be
            skipped automatically.
          </p>
          <p>
            Type <code>MIGRATE</code> to confirm:
          </p>
          <form action={executeAction}>
            <div className="field has-addons">
              <div className="control">
                <input
                  name="confirmation"
                  className="input"
                  type="text"
                  placeholder="MIGRATE"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="control">
                <button
                  type="submit"
                  className="button is-danger"
                  disabled={isExecutePending}
                >
                  {isExecutePending ? 'Migrating…' : 'Execute migration'}
                </button>
              </div>
            </div>
          </form>

          {executeState?.error && (
            <p className="has-text-danger" style={{ marginTop: '0.75rem' }}>
              Error: {executeState.error}
            </p>
          )}
        </div>
      )}

      {executeState && !executeState.error && (
        <div className="detail-card">
          <h3>Migration complete</h3>
          <dl>
            <div className="field-row">
              <dt>Updated</dt>
              <dd className="has-text-success"><strong>{executeState.succeeded}</strong></dd>
            </div>
            <div className="field-row">
              <dt>Failed</dt>
              <dd className={executeState.failed > 0 ? 'has-text-danger' : ''}>
                <strong>{executeState.failed}</strong>
              </dd>
            </div>
          </dl>
          {executeState.errors.length > 0 && (
            <>
              <h4 className="has-text-danger" style={{ marginTop: '1rem' }}>Errors</h4>
              <ul>
                {executeState.errors.map((e, i) => (
                  <li key={i} style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{e}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
