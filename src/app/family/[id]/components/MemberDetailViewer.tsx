"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "src/components/ui/sheet";
import { z } from "zod";
import FormProvider from "~/app/_components/react-hook-form/FormProvider";
import FormTextField from "~/app/_components/react-hook-form/FormTextField";
import { MemberEditAuth } from "~/Common/Class";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import ShowAlertMessage from "~/util/ShowAlertMessage";
import { type Member } from "../../DataObject";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";

type Props = {
  onClose: () => void;
  objMember: Member;
  open: boolean;
};

const MemberSchema = z.object({
  name: z.string().nonempty("Name is required"),
  key: z.string().nonempty("Key is required"),
  phone: z.any().optional(),
  age: z.any().optional(),
  country: z.any().optional(),
  photo: z.any().optional(),
});

const keySchema = z.object({
  Key: z.string().nonempty("Key is required"),
});

export default function MemberDetailViewer({
  objMember,
  onClose,
  open,
}: Props) {
  const [editModeValue, setEditmodeValue] = useState<boolean>(false);
  const [showKeyDialog, setshowKeyDialog] = useState<boolean>(false);

  const { data } = useSession();

  const Method = useForm<Member>({
    defaultValues: JSON.parse(JSON.stringify(objMember)),
    resolver: zodResolver(MemberSchema),
  });

  const KeyMethod = useForm<{ Key: string }>({
    defaultValues: JSON.parse(JSON.stringify({ Key: "" })),
    resolver: zodResolver(keySchema),
  });

  const { handleSubmit } = Method;

  const OnEditModeChange = (value: boolean) => {
    try {
      debugger;
      const encryptInfo: string | null =
        sessionStorage.getItem("Member_Edit_Auth");

      if (encryptInfo === null) {
        return setshowKeyDialog(true);
      }

      const CryptRes = JSON.parse(encryptInfo);

      const SessionInfo: MemberEditAuth[] = [...CryptRes];

      let isVerified: boolean = false;

      for (let index = 0; index < SessionInfo.length; index++) {
        const element = SessionInfo[index];

        if (
          element?.familyID === objMember.familyID &&
          element.memberId === objMember.id &&
          element.userId === data?.user.email &&
          element.isAuthenticated
        ) {
          isVerified = true;

          break;
        }
      }
      if (!isVerified) {
        setshowKeyDialog(true);
      } else {
        setEditmodeValue(value);
      }
    } catch (error: any) {
      ShowAlertMessage("Edit mode", error.message, "error");
    }
  };

  const VerifyKey = ({ Key }: { Key: string }) => {
    try {
      debugger;
      if (Key === objMember.key) {
        const MemberAuth = new MemberEditAuth();
        MemberAuth.familyID = objMember.familyID;
        MemberAuth.isAuthenticated = true;
        MemberAuth.key = Key;
        MemberAuth.memberId = objMember.id;
        MemberAuth.userId = data?.user.email as any;

        const encryptInfo: string | null =
          sessionStorage.getItem("Member_Edit_Auth");

        if (encryptInfo === null) {
          sessionStorage.setItem(
            "Member_Edit_Auth",
            JSON.stringify([MemberAuth]),
          );
          setEditmodeValue(true);
          setshowKeyDialog(false);
          return;
        }

        sessionStorage.setItem(
          "Member_Edit_Auth",
          JSON.stringify([...JSON.parse(encryptInfo), MemberAuth]),
        );
        setEditmodeValue(true);
        setshowKeyDialog(false);
      } else {
        ShowAlertMessage("Verify key", "Invalid key", "error");
      }
    } catch (error: any) {
      ShowAlertMessage("Verify key", error.message, "error");
    }
  };

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{objMember.name}</SheetTitle>
            {/* <SheetDescription>
          
          </SheetDescription> */}
          </SheetHeader>

          <div className="shadow-sm2 mt-5 flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="flex flex-col gap-1 space-y-0.5">
              <Label htmlFor="editMode">Edit Mode</Label>
              <Label
                htmlFor="editMode"
                className="text-[0.8rem] text-muted-foreground"
              >
                Make changes to your profile here. Validate by entering
                registerd key.
              </Label>
            </div>
            <Switch
              id="editMode"
              checked={editModeValue}
              onCheckedChange={(check) => OnEditModeChange(check)}
            />
          </div>

          {!editModeValue ? (
            <div className="mt-5 grid w-full gap-4 py-4">
              <div className="flex w-full items-center gap-4">
                <Label className="w-[5rem] text-right">Name :</Label>
                <Label className="text-left">{objMember.name}</Label>
              </div>
              <div className="flex w-full items-center gap-4">
                <Label className="w-[5rem] text-right">Phone :</Label>
                <Label className="text-left">
                  {objMember.phone == "" ? "-" : objMember.phone}
                </Label>
              </div>

              <div className="flex w-full items-center gap-4">
                <Label className="w-[5rem] text-right">Age :</Label>
                <Label className="text-left">
                  {objMember.age == "" ? "-" : objMember.age}
                </Label>
              </div>

              <div className="flex w-full items-center gap-4">
                <Label className="w-[5rem] text-right">Country :</Label>
                <div className="flex items-center">
                  <Label className="text-left">
                    {objMember.country == ""
                      ? "-"
                      : objMember.country.split("-")[0]}
                  </Label>
                  {objMember.country !== "" && (
                    <span
                      className={`fi fi-${objMember.country.split("-")[1]?.toLowerCase()} ml-2`}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <FormProvider
              methods={Method}
              onSubmit={handleSubmit(() => {
                return null;
              })}
              className="mt-5 w-full"
            >
              <div className="grid w-full gap-4 py-4">
                <div className="w-full items-center gap-4">
                  <FormTextField
                    label="Name"
                    name="name"
                    placeholder="Enter your name"
                    className="h-[50px] w-full"
                    disabled
                  />
                </div>
                <div className="w-full items-center gap-4">
                  <FormTextField
                    label="Phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    className="h-[50px] w-full"
                    disabled
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button onClick={onClose}>Close</Button>
                </SheetClose>
              </SheetFooter>
            </FormProvider>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={showKeyDialog} onOpenChange={setshowKeyDialog}>
        <DialogContent className="sm:max-w-[340px] md:max-w-[350px] xl:max-w-[400px]">
          <FormProvider
            methods={KeyMethod}
            onSubmit={KeyMethod.handleSubmit(VerifyKey)}
            className="w-full"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <FormTextField
                  label="Key"
                  name="Key"
                  placeholder="Enter registered key"
                  className="h-[50px] w-full"
                />
              </div>
            </div>
            <DialogFooter className="mt-5">
              <Button type="submit">Verify</Button>
            </DialogFooter>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
