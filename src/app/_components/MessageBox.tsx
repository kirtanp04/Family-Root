import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "src/components/ui/alert-dialog";
import { ErrorIcon, SuccessIcon, WarningIcon } from "~/icon";

interface Props {
  open: boolean;
  MessageTitle: string;
  Message: string;
  onClose: () => void;
  varient: "success" | "error" | "warning";
}

export function MessageBox({
  Message,
  MessageTitle,
  onClose,
  open,
  varient,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            {varient === "warning" && <WarningIcon className="mr-3 h-6 w-6" />}
            {varient === "error" && <ErrorIcon className="mr-3 h-6 w-6" />}
            {varient === "success" && <SuccessIcon className="mr-3 h-6 w-6" />}

            {MessageTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>{Message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className={`${varient === "error" ? "bg-red-500 hover:bg-red-400" : varient === "success" ? "bg-green-500 hover:bg-green-400" : "bg-yellow-500 hover:bg-yellow-400"}`}
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
