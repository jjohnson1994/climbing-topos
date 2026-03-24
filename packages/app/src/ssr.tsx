import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { logError } from './lib/log'

const handler = createStartHandler(defaultStreamHandler)

export default async function (...args: [any, ...any[]]) {
  const event = args[0]
  try {
    return await handler(...args)
  } catch (err) {
    logError('server:unhandled', err, {
      url: event?.rawPath ?? event?.path,
      method: event?.requestContext?.http?.method,
    })
    return new Response('Internal Server Error', { status: 500 })
  }
}
