import axiosAuthInstance from "../auth-axios-instance/axiosAuthInstance";
import { UserSignInRequestDto } from "../authTypes/user-sign-in-request-dto";
import { UserSignUpRequestDto } from "../authTypes/user-sign-up-request-dto";
import axiosInstance from "@/features/auth/auth-axios-instance/axiosInstance";

export const authApi = {
  signIn: (payload: UserSignInRequestDto) =>
      axiosAuthInstance.post("/auth/login", payload),

  signUp: (payload: UserSignUpRequestDto) => {
    const formData = new FormData();
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("firstName", payload.firstName);
    formData.append("lastName", payload.lastName);
    formData.append("age", String(payload.age));
    formData.append("phone", payload.phone);
    if (payload.image instanceof File) {
      formData.append("image", payload.image);
    }

    return axiosAuthInstance.post("/auth/registration", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  logout: () => axiosInstance.post("/auth/logout"),
  resetPassword: (email: string) =>
      axiosAuthInstance.patch("/auth/resetPassword", { email }),
};
