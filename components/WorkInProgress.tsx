import Image from "next/image";

import { useT } from "@/lib/i18n/utils";

export function WorkInProgress() {
  const t = useT("components.workInProgress");
  return (
    <div className="flex flex-col items-center justify-center space-x-4 rounded-lg p-4 text-current">
      <Image
        src="/images/wip.png"
        alt="wip"
        width={200}
        height={400}
        className="max-w-fit"
      />
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p>{t("description")}</p>
      </div>
    </div>
  );
}
