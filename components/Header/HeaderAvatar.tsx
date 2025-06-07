"use client";

import useSelf from "@/lib/hooks/useSelf";
import HeaderUserDropdown from "@/components/Header/HeaderUserDropdown";
import HeaderLoginDialog from "@/components/Header/HeaderLoginDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeaderAvatar() {
  const { self } = useSelf();

  return self ? (
    <HeaderUserDropdown self={self}>
      <Button
        variant="link"
        className="bg-transparent p-0 rounded-full focus-visible:ring-0"
      >
        <Avatar className="cursor-pointer smooth-transition hover:scale-110">
          <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
            <Image src={self.avatar_url} width={64} height={64} alt="Avatar" />
          </Suspense>
        </Avatar>
      </Button>
    </HeaderUserDropdown>
  ) : (
    <HeaderLoginDialog />
  );
}
