"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, PencilIcon } from "lucide-react";
import { ReactNode } from "react";

interface InlineEditProps {
  value: ReactNode;
  onSave: () => Promise<void>;
  isLoading?: boolean;
  trigger?: ReactNode;
  children: ReactNode;
  popoverWidth?: string;
  label?: string;
  description?: string;
  hideSaveButton?: boolean;
}

export function InlineEdit({
  value,
  onSave,
  isLoading,
  trigger,
  children,
  popoverWidth = "w-80",
  label,
  description,
  hideSaveButton = false,
}: InlineEditProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="font-medium">{value}</div>
      <Popover>
        <PopoverTrigger asChild>
          {trigger || (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <PencilIcon className="h-3 w-3" />
              )}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className={popoverWidth}>
          <div className="space-y-2">
            {label && <h4 className="font-medium leading-none">{label}</h4>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <div className="flex gap-2">
              {children}
              {hideSaveButton ? null : (
                <Button onClick={onSave} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
