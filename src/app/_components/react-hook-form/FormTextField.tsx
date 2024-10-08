import { Controller, type FieldValues, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

// ----------------------------------------------------------------------

type Props<T extends FieldValues> = {
  label: string;
  placeholder?: string;
  name: keyof T;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormTextField<T extends FieldValues>({
  name,
  label,
  placeholder,
  ...other
}: Props<T>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl className="w-full">
            <Input
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              {...other}
              placeholder={placeholder ? placeholder : ""}
              {...field}
            />
          </FormControl>

          {error && (
            <FormDescription className="text-red-600">
              * {error.message}
            </FormDescription>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
