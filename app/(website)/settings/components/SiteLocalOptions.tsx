"use client";

import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useT } from "@/lib/i18n/utils";

export default function SiteLocalOptions() {
  const t = useT("pages.settings.components.siteOptions");
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
          onCheckedChange={checked =>
            setIncludeOpenBanchoButton(checked ? "true" : "false")}
        />
        <Label htmlFor="include-bancho-button">
          {t("includeBanchoButton")}
        </Label>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <Switch
          id="use-spacious-ui"
          checked={useSpaciousUI === "true"}
          onCheckedChange={checked =>
            setUseSpaciousUI(checked ? "true" : "false")}
        />
        <Label htmlFor="use-spacious-ui">
          {t("useSpaciousUI")}
        </Label>
      </div>
    </div>
  );
}
