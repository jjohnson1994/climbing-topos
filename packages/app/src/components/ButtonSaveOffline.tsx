import { useEffect, useState } from 'react';
import type { Crag } from '@climbingtopos/types';
import { toastSuccess, popupError } from '@/helpers/alerts';
import {
  isCragSavedOffline,
  saveCragOffline,
  removeCragOffline,
} from '@/lib/offline/crags';

interface Props {
  crag: Crag;
  className?: string;
}

function ButtonSaveOffline({ crag, className = '' }: Props) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    isCragSavedOffline(crag.slug).then((result) => {
      if (!cancelled) setSaved(result);
    });
    return () => {
      cancelled = true;
    };
  }, [crag.slug]);

  const handleClick = async () => {
    setBusy(true);
    try {
      if (saved) {
        await removeCragOffline(crag.slug);
        setSaved(false);
        toastSuccess('Removed from offline downloads');
      } else {
        await saveCragOffline(crag);
        setSaved(true);
        toastSuccess('Saved for offline viewing');
      }
    } catch (error) {
      console.error('Error saving crag offline', error);
      popupError(
        saved
          ? 'Could not remove this crag from offline downloads. Try again.'
          : 'Could not save this crag for offline viewing. Check your connection and try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className={`button is-rounded ${saved ? 'is-primary' : ''} ${className}`}
      onClick={handleClick}
      disabled={busy}
    >
      <span className="icon is-small">
        <i
          className={`fas ${busy ? 'fa-spinner fa-spin' : saved ? 'fa-check' : 'fa-download'}`}
          aria-hidden="true"
        ></i>
      </span>
      <span>
        {busy ? 'Saving…' : saved ? 'Saved Offline' : 'Save Offline'}
      </span>
    </button>
  );
}

export default ButtonSaveOffline;
