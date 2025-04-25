"use client";

import { Thread } from "@/components/assistant-ui/thread";
import { ResizableHandle } from "@/components/ui/resizable";
import { ResizablePanel } from "@/components/ui/resizable";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { ThreadListWithDrawer } from "@/components/assistant-ui/thread-list-with-drawer";
import { MortgageDetailsFormWithDrawer } from "./components/forms/mortgage-details-form-with-drawer";

export const Assistant = () => {
  return (
    <>
      {/* Desktop View with Resizable Panels */}
      <div className="hidden md:block">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="p-4">
              <MortgageDetailsFormWithDrawer />
              {/* <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  <div className="aspect-video rounded-xl bg-muted/50" />
                  <div className="aspect-video rounded-xl bg-muted/50" />
                  <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
              </div> */}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="flex flex-col flex-grow p-2">
              
              <div className="h-[calc(100vh-80px)] overflow-auto">
                <Thread />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile View */}
      <div className="md:hidden h-screen">
        <div className="flex flex-col h-full">
          <div className="p-2">
            <ThreadListWithDrawer />
          </div>
          <div className="flex flex-col flex-grow p-2">
            <div className="sticky top-0 z-10 bg-background">
              <MortgageDetailsFormWithDrawer />
            </div>
            <div className="h-[calc(100vh-160px)] overflow-auto">
              <Thread />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
