"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { Button } from "~/components/ui/button";

export default function ErrorPage() {
  const router = useRouter();
  const SearchParam = useSearchParams();
  const error = SearchParam.get("error");
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="p-[24px 0px 0px 24px]">
        <div className="flex justify-center">
          <Image
            src={"https://berrydashboard.io/assets/500-error-CuzulOGa.svg"}
            alt="Error"
            width={350}
            height={350}
            className="h-[450px] w-[450px]"
          />
        </div>
      </div>

      <div className="p-[24px 0px 0px 24px]">
        <div className="flex w-full flex-col items-center justify-center gap-2 p-[12px]">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {error}
          </h4>

          <Button
            variant="default"
            className="mt-5"
            onClick={() => router.push("/")}
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
