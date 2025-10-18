
import UpdatePasswordForm from "@/features/password/components/UpdatePasswordForm";
import ProtectedRoute from "@/shared/protected-route/protectedRoute";

export default async function UpdatePasswordPage() {

    return (
        <ProtectedRoute>
            <UpdatePasswordForm/>
        </ProtectedRoute>
    );
}