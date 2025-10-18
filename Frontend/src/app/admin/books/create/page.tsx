
import {makeCategoryListRequest} from "@/features/categories/api/category";
import CreateBookForm from "@/admin/books/components/create-form/BookCreateForm";

export default async function CreateBooksPage() {
    const categories = await makeCategoryListRequest("limit=1000");

    return (
        <div>
            <CreateBookForm categories={categories.entities}/>
        </div>
    );
}
