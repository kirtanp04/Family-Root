import { useState } from "react";
import { Badge } from "~/components/ui/badge";
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
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import ShowAlertMessage from "~/util/ShowAlertMessage";

type Props = {
  onSelectrelation: (relation: string) => void;
  open: boolean;
  onClose: () => void;
};

export default function SelectRelation({
  onSelectrelation,
  onClose,
  open,
}: Props) {
  const [relation, setRelation] = useState<string>("");

  const onAddRelation = () => {
    try {
      if (
        relation !== "Parent" &&
        relation !== "Spouse" &&
        relation !== "Children" &&
        relation === ""
      ) {
        return ShowAlertMessage(
          "Select Relation",
          "Please make sure you give  relation.",
          "warning",
        );
      }
      onSelectrelation(relation);
    } catch (error: any) {
      ShowAlertMessage("Add Relation", error.message, "error");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] md:max-w-[550px] xl:max-w-[670px]">
        <DialogHeader>
          <DialogTitle>Select Relationship</DialogTitle>
          <DialogDescription>
            Choose how this person is connected to the selected family member.
            Please select the appropriate relationship type from the options
            below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-4">
          <RadioGroup
            className="mt-2 flex flex-wrap gap-3"
            value={relation}
            onValueChange={(value) => setRelation(value)}
          >
            <div className="items-top flex space-x-2">
              <RadioGroupItem
                value="Spouse"
                id="Spouse"
                className="data-[state=checked]:border-pink-600-600 border-pink-600-600 border-pink-600 data-[state=checked]:bg-pink-500 data-[state=checked]:text-white"
              />
              <div className="flex flex-col gap-1.5 leading-none">
                <Label
                  htmlFor="Spouse"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Badge className="cursor-pointer bg-pink-600 hover:bg-pink-400">
                    Spouse
                  </Badge>
                </Label>
              </div>
            </div>

            <div className="items-top flex space-x-2">
              <RadioGroupItem
                value="Parent"
                id="Parent"
                className="data-[state=checked]:border-blue-500-600 border-blue-500-600 border-blue-600 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
              />
              <div className="flex flex-col gap-1.5 leading-none">
                <Label
                  htmlFor="Parent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Badge className="cursor-pointer bg-blue-600 hover:bg-blue-400">
                    Parent
                  </Badge>
                </Label>
              </div>
            </div>

            <div className="items-top flex space-x-2">
              <RadioGroupItem
                value="Children"
                id="Children"
                className="data-[state=checked]:border-pink-600-600 border-pink-600-600 border-green-600 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
              />
              <div className="flex flex-col gap-1.5 leading-none">
                <Label
                  htmlFor="Children"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Badge className="cursor-pointer bg-green-600 hover:bg-green-400">
                    Children
                  </Badge>
                </Label>
              </div>
            </div>

            <div className="items-top flex space-x-2">
              <RadioGroupItem
                value=""
                id="Other"
                className="data-[state=checked]:border-blue-500-600 border-blue-500-600 border-yellow-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-white"
              />
              <div className="flex flex-col gap-1.5 leading-none">
                <Label
                  htmlFor="Other"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Badge className="cursor-pointer bg-yellow-600 hover:bg-yellow-400">
                    Other
                  </Badge>
                </Label>
              </div>
            </div>
          </RadioGroup>

          {/* {relation === "Parent" &&  <p className="text-sm text-red-500">*.</p>} */}

          {relation !== "Parent" &&
            relation !== "Spouse" &&
            relation !== "Children" && (
              <div className="flex items-center gap-4">
                <Label htmlFor="relation" className="w-16 text-right">
                  Relation
                </Label>
                <Input
                  id="relation"
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-48 min-w-36"
                  placeholder="What is the relation ?"
                />
              </div>
            )}
        </div>

        <DialogFooter>
          <Button onClick={onAddRelation}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
