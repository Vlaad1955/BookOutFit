
import EditNewsForm from "@/admin/news/components/edit-form/EditNewsForm";
import { getOneNews } from "@/admin/news/api/news";

type Params = { id: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditNewsPage({ params }: any) {
    const typedParams = params as Params;
    const news = await getOneNews(typedParams.id);

    return <EditNewsForm news={news} />;
}
