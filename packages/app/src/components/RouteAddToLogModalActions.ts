import { postFn as _logRoutes } from '@/data/actions/logs/post';
import { LogRequest } from '@climbingtopos/types';

export async function logRoutes(logRequest: LogRequest[]) {
  return _logRoutes({ data: logRequest });
}
