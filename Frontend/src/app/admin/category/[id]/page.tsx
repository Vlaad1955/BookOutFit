
import CategoryList from "@/admin/category/components/list/CategoryList";
import Pagination from "@/admin/other/components/pagination/Pagination";
import {
    getCategoryList,
    getMainCategories,
} from "@/features/categories/api/category";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const page = parseInt(id, 10) || 1;

    const data = await getCategoryList({ page });
    const mainCategories = await getMainCategories();

    return (
        <div>
            <CategoryList category={data.entities} main={mainCategories} />
            <Pagination
                currentPage={data.page}
                totalPages={data.pages}
                searchName="category"
            />
        </div>
    );
}
