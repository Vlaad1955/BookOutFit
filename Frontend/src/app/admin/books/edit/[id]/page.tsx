
import { getOneBook } from "@/admin/books/api/books";
import EditBookForm from "@/admin/books/components/edit-form/EditBookForm";

interface EditBookPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
    const { id } = await params;
    const book = await getOneBook(id);

    if (!book) {
        return <p>Книга не знайдена.</p>;
    }

    return <EditBookForm book={book} />;
}

