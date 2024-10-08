"use client";

import { SessionProvider as Session } from "next-auth/react";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function SessionProvider({ children }: Props) {
  return <Session>{children}</Session>;
}
