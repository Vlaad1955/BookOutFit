"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/features/auth/auth-store/useAuthStore";
import AuthWrapper from "@/components/auth/auth-wrapper/AuthWrapper";
import SignInForm from "@/components/auth/sign-in-form/SignInForm";
import {AppRoute} from "@/features/auth/enums/app-route.enums";

export default function SignInPage() {
    const router = useRouter();
    const {isAuthenticated, loadUser} = useAuthStore();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await loadUser();
            } catch (err) {
                console.error("Помилка при завантаженні користувача:", err);
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAuth();
    }, [loadUser]);

    useEffect(() => {
        if (!checkingAuth && isAuthenticated) {
            router.push(AppRoute.ROOT);
        }
    }, [checkingAuth, isAuthenticated, router]);

    if (checkingAuth) {
        return <div>Завантаження...</div>;
    }

    return <AuthWrapper authPath={AppRoute.SIGN_UP} screen={<SignInForm/>}/>;
}
