import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { logError } from './lib/log'

const handler = createStartHandler(defaultStreamHandler)

export default async function (event: any) {
  try {
    return await handler(event)
  } catch (err) {
    logError('server:unhandled', err, {
      url: event?.node?.req?.url ?? event?.path,
      method: event?.node?.req?.method,
    })
    return new Response('Internal Server Error', { status: 500 })
  }
}
