import { useEffect } from 'react';

export function usePageTitle(pageTitle: string | undefined) {
  useEffect(() => {
    document.title = pageTitle
      ? `${pageTitle} | ClimbingTopos`
      : 'ClimbingTopos';

    return () => {
      document.title = 'ClimbingTopos';
    };
  }, [pageTitle]);
}
