
import FavoriteLikesItems from "@/features/favorite/components/FavoriteLikesItems";
import ProtectedRoute from "@/shared/protected-route/protectedRoute";

export default function LikesPage() {
  return (
    <ProtectedRoute>
      <FavoriteLikesItems />
    </ProtectedRoute>
  );
}
