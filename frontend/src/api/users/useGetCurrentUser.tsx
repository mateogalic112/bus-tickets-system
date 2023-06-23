import { useQuery } from "react-query";
import { User } from "../../types/users";
import api from "../base";
import { USERS_QUERY_KEYS, userKeys } from "./queryKeys";

const getCurrentUser = async (): Promise<User | null> => {
  const response = await api.get<User | null>(
    `${USERS_QUERY_KEYS.USERS}/${USERS_QUERY_KEYS.ME}`
  );
  return response.data;
};

export const useGetCurrentUser = () => {
  return useQuery(userKeys.currentUser(), getCurrentUser);
};
