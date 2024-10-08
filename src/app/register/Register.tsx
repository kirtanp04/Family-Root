"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import ShowAlertMessage from "~/util/ShowAlertMessage";
import FormProvider from "../_components/react-hook-form/FormProvider";
import FormTextField from "../_components/react-hook-form/FormTextField";
import { RegisterClass } from "../login/DataObject";

const registerSchema = z.object({
  email: z
    .string()
    .email("Email must be a valid email")
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
  userName: z.string().nonempty("Name is required"),
});

export default function Register() {
  const Method = useForm<RegisterClass>({
    defaultValues: new RegisterClass(),
    resolver: zodResolver(registerSchema),
  });

  const _MutateUserAccount = api.User.createNewUser.useMutation({
    onError(error) {
      ShowAlertMessage("Register", error.message, "error");
    },
    onSuccess(data) {
      ShowAlertMessage("Register", data, "success");
    },
  });

  const { handleSubmit } = Method;

  const CredentialLogin = async (objRegister: RegisterClass) => {
    try {
      _MutateUserAccount.mutate({
        email: objRegister.email,
        password: objRegister.password,
        userName: objRegister.userName,
      });
    } catch (error: any) {
      ShowAlertMessage("Login", error.message, "error");
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-[24px]">
      <div className="mt-[2rem] flex w-full flex-col items-center justify-between">
        <h2 className="text-2xl font-bold">Create new account </h2>

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
              label="Name"
              name="userName"
              placeholder="Enter your name"
              className="h-[50px] w-full"
            />
          </div>

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
            {_MutateUserAccount.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Register
          </Button>
        </div>
      </FormProvider>
    </div>
  );
}
