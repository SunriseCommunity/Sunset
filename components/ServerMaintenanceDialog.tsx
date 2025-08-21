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
import Image from "next/image";

export default function ServerMaintenanceDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hey! Stop right there!</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col ">
              <p>
                The server is currently in <b>maintenance mode</b>, so some
                features of the website <b>may not function correctly</b>.
                {process.env.NEXT_PUBLIC_DISCORD_LINK && (
                  <span>
                    <br />
                    <br />
                    For more information view our Discord server.
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
            Okay, I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
