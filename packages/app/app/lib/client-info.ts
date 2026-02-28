'server-only';

import { headers } from 'next/headers';

export async function getClientIp(): Promise<string> {
  const headersList = await headers();

  const cfViewerAddress = headersList.get('cloudfront-viewer-address');
  if (cfViewerAddress) {
    const ip = cfViewerAddress.startsWith('[')
      ? cfViewerAddress.slice(1, cfViewerAddress.indexOf(']'))
      : cfViewerAddress.split(':')[0];
    if (ip) {
      return ip.trim();
    }
  }

  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',');
    const clientIp = ips[0].trim();
    if (clientIp) {
      return clientIp;
    }
  }

  const realIp = headersList.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return 'unknown';
}

export async function getUserAgent(): Promise<string> {
  const headersList = await headers();
  return headersList.get('user-agent') || 'unknown';
}
