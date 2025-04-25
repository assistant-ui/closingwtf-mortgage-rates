"use client";

import { InlineEdit } from "../ui/inline-edit";
import { Input } from "../ui/input";
import { useState } from "react";
import { useZip } from "@/lib/context/zip-context";
import { fetchZipData } from "@/lib/api/zip-code";

// Define the tool using the tool() helper
// const setZipCodeTool = {
//   type: "human" as const,
//   toolName: "setZipCode",
//   parameters: z.object({
//     zipCode: z.number(),
//   }),
//   description: "Set the zip code for the property"
// } as const;

// Create a tool component
export const ZipSelector = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { zipData, setZipData } = useZip();
  const [zipCodeEdit, setZipCodeEdit] = useState(zipData?.zip ?? 90210);

  const handleZipUpdate = async (zipCode: string) => {
    setIsLoading(true);
    const data = await fetchZipData(zipCode);
    setZipData(data);
    setIsLoading(false);
  };

  const displayValue = zipData === undefined 
    ? "90210 - CA" 
    : zipData === null 
      ? String(zipCodeEdit)
      : `${zipData.zip} - ${zipData.countyName}, ${zipData.state}`;

  return (
    <>
      <InlineEdit
        onSave={async () => {
          await handleZipUpdate(zipCodeEdit.toString());
          return Promise.resolve();
        }}
        value={displayValue}
        isLoading={isLoading}
        label="Zip Code"
        description="Enter the zip code of the property"
      >
        <Input
          type="number"
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 5) {
              setZipCodeEdit(Number(value));
            }
          }}
          value={zipCodeEdit}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </InlineEdit>
    </>
  );
};