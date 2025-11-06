import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserSensitiveResponse } from "@/lib/types/api";
import { Mail, EyeOff, Eye } from "lucide-react";
import { useState } from "react";

import { Label } from "recharts";

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
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
