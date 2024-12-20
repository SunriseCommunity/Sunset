"use client";

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
        <input
          type="checkbox"
          className="h-4 w-4 text-terracotta-500 border-terracotta-500"
          checked={includeOpenBanchoButton === "true"}
          onChange={(e) =>
            setIncludeOpenBanchoButton(e.target.checked ? "true" : "false")
          }
        />
        <label>Include "Open on Bancho" button in beatmap page</label>
      </div>
    </div>
  );
}
