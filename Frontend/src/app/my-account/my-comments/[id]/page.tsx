
import MyCommentsList from "@/features/comments/components/MyCommentsList";
import ProtectedRoute from "@/shared/protected-route/protectedRoute";
import Pagination from "@/admin/other/components/pagination/Pagination";
import { getComments } from "@/features/comments/api/comments";

type Params = { id: string };
type SearchParams = { page?: string };

export default async function MyCommentsPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { page } = await searchParams;

  const data = await getComments({
    page: page ? Number(page) : undefined,
    user_id: id,
  });

  const hasComments = data.entities.length > 0;

  return (
    <ProtectedRoute>
      {hasComments ? (
        <>
          <MyCommentsList comments={data.entities} />
          <Pagination
            currentPage={data.page}
            totalPages={data.pages}
            userName={id}
          />
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>Коментарі відсутні</h2>
        </div>
      )}
    </ProtectedRoute>
  );
}
