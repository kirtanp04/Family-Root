"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Button } from "src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { Separator } from "src/components/ui/separator";
import { GoogleIcon, LoginIcon } from "~/icon";
import { useRouter } from "nextjs-toploader/app";

export default function Navbar() {
  const { data, status } = useSession();
  const router = useRouter();

  return (
    <React.Fragment>
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/family" className="flex items-center space-x-2">
              <Image
                src={"/favicon.ico"}
                height={30}
                width={30}
                alt="Family root"
              />
              <span className="inline-block font-bold">Family Root</span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center gap-2 space-x-1">
              {status === "unauthenticated" && (
                <Button
                  variant={"secondary"}
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-3"
                >
                  <LoginIcon className="h-[1rem] w-[1rem] rotate-0 transition-all" />
                  Login
                </Button>
              )}

              {status === "authenticated" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage
                        src={data.user.profileImg}
                        alt={data.user.name}
                      />
                      <AvatarFallback>
                        {data.user.name.substr(0, 1).toLocaleUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-32">
                    <DropdownMenuLabel>{data.user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        Provider
                        <DropdownMenuShortcut>
                          {data.user.provider === "GOOGLE" && (
                            <GoogleIcon className="h-4 w-4" />
                          )}
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({})}
                      className="cursor-pointer bg-red-500 text-white hover:bg-red-400 hover:text-white focus:bg-red-400 focus:text-white"
                    >
                      Log out
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <ModeToggle />
            </nav>
          </div>
        </div>
      </header>
      <Separator />
    </React.Fragment>
  );
}

function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
