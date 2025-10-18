
import CommentsServer from "@/features/comments/components/CommentsServer";
import BookItem from "@/features/books/components/BookItem";
import { getOneBook } from "@/features/books/api/books";

export default async function BookFindOne({
                                              params,
                                          }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const book = await getOneBook(id);

    if (!book) {
        return (
            <div className="text-center mt-10">
                <h1 className="text-2xl font-semibold">Книгу не знайдено</h1>
                <p className="text-gray-600 mt-2">
                    Можливо, вона була видалена або ще не додана.
                </p>
            </div>
        );
    }

    return (
        <>
            <BookItem book={book} />
            <CommentsServer bookId={id} />
        </>
    );
}
