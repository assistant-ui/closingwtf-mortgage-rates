"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Breadcrumb, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Assistant } from "./assistant";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantRuntimeProvider, CompositeAttachmentAdapter, SimpleImageAttachmentAdapter, SimpleTextAttachmentAdapter } from "@assistant-ui/react";
import { PDFAttachmentAdapter } from "@/components/assistant-ui/adapters/pdf-attachment-adapter";
import { ZipSelector } from "@/components/forms/zip-selector";
import { SetZipCodeToolUI } from "@/components/assistant-ui/tools/zipcode";
import { SetRetrieveRatesToolUI } from "@/components/assistant-ui/tools/rates";
import { ZipProvider } from "@/lib/context/zip-context";

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


  
  return (
    <AssistantRuntimeProvider 
      runtime={runtime}
    >
      <ZipProvider>
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
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <Assistant />
        <SetZipCodeToolUI />
        <SetRetrieveRatesToolUI />
      </SidebarInset>
    </SidebarProvider>
    </ZipProvider>
  </AssistantRuntimeProvider>
  );
}
