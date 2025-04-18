import { object, string, optional } from 'valibot';
import { createSubjects } from '@openauthjs/openauth/subject';

export const subjects = createSubjects({
  user: object({
    id: string(),
    sub: string(),
    email: string(),
    picture: optional(string()),
    nickname: optional(string()),
  }),
});
