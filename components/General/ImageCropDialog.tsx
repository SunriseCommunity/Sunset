"use client";

import { Grid, Image as ImageIcon, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";

type ImageCropDialogProps = {
  file: File | null;
  type: "avatar" | "banner";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCropped: (file: File) => void;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      }
      else {
        reject(new Error("Failed to read file"));
      }
    });
    reader.addEventListener("error", () => {
      reject(reader.error ?? new Error("Failed to read file"));
    });
    reader.readAsDataURL(file);
  });
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new window.Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () => reject(new Error("Failed to load image")));
    img.src = src;
  });
}

async function getCroppedImage(
  imageSrc: string,
  cropAreaPixels: Area,
  type: "avatar" | "banner",
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  const targetWidth = type === "avatar" ? 512 : 2048;
  const targetHeight = type === "avatar" ? 512 : 512;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    cropAreaPixels.x,
    cropAreaPixels.y,
    cropAreaPixels.width,
    cropAreaPixels.height,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      }
      else {
        reject(new Error("Failed to create blob from canvas"));
      }
    }, "image/png");
  });
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export default function ImageCropDialog({
  file,
  type,
  open,
  onOpenChange,
  onCropped,
}: ImageCropDialogProps) {
  const t = useT("components.imageCropDialog");

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const aspect = useMemo(() => (type === "avatar" ? 1 / 1 : 4 / 1), [type]);

  useEffect(() => {
    if (!file || !open)
      return;

    let active = true;
    readFileAsDataUrl(file)
      .then((dataUrl) => {
        if (active)
          setImageSrc(dataUrl);
      })
      .catch(() => {
        if (active)
          setImageSrc(null);
      });

    return () => {
      active = false;
    };
  }, [file, open]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixelsParam: Area) => {
    setCroppedAreaPixels(croppedAreaPixelsParam);
  }, []);

  const handleClose = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(MIN_ZOOM);
        setCroppedAreaPixels(null);
        setIsSaving(false);
        setShowGrid(false);
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const handleSave = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels || !file)
      return;

    try {
      setIsSaving(true);
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels, type);
      const croppedFile = new File([blob], file.name, { type: "image/png" });
      onCropped(croppedFile);
      handleClose(false);
    }
    catch (error) {
      console.error("Failed to crop image", error);
      setIsSaving(false);
    }
  }, [croppedAreaPixels, file, handleClose, imageSrc, onCropped, type]);

  const handleReset = useCallback(() => {
    setZoom(MIN_ZOOM);
    setCrop({ x: 0, y: 0 });
  }, []);

  if (!file)
    return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{type === "avatar" ? t("titleAvatar") : t("titleBanner")}</DialogTitle>
          <DialogDescription>
            {type === "avatar" ? t("descriptionAvatar") : t("descriptionBanner")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative h-72 w-full overflow-hidden rounded-lg bg-black/60">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropShape={type === "avatar" ? "round" : "rect"}
                showGrid={showGrid}
                restrictPosition
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <ImageIcon className="size-4 text-muted-foreground" />
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.01}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className={cn(
                  "h-2 w-1/2 cursor-pointer appearance-none rounded-full bg-muted focus:outline-none",
                  "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm",
                  "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-sm",
                )}
              />
              <ImageIcon className="size-6 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 px-2 text-muted-foreground"
                onClick={() => setShowGrid(prev => !prev)}
              >
                {showGrid ? t("hideGrid") : t("showGrid")}
                <Grid className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 px-2 text-muted-foreground"
                onClick={handleReset}
              >
                <RotateCcw className="size-4" />
                {t("reset")}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => handleClose(false)}
            disabled={isSaving}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            className="text-black"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!imageSrc || !croppedAreaPixels}
          >
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
