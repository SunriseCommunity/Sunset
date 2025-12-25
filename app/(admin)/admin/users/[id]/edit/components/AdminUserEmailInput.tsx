import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserSensitiveResponse } from "@/lib/types/api";

export default function AdminUserEmailInput({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Input
        id="email"
        type="text"
        value={showEmail ? user.email : "•••••••••••••••"}
        placeholder="Email address"
        disabled
        className="flex-1"
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowEmail(!showEmail)}
      >
        {showEmail ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </Button>
    </div>
  );
}
