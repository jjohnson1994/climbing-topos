'use server';
import { auth, login } from '@/app/actions';
import { crags } from '@/app/data/services';

export const get = async (slug: string) => {
  const user = await auth();

  try {
    if (!user) {
      console.error('POST crag request received without authorization header');
      login();
      return;
    }

    const userSub = user.properties.sub;

    if (!userSub) {
      login();
      return;
    }

    const crag = await crags.getCragBySlug(slug, userSub);

    if (crag.managedBy.sub !== userSub) {
      return { error: true };
    }

    const itemsAwaitingAproval = await crags.getCragItemsAwaitingAproval(
      crag.slug,
    );

    return itemsAwaitingAproval;
  } catch (error) {
    console.error('Error getting crag items pending approval', error);
  }
};
