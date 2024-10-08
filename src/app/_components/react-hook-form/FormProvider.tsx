import { type CSSProperties } from "react";
import { FormProvider as Form, type UseFormReturn } from "react-hook-form";

interface TProps {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: (e?: React.BaseSyntheticEvent) => void;
  className?: string;
  sx?: CSSProperties;
}

export default function FormProvider({
  children,
  onSubmit,
  methods,
  className,
  sx,
}: TProps) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} className={className} style={sx}>
        {children}
      </form>
    </Form>
  );
}
