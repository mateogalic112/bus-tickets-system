export const USERS_QUERY_KEYS = {
  USERS: "users",
  ME: "me",
};

export const userKeys = {
  users: [USERS_QUERY_KEYS.USERS] as const,
  currentUser: () => [...userKeys.users, USERS_QUERY_KEYS.ME] as const,
};
