import { useEffect } from "react";

export function usePageTitle(pageTitle: string | undefined) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | Climbing Topos` : "Climbing Topos";

    return () => {
      document.title = "Climbing Topos"
    };
  }, [pageTitle]);
}
