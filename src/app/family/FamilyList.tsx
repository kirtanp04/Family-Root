"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { z } from "zod";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Dialog } from "~/components/ui/dialog";
import { PlusIcon, ViewIcon } from "~/icon";
import { api } from "~/trpc/react";
import ShowAlertMessage from "~/util/ShowAlertMessage";
import LazyImage from "../_components/LazyImage";
import FormProvider from "../_components/react-hook-form/FormProvider";
import FormTextField from "../_components/react-hook-form/FormTextField";
import CreateFamily from "./CreateFamily";
import { type Family } from "./DataObject";
import { useSession } from "next-auth/react";

type TKey = {
  Key: string;
};

const KeySchema = z.object({
  Key: z.string().nonempty("Key is required"),
});

export default function FamilyList() {
  const FamilyList = api.Family.getAllFamilies.useQuery();
  const [ShowkeyDialog, setShowKeyDialog] = useState<boolean>(false);
  const [FamilyID, setFamilyID] = useState<string | null>(null);
  const [ShowCreateFamilyDialog, setShowCreateFamilyDialog] =
    useState<boolean>(false);
  const router = useRouter();
  const { data } = useSession();

  if (!FamilyList.isPending && FamilyList.isError) {
    ShowAlertMessage("All Families", FamilyList.error.message, "error");
  }

  const Validator = api.Family.validateFamily.useMutation({
    onError(error) {
      ShowAlertMessage("Validate Family", error.message, "error");
    },

    onSuccess: async (objFamily) => {
      const getSession = sessionStorage.getItem("All_loged_Family");

      if (getSession === null) {
        sessionStorage.setItem(
          "All_loged_Family",
          JSON.stringify([{ familyID: objFamily.id, user: data?.user.email }]),
        );
      } else {
        sessionStorage.setItem(
          "All_loged_Family",
          JSON.stringify([
            ...JSON.parse(getSession),
            { familyID: objFamily.id, user: data?.user.email },
          ]),
        );
      }
      setFamilyID(null);
      setShowKeyDialog(false);
      router.push(`/family/${objFamily.id}`);
    },
  });

  const Method = useForm<TKey>({
    defaultValues: {
      Key: "",
    },
    resolver: zodResolver(KeySchema),
  });

  const { handleSubmit } = Method;

  const ValidateFamily = ({ Key }) => {
    try {
      if (FamilyID == null) {
        return ShowAlertMessage(
          "Validate Family",
          "Getting Family id null ",
          "error",
        );
      }
      Validator.mutate({
        familyID: FamilyID,
        familyKey: Key,
      });
    } catch (error: any) {
      return ShowAlertMessage("Validate Family", error.message, "error");
    }
  };

  const onPrivateViewClick = (objFamily: Family) => {
    try {
      const getSession = sessionStorage.getItem("All_loged_Family");

      if (getSession === null) {
        setFamilyID(objFamily.id!);
        setShowKeyDialog(true);
        return;
      }

      const AllFamilyLoged: {
        familyID: string;
        user: string;
      }[] = JSON.parse(getSession);

      let isPresent: boolean = false;

      for (let index = 0; index < AllFamilyLoged.length; index++) {
        const element = AllFamilyLoged[index];

        if (
          element?.familyID === objFamily.id &&
          element?.user === data?.user.email
        ) {
          isPresent = true;
          break;
        }
      }

      if (isPresent) {
        router.push(`/family/${objFamily.id}`);
      } else {
        setFamilyID(objFamily.id!);
        setShowKeyDialog(true);
      }
    } catch (error: any) {
      return ShowAlertMessage("Validate Family", error.message, "error");
    }
  };

  return (
    <div className="h-full w-full py-5 sm:px-3 md:px-6 lg:px-8 xl:px-10">
      <div className="flex h-full w-full flex-wrap gap-5">
        <Card className="h-[280px] w-[250px]">
          <div className="flex h-full w-full flex-col items-center justify-center gap-5">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Create Family
            </h3>

            <PlusIcon
              className="h-10 w-10 cursor-pointer"
              onClick={() => setShowCreateFamilyDialog(true)}
            />
          </div>
        </Card>

        {FamilyList.data !== undefined &&
          FamilyList.data.map((objFamily) => (
            <Card className="h-[280px] w-[280px]" key={objFamily.id}>
              <div className="flex h-full w-full flex-col gap-2 p-3">
                <LazyImage
                  alt={FamilyList?.data?.[0]?.familyName ?? ""}
                  src={FamilyList?.data?.[0]?.familyPic ?? ""}
                  height={100}
                  width={200}
                  ImageClass={{ className: "w-full rounded-sm" }}
                  skeletonClass={{ className: "w-full h-[200px] rounded-xl" }}
                />
                <div className="text-lg font-semibold">
                  {objFamily.familyName}
                </div>

                <div className="mt-auto flex w-full items-center justify-between">
                  <ViewIcon
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => {
                      if (objFamily.type === "private") {
                        onPrivateViewClick(objFamily as any);
                      }

                      if (objFamily.type === "public") {
                        router.push(`/family/${objFamily.id}`);
                      }
                    }}
                  />

                  {objFamily.type === "public" && (
                    <Badge className="cursor-pointer bg-blue-600 hover:bg-blue-400">
                      {objFamily.type}
                    </Badge>
                  )}
                  {objFamily.type === "private" && (
                    <Badge className="cursor-pointer bg-green-600 hover:bg-green-400">
                      Private
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
      </div>

      <Dialog
        open={ShowCreateFamilyDialog}
        onOpenChange={setShowCreateFamilyDialog}
      >
        <CreateFamily />
      </Dialog>

      <Dialog
        open={ShowkeyDialog}
        onOpenChange={() => {
          if (FamilyID !== null) {
            setFamilyID(null);
          }
          setShowKeyDialog(false);
        }}
      >
        <DialogContent className="sm:max-w-[400px] md:max-w-[450px] xl:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Access Family Tree</DialogTitle>
            <DialogDescription>
              Enter the access key to view private family tree. This key ensures
              that your family information remains secure and accessible only to
              authorized members. Please keep this key confidential.
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
    </div>
  );
}
