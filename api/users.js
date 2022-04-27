import { app } from '../app.js';

export const getUsers = async () => {
  const result = await app.client.users.list({ limit: 20 });
  return result.members;
};
