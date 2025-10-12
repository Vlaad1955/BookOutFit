import axiosInstance from "@/features/auth/auth-axios-instance/axiosInstance";
import { retryAsync } from "@/shared/hooks/retry/useRetry.hook";

export const basketApi = {
  addBook: (payload: { bookId: string; quantity?: number }) =>
    retryAsync(() => axiosInstance.post("/basket", payload)),

  removeBook: (bookId: string) =>
    retryAsync(() => axiosInstance.delete(`/basket/remove/${bookId}`)),

  clearBasket: () => retryAsync(() => axiosInstance.delete("/basket")),

  getBasket: () => retryAsync(() => axiosInstance.get("/basket")),
};
