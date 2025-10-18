
import ChangeAccountClient from "@/features/change-account/components/ChangeAccountClint";
import ProtectedRoute from "@/shared/protected-route/protectedRoute";

export default async function ChangeAccountPage() {
  return (
    <ProtectedRoute>
      <ChangeAccountClient />
    </ProtectedRoute>
  );
}
