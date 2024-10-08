"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { GoogleIcon } from "~/icon";
import FormProvider from "../_components/react-hook-form/FormProvider";
import FormTextField from "../_components/react-hook-form/FormTextField";
import { Login } from "./DataObject";
import ShowAlertMessage from "~/util/ShowAlertMessage";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Separator } from "~/components/ui/separator";
import { useRouter } from "nextjs-toploader/app";

const loginSchema = z.object({
  email: z
    .string()
    .email("Email must be a valid email")
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export default function LoginPage() {
  const [loginLoding, setLoginLoading] = useState<boolean>(false);
  const Method = useForm<Login>({
    defaultValues: new Login(),
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const { handleSubmit } = Method;

  const GoogleLogin = async () => {
    try {
      const res = await signIn("google");

      if (res?.error) {
        ShowAlertMessage("Login Error", res.error, "error");
      }
    } catch (error: any) {
      ShowAlertMessage("Login Error", error.message, "error");
    }
  };

  const CredentialLogin = async (objLogin: Login) => {
    try {
      setLoginLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        email: objLogin.email,
        password: objLogin.password,
      });

      if (res?.error) {
        setLoginLoading(false);
        ShowAlertMessage("Login", res.error, "error");
      }
    } catch (error: any) {
      setLoginLoading(false);
      ShowAlertMessage("Login", error.message, "error");
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-[24px]">
      <div className="mt-[2rem] flex w-full flex-col items-center justify-between">
        <h2 className="text-2xl font-bold">Login to account </h2>

        <p className="mb-2 mt-2 text-sm italic text-muted-foreground">
          Enter your credentials to continue.
        </p>
      </div>

      <FormProvider
        methods={Method}
        onSubmit={handleSubmit(CredentialLogin)}
        className="w-full"
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <FormTextField
              label="Email"
              name="email"
              placeholder="Enter your email id"
              className="h-[50px] w-full"
            />
          </div>

          <div className="grid gap-1">
            <FormTextField
              label="Password"
              name="password"
              placeholder="Enter your password"
              className="h-[50px] w-full"
              type="password"
            />
          </div>
          <Button type="submit">
            {loginLoding && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </FormProvider>

      <div className="relative mt-6 w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="mt-3 w-full"
        onClick={GoogleLogin}
      >
        <GoogleIcon className="mr-2 h-4 w-4" /> Google
      </Button>

      <div className="relative mt-7 w-full">
        <Separator className="w-full" />
      </div>

      <Button
        variant="outline"
        type="button"
        className="mt-3 w-full"
        onClick={() => router.push("/register")}
      >
        Create new account
      </Button>
    </div>
  );
}
