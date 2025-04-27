"use client"

import { fetchPurchaseRates } from "@/lib/api/rates";
import { ToolCallContentPartProps, useAssistantTool } from "@assistant-ui/react";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GetPurchaseRatesArgs, PurchaseRatesResult } from "@/types/tools";
import { mortgageDetailsSchema } from "@/components/forms/mortgage-details-form";

const SetRatesDisplay = ({ args, status, result }: ToolCallContentPartProps<GetPurchaseRatesArgs, { purchaseRatesResult: PurchaseRatesResult }>) => {
    console.log({args, status, result});
    const rates = result?.purchaseRatesResult?.results;
    return (
      <div className="flex min-h-[68px] items-center gap-3 rounded-md border-2 border-blue-400 bg-muted/50 p-3 transition-all duration-300 hover:border-blue-500 hover:bg-muted/70 hover:shadow-md w-full">
        {status.type === "running" || status.type === "requires-action" && (
          <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> Fetching rates...</span>
        )}
        {status.type === "incomplete" && (
          <span className="text-destructive">{status.reason || "Failed to fetch rates"}</span>
        )}
        {status.type === "complete" && rates && rates.length > 0 && (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rate</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>APR</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Total Points</TableHead>
                  <TableHead>Points Cost</TableHead>
                  <TableHead>Points Needed</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Closing Costs</TableHead>
                  <TableHead>Break Even (mo)</TableHead>
                  <TableHead>Down Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates.map((rate, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{rate.rate?.toFixed ? rate.rate.toFixed(3) + '%' : '-'}</TableCell>
                    <TableCell>{rate.loanTermYears || '-'}</TableCell>
                    <TableCell>{rate.apr?.toFixed ? rate.apr.toFixed(3) + '%' : '-'}</TableCell>
                    <TableCell>{rate.interest?.toLocaleString?.() ?? '-'}</TableCell>
                    <TableCell>{rate.totalCost?.toLocaleString?.() ?? '-'}</TableCell>
                    <TableCell>{rate.totalPoints?.toFixed ? rate.totalPoints.toFixed(3) : '-'}</TableCell>
                    <TableCell>{rate.pointsCost?.toLocaleString?.() ?? '-'}</TableCell>
                    <TableCell>{rate.pointsNeeded?.toFixed ? rate.pointsNeeded.toFixed(3) : '-'}</TableCell>
                    <TableCell>{rate.principal?.toLocaleString?.() ?? '-'}</TableCell>
                    <TableCell>{rate.closingCosts?.toLocaleString?.() ?? '-'}</TableCell>
                    <TableCell>{rate.breakEvenMonths ?? '-'}</TableCell>
                    <TableCell>{rate.downPaymentAmount?.toLocaleString?.() ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {status.type === "complete" && (!rates || rates.length === 0) && (
          <span>No rates found.</span>
        )}
      </div>
    );
  };

export const SetRatesToolUI = () => {
    useAssistantTool({
      toolName: "retrieveMortgageRates",
      description: "Get the purchase rates for the property",
      execute: async (args) => {
        const defaultArgs = {
          zipCode: "45237",
          purchasePrice: 800000,
          maxOutOfPocket: 100000,
          loanTermYears: "30",
          qualifyingFicoScore: 700,
          loanPurpose: "purchase",
          propertyUsageType: "PRIMARY_RESIDENCE",
          neighborhoodHousingType: "SINGLE_FAMILY",
          isFirstTimeHomeBuyer: true,
        };
        const mergedArgs = { ...defaultArgs, ...args };
        const purchaseRatesResult = await fetchPurchaseRates(mergedArgs);
        console.log("SetRatesToolUI args", mergedArgs);
        return {
          success: true,
          message: "Rates retrieved successfully",
          purchaseRatesResult: purchaseRatesResult
        };
      },
      render: (obj) => {
        return <SetRatesDisplay {...obj} />;
      },
      parameters: mortgageDetailsSchema,
    });
  return null;
}
