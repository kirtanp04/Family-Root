// "use client";

import { type ReactNode } from "react";
import Navbar from "./Navbar";

type Props = {
  children: ReactNode;
};

export default function Page({ children }: Props) {
  return (
    // <HydrateClient>
    <main className="flex min-h-screen w-full flex-col">
      <Navbar />
      <div className="container h-full w-full flex-1 flex-col sm:max-w-full md:max-w-full lg:max-w-full xl:max-w-full">
        {children}
      </div>
    </main>
    // </HydrateClient>
  );
}
