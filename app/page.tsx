"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Breadcrumb, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Assistant } from "./assistant";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantRuntimeProvider, CompositeAttachmentAdapter, makeAssistantTool, SimpleImageAttachmentAdapter, SimpleTextAttachmentAdapter } from "@assistant-ui/react";
import { PDFAttachmentAdapter } from "@/components/assistant-ui/adapters/pdf-attachment-adapter";
import { ZipSelector } from "@/components/forms/zip-selector";
import { z } from "zod";
import { fetchZipData } from "@/lib/api/zip-code";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useZip } from "@/lib/context/zip-context";

export default function Home() {
  const runtime = useChatRuntime({
    api: "/api/chat",
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
        new PDFAttachmentAdapter(),
      ]),
    },
  });

  const SetZipCodeDisplay = ({ args }: { args: { zipCode: string } }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { zipData, setZipData } = useZip();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchZipCode = async () => {
        setIsLoading(true);
        setError(null);
        try {
          if(args.zipCode && args.zipCode !== zipData?.zip.toString()) {
            const zipCodeUpdateResult = await fetchZipData(args.zipCode);
            setZipData(zipCodeUpdateResult);
            toast.success("Zip code data fetched successfully", {
              description: `Zip code: ${args.zipCode}`,
            });
          }
        } catch (e: unknown) {
          console.error("Failed to fetch zip data:", e);
          const errorMessage = e instanceof Error ? e.message : "Failed to fetch zip data";
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      fetchZipCode();
    }, []);

    return (
      <div className="flex min-h-[68px] items-center gap-3 rounded-md border-2 border-blue-400 bg-muted/50 p-3 transition-all duration-300 hover:border-blue-500 hover:bg-muted/70 hover:shadow-md">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {isLoading ? "Fetching zip code data..." : error ? "Error" : "Zip Code Data"}
          </span>
          <span className="text-sm text-muted-foreground">
            {isLoading ? args.zipCode : error ? error : JSON.stringify(zipData, null, 2)}
          </span>
        </div>
      </div>
    );
  };

  const SetZipCodeToolUI = makeAssistantTool({
    toolName: "setZipCode",
    render: (obj) => {
      console.log("SetZipCodeToolUI obj", obj);
      return <SetZipCodeDisplay args={obj.args as { zipCode: string }} />;
    },
    parameters: z.object({
      zipCode: z.string(),
    }),
    description: "Set the zip code for the property"
  });

  
  return (
    <AssistantRuntimeProvider 
      runtime={runtime}
    >
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Rate Finder
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <ZipSelector />
                  <SetZipCodeToolUI />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <Assistant />
      </SidebarInset>
    </SidebarProvider>
  </AssistantRuntimeProvider>
  );
}
