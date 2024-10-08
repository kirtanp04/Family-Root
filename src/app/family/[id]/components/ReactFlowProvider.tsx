"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import ShowAlertMessage from "~/util/ShowAlertMessage";
import { type Family } from "../../DataObject";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormProvider from "~/app/_components/react-hook-form/FormProvider";
import FormTextField from "~/app/_components/react-hook-form/FormTextField";
import { Button } from "~/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

const Viewer = dynamic(() => import("../Viewer"), {
  ssr: false, // Ensure it's rendered only on the client side
  loading: () => <div>Loading...</div>, // Optional loading state
});

export default function ReactFlow() {
  const param = useParams();
  const { data: sessionData } = useSession();
  const [ShowkeyDialog, setShowKeyDialog] = useState<boolean>(false);
  const [FamilyDetail, setFamilyList] = useState<Family | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

  const FamilyList = api.Family.getFamilyByID.useQuery(
    { familyID: param.id as string },
    {
      enabled: isVerified, // Run this query only after verification
    },
  );

  const Validator = api.Family.validateFamily.useMutation({
    onError(error) {
      ShowAlertMessage("Validate Family", error.message, "error");
    },

    onSuccess: async (objFamily) => {
      const getSession = sessionStorage.getItem("All_loged_Family");

      if (getSession === null) {
        sessionStorage.setItem(
          "All_loged_Family",
          JSON.stringify([
            { familyID: objFamily.id, user: sessionData?.user.email },
          ]),
        );
      } else {
        sessionStorage.setItem(
          "All_loged_Family",
          JSON.stringify([
            ...JSON.parse(getSession),
            { familyID: objFamily.id, user: sessionData?.user.email },
          ]),
        );
      }
      setShowKeyDialog(false);
      setFamilyList(objFamily as any);
      setIsVerified(true);
    },
  });

  const Method = useForm<{ Key: string }>({
    defaultValues: {
      Key: "",
    },
    resolver: zodResolver(
      z.object({ Key: z.string().nonempty("Key is required") }),
    ),
  });

  const { handleSubmit } = Method;

  useEffect(() => {
    if (!sessionData?.user?.email) return;

    const getSession = sessionStorage.getItem("All_loged_Family");

    if (getSession !== null) {
      const AllFamilyLoged: {
        familyID: string;
        user: string;
      }[] = JSON.parse(getSession);

      const isPresent = AllFamilyLoged.some(
        (element) =>
          element.familyID === param.id &&
          element.user === sessionData.user.email,
      );

      if (isPresent) {
        setIsVerified(true);
      } else {
        setShowKeyDialog(true);
      }
    } else {
      setShowKeyDialog(true);
    }
    setIsLoading(false); // Stop loading after checking the session
  }, [param.id, sessionData]);

  useEffect(() => {
    if (isVerified && FamilyList.data) {
      setFamilyList(FamilyList.data as any);
    }

    if (FamilyList.isError) {
      ShowAlertMessage("Family List Error", FamilyList.error.message, "error");
    }
  }, [isVerified, FamilyList]);

  if (isLoading) {
    return <div>Loading session...</div>;
  }

  const ValidateFamily = ({ Key }) => {
    try {
      Validator.mutate({
        familyID: param.id as string,
        familyKey: Key,
      });
    } catch (error: any) {
      return ShowAlertMessage("Validate Family", error.message, "error");
    }
  };

  return (
    <ReactFlowProvider>
      <div className="relative w-full" style={{ height: "calc(100vh - 66px)" }}>
        {isVerified && FamilyDetail ? (
          <Viewer objFamily={FamilyDetail} />
        ) : (
          <Dialog open={ShowkeyDialog} onOpenChange={setShowKeyDialog}>
            <DialogContent className="sm:max-w-[400px] md:max-w-[450px] xl:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Access Family Tree</DialogTitle>
                <DialogDescription>
                  Enter the access key to view private family tree. This key
                  ensures that your family information remains secure and
                  accessible only to authorized members. Please keep this key
                  confidential.
                </DialogDescription>
              </DialogHeader>

              <FormProvider
                methods={Method}
                onSubmit={handleSubmit(ValidateFamily)}
                className="w-full"
              >
                <div className="flex flex-col gap-4 py-4">
                  <div className="grid gap-1">
                    <FormTextField
                      label="Key"
                      name="Key"
                      placeholder="Enter family key"
                      className="h-[50px] w-full"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">
                    {Validator.isPending && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Validate
                  </Button>
                </DialogFooter>
              </FormProvider>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ReactFlowProvider>
  );
}
