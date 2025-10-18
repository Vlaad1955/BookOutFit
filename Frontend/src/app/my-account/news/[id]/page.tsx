
import NewsItem from "@/features/news/components/NewsItem";
import { getOneNews } from "@/admin/news/api/news";

export default async function OneNews({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await getOneNews(id);
  return <NewsItem news={news} />;
}
