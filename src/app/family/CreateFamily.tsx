"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { type ChangeEvent, useState } from "react";
import { Button } from "src/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { ImageCompressor } from "~/Common/ImageCompressor";
import { Badge } from "~/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Family } from "./DataObject";
import { api } from "~/trpc/react";

import { useSession } from "next-auth/react";
import ShowAlertMessage from "~/util/ShowAlertMessage";

export default function CreateFamily() {
  const [FamilyDetail, setFamilyDetail] = useState<Family>(new Family());
  const { data } = useSession();

  const utils = api.useUtils();
  const _CreateFamily = api.Family.CreateNewFamily.useMutation({
    onError(error) {
      ShowAlertMessage("Creating Family", error.message, "error");
    },

    onSuccess: async (data) => {
      ShowAlertMessage("Creating Family", data, "success");
      await utils.Family.invalidate();
      setFamilyDetail(new Family());
    },
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file === undefined) return;

    const Compressor = new ImageCompressor();
    await Compressor.Compress(
      file,
      (res) => {
        setFamilyDetail({ ...FamilyDetail, familyPic: res });
      },
      (err) => {
        ShowAlertMessage("Uploading Img", err, "error");
      },
      (progress) => {
        if (progress) {
        }
      },
    );
  };

  const onCreateFamily = async () => {
    try {
      if (FamilyDetail.familyName === "" || FamilyDetail.familyPic === "") {
        return ShowAlertMessage(
          "Create Family",
          "Please provide required fields.",
          "warning",
        );
      }

      if (FamilyDetail.type === "private" && FamilyDetail.key === "") {
        return ShowAlertMessage(
          "Create Family",
          "Please provide Key or change to public.",
          "warning",
        );
      }

      _CreateFamily.mutate({
        userEmail: data?.user.email ?? "",
        familyName: FamilyDetail.familyName,
        familyPic: FamilyDetail.familyPic,
        type: FamilyDetail.type,
        key: FamilyDetail.key,
        createdAt: FamilyDetail.createdAt,
        updatedAt: FamilyDetail.updatedAt,
      });
    } catch (error: any) {
      ShowAlertMessage("Create Family", error.message, "error");
    }
  };

  return (
    <DialogContent className="sm:max-w-[430px] md:max-w-[500px] xl:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Create a New Family</DialogTitle>
        <DialogDescription>
          Enter details to start building your family tree and connect with your
          relatives.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="name" className="w-32 text-right">
            Family Name
          </Label>
          <Input
            id="name"
            className="w-full"
            value={FamilyDetail.familyName}
            onChange={(e) =>
              setFamilyDetail({ ...FamilyDetail, familyName: e.target.value })
            }
          />
        </div>

        <RadioGroup
          defaultValue={FamilyDetail.type}
          onValueChange={(value) =>
            setFamilyDetail({
              ...FamilyDetail,
              type: value as "public" | "private",
            })
          }
        >
          <div className="items-top flex w-full space-x-2">
            <RadioGroupItem
              value="public"
              id="public"
              className="ml-20 border-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
            />
            <div className="flex flex-col gap-1.5 leading-none">
              <Label
                htmlFor="public"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Badge className="cursor-pointer bg-blue-600 hover:bg-blue-400">
                  Public
                </Badge>
              </Label>
              <p className="text-sm text-muted-foreground">
                By creating a public family, all users on this platform can view
                your family members.
              </p>
            </div>
          </div>

          <div className="items-top flex w-full space-x-2">
            <RadioGroupItem
              value="private"
              id="private"
              className="ml-20 border-slate-600 data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
            />
            <div className="flex flex-col gap-1.5 leading-none">
              <Label
                htmlFor="private"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Badge className="cursor-pointer bg-green-600 hover:bg-green-400">
                  Private
                </Badge>
              </Label>
              <p className="text-sm text-muted-foreground">
                Creating a private family requires a key for others to view its
                members.
              </p>
            </div>
          </div>
        </RadioGroup>

        {FamilyDetail.type === "private" && (
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="w-32 text-right">
              Key
            </Label>
            <Input
              id="key"
              className="w-full"
              value={FamilyDetail.key}
              onChange={(e) =>
                setFamilyDetail({ ...FamilyDetail, key: e.target.value })
              }
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <Label htmlFor="pic" className="w-32 text-right">
            Family Pic
          </Label>
          <Input
            id="pic"
            type="file"
            className="w-full"
            onChange={handleFileChange}
            accept=".png, .jpg, .jpeg"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onCreateFamily}>
          {_CreateFamily.isPending && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
