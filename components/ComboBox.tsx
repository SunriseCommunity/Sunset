import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useT } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";

interface Props {
  activeValue: string;
  setActiveValue: (value: string) => void;
  values: Array<{ value: string; label: string }>;
  includeInput?: boolean;
  buttonPreLabel?: string;
}

export function Combobox({
  activeValue,
  setActiveValue,
  values,
  includeInput,
  buttonPreLabel,
}: Props) {
  const t = useT("components.comboBox");
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between capitalize"
        >
          {activeValue
            ? (buttonPreLabel ?? "")
            + values.find(data => data.value === activeValue)?.label
            : t("selectValue")}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command>
          {includeInput && <CommandInput placeholder={t("searchValue")} />}
          <CommandList>
            <CommandEmpty>{t("noValuesFound")}</CommandEmpty>
            <CommandGroup>
              {values.map(data => (
                <CommandItem
                  className="capitalize"
                  key={`combo-box-item-${data.value}`}
                  value={data.value}
                  onSelect={(currentValue) => {
                    setActiveValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      activeValue === data.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {data.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
