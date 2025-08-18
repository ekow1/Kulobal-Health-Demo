"use client";

import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "@/components/user";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function SiteHeader() {
  return (
    <header className="flex flex-1 sticky top-0 z-50 w-full items-center border-b bg-background py-3">
      <div className="flex h-(--header-height) w-full items-center justify-between px-4">
        <div className="flex items-center gap-2"></div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost">
            <Wallet className="mr-2 h-4 w-4" />
            Amount
          </Button>
          <Separator orientation="vertical" className="mx-2 h-4" />
        </div>
      </div>
      <User
        user={{
          name: "Test User",
          email: "test@email",
          avatar:
            "https://images.unsplash.com/photo-1675095680984-0b5a8b1e6c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG1lbnxlbnwwfHx8fDE2ODQ3MTg3NjE&ixlib=rb-4.0.3&q=80&w=400",
        }}
      />
    </header>
  );
}
