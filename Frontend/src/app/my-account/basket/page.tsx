
import BasketClient from "@/features/basket/components/BasketClient";
import ProtectedRoute from "@/shared/protected-route/protectedRoute";

export default function BasketPage() {
  return (
    <ProtectedRoute>
      <BasketClient />
    </ProtectedRoute>
  );
}
