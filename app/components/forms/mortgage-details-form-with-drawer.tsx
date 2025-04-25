"use client";

import React from "react";
import { Settings } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MortgageDetailsForm } from "@/components/forms/mortgage-details-form";

export const MortgageDetailsFormWithDrawer: React.FC = () => {
  return (
    <>
      {/* Drawer for mobile view */}
      <div className="md:hidden">
        <Drawer direction="bottom">
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full">
              <Settings className="size-4" />
              Mortgage Details
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[85vh] px-4 pb-8">
            <div className="mt-4 overflow-y-auto">
              <MortgageDetailsForm />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Full form for desktop view */}
      <div className="hidden md:block">
        <MortgageDetailsForm />
      </div>
    </>
  );
}; 