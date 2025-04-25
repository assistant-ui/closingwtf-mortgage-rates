"use client";

import React from "react";
import { ThreadList } from "./thread-list";

export const ThreadListWithDrawer: React.FC = () => {
  return (
    <>
      {/* Drawer for mobile view */}
      {/* <div className="md:hidden">
        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <PanelLeftOpen className="size-5" />
              <span className="sr-only">Open Thread List</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-3/4 p-4">
            <ThreadList />
          </DrawerContent>
        </Drawer>
      </div> */}

      {/* Full ThreadList for desktop view */}
      <div className="hidden md:block">
        <ThreadList />
      </div>
    </>
  );
};
