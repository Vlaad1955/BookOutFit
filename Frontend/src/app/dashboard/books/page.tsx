
import BookWrapper from "@/features/books/components/BookWrapper";
import { getBooksInOneCategory, getMaxBookPrice } from "@/features/books/api/books";
import { Book } from "@/features/books/types/book";
import { cleanParams } from "@/shared/hooks/clean-params/cleanParams.hook";
import { objectToCleanURLSearchParams } from "@/features/books/hooks/objectToCleanURLSearchParams.hook";
import { retryAsync } from "@/shared/hooks/retry/useRetry.hook";
import {
    getBooleanParam,
    getParam,
} from "@/shared/hooks/get-param/getParam.hook";

/* eslint-disable @typescript-eslint/no-explicit-any */
type BookProps = {
    searchParams: any;
};

function buildFilters(searchParams: BookProps["searchParams"]) {
    return {
        page: Number(searchParams.page) || 1,
        limit: Number(searchParams.limit) || 18,
        title: getParam(searchParams.title),
        author: getParam(searchParams.author),
        price: getParam(searchParams.price),
        gift: getParam(searchParams.gift),
        cover: getParam(searchParams.cover),
        sort: getParam(searchParams.sort, "title"),
        order: getParam(searchParams.order, "ASC"),
        categories: getParam(searchParams.categories),
        published: getBooleanParam(searchParams.published, true),
        search: getParam(searchParams.search),
    };
}

async function fetchBooksData(filters: ReturnType<typeof buildFilters>) {
    const baseParams = cleanParams({
        ...filters,
        author: undefined,
        gift: undefined,
        cover: undefined,
        title: undefined,
        page: undefined,
        limit: 10000,
    });

    return retryAsync(
        async () => {
            const data = await getBooksInOneCategory(cleanParams(filters));
            const all = await getBooksInOneCategory(cleanParams(baseParams));
            return { data, all };
        },
        3,
        1000
    );
}

export default async function BookPage({ searchParams }: BookProps) {
    const rawSearchParams = await searchParams;
    const filters = buildFilters(rawSearchParams);
    let books: Book[] = [];
    let allCategoryBooks: Book[] = [];
    let currentPage = 1;
    let totalPages = 1;
    let maxPrice = 10000;

    try {
        const { data, all } = await fetchBooksData(filters);
        books = data.entities;
        totalPages = data.pages;
        currentPage = data.page;
        allCategoryBooks = all.entities;

        const maxPriceFilters = cleanParams({
            ...filters,
            page: undefined,
            limit: undefined,
        });

        maxPrice = await getMaxBookPrice(maxPriceFilters);
    } catch (error) {
        throw error;
    }

    const selectedAuthors = Array.isArray(rawSearchParams.author)
        ? rawSearchParams.author
        : typeof rawSearchParams.author === "string"
            ? [rawSearchParams.author]
            : [];

    const authorsFromBooks = Array.from(
        new Set(allCategoryBooks.map((book) => book.author))
    );

    const combinedAuthors = Array.from(
        new Set([...selectedAuthors, ...authorsFromBooks])
    ).sort((a, b) => a.localeCompare(b));

    const initialAuthors = combinedAuthors;

    const urlParams = objectToCleanURLSearchParams(filters);

    return (
        <BookWrapper
            initialAuthor={initialAuthors}
            books={books}
            currentPage={currentPage}
            totalPages={totalPages}
            params={urlParams}
            maxPrice={maxPrice}
        />
    );
}

