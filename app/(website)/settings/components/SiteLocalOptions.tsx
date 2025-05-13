"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export default function SiteLocalOptions() {
  const [includeOpenBanchoButton, setIncludeOpenBanchoButton] = useState(() => {
    return localStorage.getItem("includeOpenBanchoButton") || "false";
  });

  useEffect(() => {
    localStorage.setItem("includeOpenBanchoButton", includeOpenBanchoButton);
  }, [includeOpenBanchoButton]);

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Switch
          id="include-bancho-button"
          checked={includeOpenBanchoButton === "true"}
          onCheckedChange={(checked) =>
            setIncludeOpenBanchoButton(checked ? "true" : "false")
          }
        />
        <Label htmlFor="include-bancho-button">
          Include "Open on Bancho" button in beatmap page
        </Label>
      </div>
    </div>
  );
}
