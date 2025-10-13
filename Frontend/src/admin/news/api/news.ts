import axiosInstance from "@/features/auth/auth-axios-instance/axiosInstance";
import { UpdateNewsDto } from "@/features/news/types/news";

export async function getAllNews(queryParams: unknown) {
  const response = await axiosInstance.get("/news", {
    params: queryParams,
  });
  return response.data;
}

export async function getOneNews(id: string) {
  const response = await axiosInstance.get("/news", {
    params: { id },
  });

  return response.data.entities[0];
}

export async function createNews(newsData: UpdateNewsDto, imageFile: File) {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("title", newsData.title);
  formData.append("content", newsData.content);
  formData.append("category", newsData.category);

  const response = await axiosInstance.post("/news", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function updateNews(id: string, newsData: UpdateNewsDto) {
  const response = await axiosInstance.patch(`/news/${id}`, newsData);
  return response.data;
}

export async function removeNews(id: string) {
  const response = await axiosInstance.delete(`/news/${id}`);
  return response.data;
}
