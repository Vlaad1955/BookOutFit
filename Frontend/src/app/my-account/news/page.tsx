
import React from "react";
import NewsWrapper from "@/features/news/components/NewsWrapper";
import { newsApi } from "@/features/news/api/news";
import { NewsDataProps } from "@/features/news/types/news";

type NewsSearchParams = {
  title?: string;
  category?: "general" | "promotion" | "event";
  sort?: string;
  order?: "ASC" | "DESC";
  page?: string;
  limit?: string;
};

type NewsPageProps = {
  searchParams: Promise<NewsSearchParams>;
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams; // підтримує async параметри

  const res = await newsApi.getNewsList({
    title: params.title,
    category: params.category,
    sort: params.sort,
    order: params.order,
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 20,
  });

  const newsData: NewsDataProps = res.data;
  return <NewsWrapper newsData={newsData} />;
}
