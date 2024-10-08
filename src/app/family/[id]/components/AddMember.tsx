"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country, type ICountry } from "country-state-city";
import React, { type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormProvider from "~/app/_components/react-hook-form/FormProvider";
import FormTextField from "~/app/_components/react-hook-form/FormTextField";
import { ImageCompressor } from "~/Common/ImageCompressor";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ShowAlertMessage from "~/util/ShowAlertMessage";
import { uuid } from "~/util/uuid";
import { Member } from "../../DataObject";
import "/node_modules/flag-icons/css/flag-icons.min.css";

interface Props {
  AddNewNode: (objMember: Member) => void;
  open: boolean;
  onClose: () => void;
}

const MemberSchema = z.object({
  name: z.string().nonempty("Name is required"),
  key: z.string().nonempty("Key is required"),
  phone: z.any().optional(),
  age: z.any().optional(),
  country: z.any().optional(),
  photo: z.any().optional(),
});

export default function AddMember({ AddNewNode, onClose, open }: Props) {
  const [CountryList] = React.useState<ICountry[]>(Country.getAllCountries());

  const Method = useForm<Member>({
    defaultValues: new Member(),
    resolver: zodResolver(MemberSchema),
  });

  const { handleSubmit, setValue, reset } = Method;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file === undefined) return;

    const Compressor = new ImageCompressor();
    await Compressor.Compress(
      file,
      (res) => {
        setValue("photo", res);
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

  const OnAddMember = (objMember: Member) => {
    try {
      objMember.id = uuid();
      reset();
      AddNewNode(objMember);
    } catch (error: any) {
      ShowAlertMessage("Add Member", error.message, "error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] md:max-w-[550px] xl:max-w-[670px]">
        <DialogHeader>
          <DialogTitle>New Member Information</DialogTitle>
          <DialogDescription>
            Fill in the information to include a new member in your family tree.
          </DialogDescription>
        </DialogHeader>

        <FormProvider
          methods={Method}
          onSubmit={handleSubmit(OnAddMember)}
          className="w-full"
        >
          <div className="grid gap-2 py-4 md:grid-cols-1 xl:grid-cols-2">
            <div className="flex items-center gap-4">
              <FormTextField
                label="Name"
                name="name"
                placeholder="Enter your name"
                className="h-[50px] w-full"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="pic" className="w-16 text-right">
                Pic
              </Label>
              <Input
                id="pic"
                onChange={handleFileChange}
                type="file"
                className="w-48 min-w-36"
                accept=".png, .jpg, .jpeg"
              />
            </div>

            <div className="flex items-center gap-4">
              <FormTextField
                label="Phone"
                name="phone"
                placeholder="Enter your phone number"
                className="h-[50px] w-full"
              />
            </div>

            <div className="flex items-center gap-4">
              <FormTextField
                label="Age"
                name="age"
                placeholder="Enter your age"
                className="h-[50px] w-full"
                type="number"
              />
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <Label htmlFor="country" className="w-16 text-right">
                Country
              </Label>
              <Select onValueChange={(value) => setValue("country", value)}>
                <SelectTrigger id="country" className="h-[50px] w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Country List</SelectLabel>

                    {CountryList.map((objCountry) => (
                      <SelectItem
                        value={`${objCountry.name}-${objCountry.isoCode}`}
                        key={objCountry.isoCode}
                        className="flex items-center"
                      >
                        <span
                          className={`fi fi-${objCountry.isoCode.toLowerCase()} mr-3`}
                        />
                        {objCountry.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <FormTextField
                label="Key"
                name="key"
                placeholder="Enter your Key"
                className="h-[50px] w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
