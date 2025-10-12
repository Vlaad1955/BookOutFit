import axiosInstance from "@/features/auth/auth-axios-instance/axiosInstance";
import {
    Book,
    CreateBookDto, UpdateBookDto,
    UpdatePublishedDto,
} from "@/features/books/types/book";

export async function getAllBooks(queryParams: Record<string, unknown>) {
    const cleanedParams = Object.fromEntries(
        Object.entries(queryParams).filter(([, v]) => v !== undefined)
    );

    const response = await axiosInstance.get("/books/", {
        params: cleanedParams,
    });

    return response.data;
}

export async function getOneBook(id: string): Promise<Book> {
    const response = await axiosInstance.get(`/books/find/${id}`);
    return response.data;
}

export async function createBook(
    bookData: CreateBookDto,
    imageFile: File | null
) {
    const formData = new FormData();
    if (imageFile) {
        formData.append("image", imageFile);
    }
    formData.append("title", bookData.title);
    formData.append("price", bookData.price.toString());
    formData.append("gift", String(bookData.gift));
    formData.append("cover", bookData.cover);

    bookData.categories.forEach((categoryId) => {
        formData.append("categories", categoryId);
    });

    if (bookData.description) {
        formData.append("description", bookData.description);
    }
    if (bookData.author) {
        formData.append("author", bookData.author);
    }

    const response = await axiosInstance.post("/books/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function updateBook(
    id: string,
    bookData: UpdateBookDto,
    imageFile: File | null
) {
    const formData = new FormData();

    if (imageFile) {
        formData.append("image", imageFile);
    }
    formData.append("title", bookData.title);
    formData.append("price", bookData.price.toString());
    formData.append("gift", String(bookData.gift));
    formData.append("cover", bookData.cover);

    bookData.categories.forEach((categoryId) => {
        formData.append("categories", categoryId);
    });

    if (bookData.description) {
        formData.append("description", bookData.description);
    }
    if (bookData.author) {
        formData.append("author", bookData.author);
    }

    const response = await axiosInstance.patch(`/books/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function updatePublishedStatus(
    id: string,
    dto: UpdatePublishedDto
) {
    const response = await axiosInstance.put(`/books/${id}`, dto);
    return response.data;
}

export async function removeBook(id: string) {
    const response = await axiosInstance.delete(`/books/${id}`);
    return response.data;
}
