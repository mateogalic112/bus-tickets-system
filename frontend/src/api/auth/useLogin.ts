import { useMutation, useQueryClient } from "react-query";
import { User } from "../../types/users";
import api from "../base";
import { AUTH_QUERY_KEYS } from "./queryKeys";
import { userKeys } from "../users/queryKeys";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface LoginRequest {
  email: string;
  password: string;
}

const login = async (request: LoginRequest): Promise<User> => {
  const response = await api.post(
    `${AUTH_QUERY_KEYS.AUTH}/${AUTH_QUERY_KEYS.LOGIN}`,
    request
  );
  return response.data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation((request: LoginRequest) => login(request), {
    onSuccess: () => {
      queryClient.invalidateQueries(userKeys.currentUser());
    },
    onError: (e: AxiosError) => {
      const safeError = e?.response?.data as {
        message: string;
        status: number;
      };
      toast.error(safeError.message);
    },
  });
};
