
import BooksHeader from "@/admin/books/components/header/BooksHeader";
import BooksList from "@/admin/books/components/list/BooksList";
import Pagination from "@/admin/other/components/pagination/Pagination";
import { getAllBooks } from "@/admin/books/api/books";
import { objectToCleanURLSearchParams } from "@/features/books/hooks/objectToCleanURLSearchParams.hook";

type BooksPageProps = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BooksPage({ params, searchParams }: BooksPageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await (searchParams ?? Promise.resolve({}));

    const { id } = resolvedParams;
    const { title, published } = resolvedSearchParams as {
        title?: string;
        published?: string;
    };

    const newParams = objectToCleanURLSearchParams(resolvedSearchParams);
    const page = parseInt(id, 10) || 1;

    const data = await getAllBooks({
        page,
        title: title || undefined,
        published:
            published === "true" ? true : published === "false" ? false : undefined,
    });

    return (
        <div>
            <BooksHeader />
            <BooksList books={data.entities} />
            <Pagination
                currentPage={data.page}
                totalPages={data.pages}
                searchName="books"
                params={newParams}
            />
        </div>
    );
}
