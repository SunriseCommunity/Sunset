"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export default function SiteLocalOptions() {
  const [includeOpenBanchoButton, setIncludeOpenBanchoButton] = useState(() => {
    return localStorage.getItem("includeOpenBanchoButton") || "false";
  });

  const [useSpaciousUI, setUseSpaciousUI] = useState(() => {
    return localStorage.getItem("useSpaciousUI") || "false";
  });

  useEffect(() => {
    localStorage.setItem("includeOpenBanchoButton", includeOpenBanchoButton);
  }, [includeOpenBanchoButton]);

  useEffect(() => {
    localStorage.setItem("useSpaciousUI", useSpaciousUI);
  }, [useSpaciousUI]);

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
      <div className="flex items-center space-x-2 mt-4">
        <Switch
          id="use-spacious-ui"
          checked={useSpaciousUI === "true"}
          onCheckedChange={(checked) =>
            setUseSpaciousUI(checked ? "true" : "false")
          }
        />
        <Label htmlFor="use-spacious-ui">
          Use spacious UI (Increase spacing between elements)
        </Label>
      </div>
    </div>
  );
}
