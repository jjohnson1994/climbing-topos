import RouteLogContext from '@/components/RouteLogContext';
import { PropsWithChildren } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useEffect, Suspense } from 'react';
// import { usePostHog } from 'posthog-js/react';
// import posthog from 'posthog-js';
// import { PostHogProvider as PHProvider } from 'posthog-js/react';

const posthog = false;

function PostHogPageView() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });
  // const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (search) {
        url = url + search;
      }

      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, search, posthog]);

  return null;
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // posthog.init(import.meta.env.VITE_POSTHOG_KEY as string, {
    //   api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com',
    //   person_profiles: 'identified_only',
    //   capture_pageview: false,
    // });
  }, []);

  return children;
  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}

export default function Providers({ children }: PropsWithChildren) {
  return <RouteLogContext>{children}</RouteLogContext>;
  return (
    <PostHogProvider>
      <RouteLogContext>{children}</RouteLogContext>
    </PostHogProvider>
  );
}
