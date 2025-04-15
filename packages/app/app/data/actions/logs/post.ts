'use server';

import { LogRequest } from '@climbingtopos/types';
import { logs } from '@/app/data/services';
import { auth, login } from '@/app/actions';

export const post = async (body: LogRequest[]) => {
  const user = await auth();

  try {
    const logsDetails = body;

    if (user === false) {
      return login();
    }

    await logs.logRoutes(logsDetails, user.properties);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error logging routes', error);
    throw error;
  }
};
