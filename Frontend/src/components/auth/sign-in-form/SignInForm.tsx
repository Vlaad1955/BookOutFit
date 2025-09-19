"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button/Button";
import { Input } from "../../ui/input/Input";
import { useAuthStore } from "@/features/auth/auth-store/useAuthStore";
import { useAppForm } from "@/shared/hooks/use-app-form/useAppForm.hook";
import { InputType } from "@/components/ui/input/input-type/input-type.enum";
import { ButtonType } from "@/components/ui/button/button-type/button-type.enum";
import { UserSignInRequestDto } from "@/features/auth/authTypes/user-sign-in-request-dto";
import { DEFAULT_SIGN_IN_PAYLOAD } from "@/features/auth/constants/DEFAULT_SIGN_IN_PAYLOAD";

import styles from "./styles.module.scss";

const SignInForm = () => {
  const router = useRouter();
  const { signIn, isLoading } = useAuthStore();
  const { handleSubmit, control } = useAppForm<UserSignInRequestDto>({
    defaultValues: DEFAULT_SIGN_IN_PAYLOAD,
  });

  const handleFormSubmit = async (user: UserSignInRequestDto) => {
    try {
      await signIn(user);
      if (useAuthStore.getState().isAuthenticated) {
        toast.success("Ви увійшли в систему");
        router.push("/");
      }
    } catch {
      toast.error("Ви не увійшли в систему. Невірна пошта чи пароль.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
      <p className={styles.input_wrapper}>
        <Input
          type={InputType.EMAIL}
          label="E-mail"
          placeholder="E-mail address"
          control={control}
          inputClassName={styles.input_pages}
          name="email"
        />
      </p>
      <p className={styles.input_wrapper}>
        <Input
          type={InputType.PASSWORD}
          label="Password"
          placeholder="Password"
          control={control}
          inputClassName={styles.input_pages}
          name="password"
        />
      </p>
      <Button
        className={styles.form_button}
        type={ButtonType.SUBMIT}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Log In"}
      </Button>
    </form>
  );
};

export default SignInForm;
