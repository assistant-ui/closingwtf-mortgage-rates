import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useComposerRuntime } from "@assistant-ui/react";
import { createContext } from "@radix-ui/react-context";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

interface AttachmentInputContextValue {
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  triggerFileSelect?: () => void;
  addFile: (file: File) => void;
}

const [AttachmentInputProvider, useAttachmentInputContext] =
  createContext<AttachmentInputContextValue>("AttachmentInput");

interface AttachmentInputProps
  extends Omit<AttachmentInputContextValue, "triggerFileSelect" | "addFile"> {
  children: React.ReactNode;
  className?: string;
}

const AttachmentInput = forwardRef<HTMLDivElement, AttachmentInputProps>(
  ({ children, className, disabled = false, multiple = true, accept, ...props }, ref) => {
    const composer = useComposerRuntime();

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        for (const file of files) {
          composer.addAttachment(file);
        }
        console.log("files", files);
        e.target.value = "";
        composer.send();
      },
      [composer],
    );

    const triggerFileSelect = useCallback(() => {
      inputRef.current?.click();
    }, []);

    return (
      <AttachmentInputProvider
        disabled={disabled}
        multiple={multiple}
        accept={accept}
        addFile={composer.addAttachment}
        triggerFileSelect={triggerFileSelect}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          disabled={disabled}
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          tabIndex={-1}
          aria-hidden
        />
        <div ref={ref} {...props} className={cn(className)}>
          {children}
        </div>
      </AttachmentInputProvider>
    );
  },
);
AttachmentInput.displayName = "AttachmentInput";

interface AttachmentInputTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  children: React.ReactNode;
}

const AttachmentInputTrigger = forwardRef<
  HTMLButtonElement,
  AttachmentInputTriggerProps
>(({ children, asChild = false, ...props }, ref) => {
  const { disabled, triggerFileSelect } = useAttachmentInputContext(
    "AttachmentInputTrigger",
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      triggerFileSelect?.();
    },
    [triggerFileSelect],
  );

  const Comp = asChild ? Slot : Button;

  return (
    <Comp
      ref={ref}
      type="button"
      disabled={disabled}
      variant={asChild ? undefined : "ghost"}
      size={asChild ? undefined : "icon"}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Comp>
  );
});
AttachmentInputTrigger.displayName = "AttachmentInputTrigger";

interface AttachmentInputDropZoneProps
  extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
  children: React.ReactNode;
}

const AttachmentInputDropZone = forwardRef<
  HTMLDivElement,
  AttachmentInputDropZoneProps
>(({ children, className, asChild = false, ...props }, ref) => {
  const { disabled, addFile } = useAttachmentInputContext(
    "AttachmentInputDropZone",
  );
  const [isDragging, setIsDragging] = useState(false);
  const composerRuntime = useComposerRuntime();

  const handleDrag = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(e.type === "dragenter" || e.type === "dragover");
    },
    [disabled],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      for (const file of e.dataTransfer.files) {
        await addFile(file);
      }
      
      composerRuntime.send();
    },
    [disabled, addFile, composerRuntime],
  );

  const dragProps = {
    onDragEnter: handleDrag,
    onDragOver: handleDrag,
    onDragLeave: handleDrag,
    onDrop: handleDrop,
  };

  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      className={cn(className, { "ring-2 ring-primary": isDragging })}
      {...dragProps}
      {...props}
    >
      {children}
    </Comp>
  );
});
AttachmentInputDropZone.displayName = "AttachmentInputDropZone";

interface AttachmentInputPasteZoneProps
  extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
  children: React.ReactNode;
}

const AttachmentInputPasteZone = forwardRef<
  HTMLDivElement,
  AttachmentInputPasteZoneProps
>(({ children, asChild = false, ...props }, ref) => {
  const { disabled, multiple, addFile } = useAttachmentInputContext(
    "AttachmentInputPasteZone",
  );

  useEffect(() => {
    if (disabled) return;

    const handlePaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files || []);
      for (const file of files) {
        addFile(file);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [disabled, multiple, addFile]);

  const Comp = asChild ? Slot : "div";

  return (
    <Comp ref={ref} {...props}>
      {children}
    </Comp>
  );
});
AttachmentInputPasteZone.displayName = "AttachmentInputPasteZone";

export const AttachmentInputPrimitive = {
  Root: AttachmentInput,
  Trigger: AttachmentInputTrigger,
  DropZone: AttachmentInputDropZone,
  PasteZone: AttachmentInputPasteZone,
};