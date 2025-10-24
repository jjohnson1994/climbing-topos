'server-only';

import { headers } from 'next/headers';

/**
 * Get client IP address from Next.js headers
 * Checks common headers used by proxies and load balancers
 * @returns IP address or 'unknown' if not found
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();

  // Check for forwarded IP (from proxies like CloudFront, nginx, etc.)
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ips = forwardedFor.split(',');
    const clientIp = ips[0].trim();
    if (clientIp) {
      return clientIp;
    }
  }

  // Check for real IP header
  const realIp = headersList.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Check for Cloudflare connecting IP
  const cfConnectingIp = headersList.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Fallback to unknown if no IP found
  return 'unknown';
}

/**
 * Get a user agent string for additional fingerprinting
 * @returns User agent string or 'unknown'
 */
export async function getUserAgent(): Promise<string> {
  const headersList = await headers();
  return headersList.get('user-agent') || 'unknown';
}
