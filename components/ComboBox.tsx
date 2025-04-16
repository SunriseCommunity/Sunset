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
import { cn } from "@/lib/utils";

import { ChevronsUpDown, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  activeValue: string;
  setActiveValue: (value: string) => void;
  values: { value: string; label: string }[];
  includeInput?: boolean;
}

export function Combobox({
  activeValue,
  setActiveValue,
  values,
  includeInput,
}: Props) {
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
            ? values.find((data) => data.value === activeValue)?.label
            : "Select value..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command>
          {includeInput && <CommandInput placeholder="Search value..." />}
          <CommandList>
            <CommandEmpty>No values found.</CommandEmpty>
            <CommandGroup>
              {values.map((data, index) => (
                <CommandItem
                  className="capitalize"
                  key={index}
                  value={data.value}
                  onSelect={(currentValue) => {
                    setActiveValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      activeValue === data.value ? "opacity-100" : "opacity-0"
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
