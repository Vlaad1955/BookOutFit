
import Pagination from "@/admin/other/components/pagination/Pagination";
import NewsList from "@/admin/news/components/list/NewsList";
import NewsHeader from "@/admin/news/components/header/NewsHeader";
import { getAllNews } from "@/admin/news/api/news";
import { objectToCleanURLSearchParams } from "@/features/books/hooks/objectToCleanURLSearchParams.hook";

export default async function NewsPage({
                                         params,
                                         searchParams,
                                       }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string; category?: string }>;
}) {
  const { id } = await params; // ✅
  const sp = await searchParams; // ✅

  const newParams = objectToCleanURLSearchParams(sp);
  const page = parseInt(id, 10) || 1;

  const data = await getAllNews({
    page,
    title: sp.title,
    category: sp.category,
  });

  return (
      <div>
        <NewsHeader />
        <NewsList news={data.entities} />
        <Pagination
            currentPage={data.page}
            totalPages={data.pages}
            searchName="news"
            params={newParams}
        />
      </div>
  );
}
