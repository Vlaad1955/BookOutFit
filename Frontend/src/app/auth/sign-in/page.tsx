import AuthWrapper from "@/components/auth/auth-wrapper/AuthWrapper";
import SignInForm from "@/components/auth/sign-in-form/SignInForm";
import { AppRoute } from "@/features/auth/enums/app-route.enums";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInPage() {

  const token = (await cookies()).get("refreshToken");

  if (token) {
    redirect("/");
  }

  return <AuthWrapper authPath={AppRoute.SIGN_UP} screen={<SignInForm />} />;
}
