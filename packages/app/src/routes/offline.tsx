import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import {
  listOfflineCrags,
  removeCragOffline,
  type OfflineCragRecord,
} from '@/lib/offline/crags';
import { popupError } from '@/helpers/alerts';

export const Route = createFileRoute('/offline')({
  component: OfflinePage,
});

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function OfflinePage() {
  const [crags, setCrags] = useState<OfflineCragRecord[] | null>(null);
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listOfflineCrags().then((result) => {
      if (!cancelled) setCrags(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRemove = async (slug: string) => {
    setRemovingSlug(slug);
    try {
      await removeCragOffline(slug);
      setCrags((current) => current?.filter((c) => c.slug !== slug) ?? null);
    } catch (error) {
      console.error('Error removing offline crag', error);
      popupError('Could not remove this crag. Try again.');
    } finally {
      setRemovingSlug(null);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Downloaded Crags</h1>
        <h5 className="subtitle is-6">
          Crags you&apos;ve saved for offline viewing on this device
        </h5>

        {crags === null && <p>Loading…</p>}

        {crags !== null && crags.length === 0 && (
          <p className="box">
            You haven&apos;t saved any crags for offline viewing yet. Visit a
            crag page and tap <b>Save Offline</b> to download it.
          </p>
        )}

        {crags !== null && crags.length > 0 && (
          <div className="columns is-multiline">
            {crags.map((record) => (
              <div key={record.slug} className="column is-one-third">
                <div className="card">
                  {record.image && (
                    <div className="card-image">
                      <figure className="image is-16by9">
                        <img src={record.image} alt={record.title} />
                      </figure>
                    </div>
                  )}
                  <div className="card-content">
                    <Link
                      to="/crags/$cragSlug"
                      params={{ cragSlug: record.slug }}
                      className="title is-5 is-capitalized"
                    >
                      {record.title}
                    </Link>
                    <p className="is-size-7 has-text-grey mt-1">
                      Saved {DateTime.fromMillis(record.savedAt).toRelative()}{' '}
                      · {formatBytes(record.approxBytes)}
                    </p>
                  </div>
                  <footer className="card-footer">
                    <button
                      className="card-footer-item button is-text"
                      onClick={() => handleRemove(record.slug)}
                      disabled={removingSlug === record.slug}
                    >
                      {removingSlug === record.slug ? 'Removing…' : 'Remove'}
                    </button>
                  </footer>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
