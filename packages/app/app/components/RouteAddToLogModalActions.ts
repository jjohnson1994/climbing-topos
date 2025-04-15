'use server';

import { post as _logRoutes } from '@/app/data/actions/logs/post';
import { LogRequest } from '@climbingtopos/types';

export async function logRoutes(logRequest: LogRequest[]) {
  return _logRoutes(logRequest);
}
