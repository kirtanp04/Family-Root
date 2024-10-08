"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import ShowAlertMessage from "~/util/ShowAlertMessage";

export default function Verification() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const verify = api.User.verifyUserEmail.useMutation({
    onError(error) {
      ShowAlertMessage("Email verification", error.message, "error");
    },
    onSuccess() {
      router.push("/login");
    },
  });

  useEffect(() => {
    try {
      if (token === null || token === undefined || token === "") {
        return ShowAlertMessage(
          "Verification",
          "Getting null value of token. It should be required to verify email",
          "error",
        );
      }

      verify.mutate({
        token: token,
      });
    } catch (error: any) {
      ShowAlertMessage("Verification", error.message, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return <div>Verification</div>;
}
