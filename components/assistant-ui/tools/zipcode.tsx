"use client"

import { fetchZipData } from "@/lib/api/zip-code";
import { useZip } from "@/lib/context/zip-context";
import { ToolCallMessagePartProps, useAssistantTool } from "@assistant-ui/react";
import { Check, Loader2 } from "lucide-react";
import { z } from "zod";

const SetZipCodeDisplay = ({ args, status, result }: ToolCallMessagePartProps<{ zipCode?: string }, { zipObj: { zip: number; countyName: string; state: string; stCountyFp: number; classFp: string; } }>) => {
    console.log({args, status, result});
    return (
      <div className="flex min-h-[68px] items-center gap-3 rounded-md border-2 border-blue-400 bg-muted/50 p-3 transition-all duration-300 hover:border-blue-500 hover:bg-muted/70 hover:shadow-md">
        {status.type === "running" && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        {status.type === "incomplete" &&  "X"}
        {status.type === "complete" && <Check className="h-5 w-5 text-success" />}
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {status.type === "running" ? `Fetching zip code data for ${args.zipCode}` :
             status.type === "incomplete" ? "Error" : `Set zip code to ${args.zipCode}`}
          </span>
          <span className="text-sm text-muted-foreground">
            {status.type === "running" ? args.zipCode : 
             status.type === "incomplete" ? (status.reason || "Failed to fetch data") : 
             JSON.stringify(result?.zipObj, null, 2)
            }
          </span>
        </div>
      </div>
    );
  };

export const SetZipCodeToolUI = () => {
    const { setZipData } = useZip();

    useAssistantTool({
      toolName: "setZipCode",
      description: "Set the zip code for the property",
      execute: async (args) => {
        const zipCodeUpdateResult = await fetchZipData(args.zipCode);
        setZipData(zipCodeUpdateResult);
        console.log("SetZipCodeToolUI args", args);
        return {
          success: true,
          message: "Zip code set successfully",
          zipObj: zipCodeUpdateResult
        };
      },
      render: (obj) => {
        return <SetZipCodeDisplay {...obj} />;
      },
      parameters: z.object({
        zipCode: z.string(),
      }),
    });
  return null;
}
