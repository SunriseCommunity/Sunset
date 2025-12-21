import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n/utils";
import Image from "next/image";

export default function ServerMaintenanceDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
}) {
  const t = useT("components.serverMaintenanceDialog");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col ">
              <p>
                {t.rich("message")}
                {process.env.NEXT_PUBLIC_DISCORD_LINK && (
                  <span>
                    <br />
                    <br />
                    {t("discordMessage")}
                  </span>
                )}
              </p>
              <Image
                src="/images/wip.png"
                alt="wip"
                width={200}
                height={400}
                className="max-w-fit"
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setOpen(false)}
          >
            {t("button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
