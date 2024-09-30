'use client'

import RouteLogContext from "@/app/components/RouteLogContext";

export default function Providers({ children }) {
  return (
    <RouteLogContext>
      {children}
    </RouteLogContext>
  );
}
