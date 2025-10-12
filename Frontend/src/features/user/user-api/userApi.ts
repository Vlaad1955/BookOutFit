import axiosInstance from "@/features/auth/auth-axios-instance/axiosInstance";
import { User } from "../store/UseUserStore";
import {passwordDto} from "@/features/password/types/password";

export const userApi = {
  fetchCurrentUser: () => axiosInstance.get("/users/find"),
  updateUser: (id: string, payload: Partial<User>) =>
    axiosInstance.patch(`/users/${id}`, payload),
  deleteUser: (id: string) => axiosInstance.delete(`/users/${id}`),
  updatePassword: (dto: passwordDto) => axiosInstance.patch('/auth/newPassword', dto),
};
