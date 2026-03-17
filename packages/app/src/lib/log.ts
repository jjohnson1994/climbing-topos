import { isRedirect } from '@tanstack/react-router'

export function logError(
  context: string,
  err: unknown,
  extra?: Record<string, unknown>,
) {
  if (isRedirect(err)) return
  console.error(
    JSON.stringify({
      level: 'error',
      context,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : null,
      ...extra,
    }),
  )
}
