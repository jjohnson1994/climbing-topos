import { getRequest } from '@tanstack/start-server-core'

export function getClientIp(): string {
  const request = getRequest()

  if (!request) return 'unknown'

  const cfViewerAddress = request.headers.get('cloudfront-viewer-address')
  if (cfViewerAddress) {
    const ip = cfViewerAddress.startsWith('[')
      ? cfViewerAddress.slice(1, cfViewerAddress.indexOf(']'))
      : cfViewerAddress.split(':')[0]
    if (ip) return ip.trim()
  }

  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const clientIp = forwardedFor.split(',')[0].trim()
    if (clientIp) return clientIp
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return 'unknown'
}

export function getUserAgent(): string {
  const request = getRequest()
  return request?.headers.get('user-agent') ?? 'unknown'
}
