import axiosInstance from "@/features/auth/auth-axios-instance/axiosInstance";
import { Book, FetchBooksOptions } from "@/features/books/types/book";
import { retryAsync } from "@/shared/hooks/retry/useRetry.hook";

export const toggleLikeBook = (bookId: string) => {
  return retryAsync(() =>
    axiosInstance.post(`/likes/${bookId}`).then((res) => res.data)
  );
};

export const deleteLikeBook = (bookId: string) => {
  return retryAsync(() =>
    axiosInstance.delete(`/likes/${bookId}`).then((res) => res.data)
  );
};

export const getLikedBooks = (params?: FetchBooksOptions): Promise<Book[]> => {
  return retryAsync(() =>
    axiosInstance
      .get("/likes", { params })
      .then((res) => res.data.entities)
  );
};

export const getLikesCount = (bookId: string) => {
  return retryAsync(() =>
    axiosInstance.get(`/likes/count/${bookId}`).then((res) => res.data)
  );
};
