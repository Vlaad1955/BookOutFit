import axiosInstance from "@/features/auth/auth-axios-instance/axiosInstance";
import {
  CreateCategoryDto,
  FetchCategoriesOptions,
  UpdateCategoryDto,
} from "@/features/categories/types/category";
import { retryAsync } from "@/shared/hooks/retry/useRetry.hook";

export async function createCategory(dto: CreateCategoryDto) {
  return retryAsync(() =>
    axiosInstance.post("/category", dto).then((res) => res.data)
  );
}

export async function makeCategoryListRequest(queryString: string) {
  return retryAsync(() =>
    axiosInstance.get(`/category?${queryString}`).then((res) => res.data)
  );
}

export async function getCategoryList(queryParams: FetchCategoriesOptions) {
  return retryAsync(() =>
    axiosInstance
      .get("/category", { params: queryParams })
      .then((res) => res.data)
  );
}

export async function getCategoryById(id: string) {
  return retryAsync(() =>
    axiosInstance.get(`/category/find/${id}`).then((res) => res.data)
  );
}

export async function updateCategory(id: string, dto: UpdateCategoryDto) {
  return retryAsync(() =>
    axiosInstance.patch(`/category/${id}`, dto).then((res) => res.data)
  );
}

export async function deleteCategory(id: string) {
  return retryAsync(() =>
    axiosInstance.delete(`/category/${id}`).then((res) => res.data)
  );
}

export async function getMainCategories() {
  return retryAsync(() =>
    axiosInstance.get(`/category/mainCategories`).then((res) => res.data)
  );
}
