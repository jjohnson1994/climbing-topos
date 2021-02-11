import { users } from "../repositories";

export function login(userSub: string) {
  return users.createUser(userSub);
}
