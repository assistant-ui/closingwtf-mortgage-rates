"use client"

import { analyzeMortgageRate, fetchPurchaseRates } from "@/lib/api/rates";
import { ToolCallContentPartProps, useAssistantTool } from "@assistant-ui/react";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnalyzeRateArgs, AnalyzeRateResult, GetPurchaseRatesArgs, PurchaseRatesResult } from "@/types/tools";
import { mortgageDetailsSchema, rateAnalyzerSchema } from "@/types/schemas";
import { cn, formatCurrency } from "@/lib/utils";

// Shared Formatting Logic
const formatLabel = (key: string) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

const formatValue = (value: string | number | boolean | undefined | null, key: string) => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'number') {
    // Check if the field is likely a currency value based on key name
    if (key.toLowerCase().includes('pocket') ||
        key.toLowerCase().includes('cost') ||
        key.toLowerCase().includes('payment') ||
        key.toLowerCase().includes('price') ||
        key.toLowerCase().includes('principal') ||
        key.toLowerCase().includes('interest') ||
        key.toLowerCase().includes('amount')) {
      return formatCurrency(value);
    }
    return value.toLocaleString();
  }
  // Fallback for other types (though primarily expect primitives based on schema)
  if (typeof value !== 'string') {
    return JSON.stringify(value);
  }
  return value;
};

// Shared UI Components
interface ToolArgumentsDisplayProps {
  args?: Readonly<Record<string, unknown>>;
}

const ToolArgumentsDisplay: React.FC<ToolArgumentsDisplayProps> = ({ args }) => {
  if (!args || Object.keys(args).length === 0) return null;

  return (
    <div className="w-full overflow-x-auto border-b pb-3 mb-3">
      <p className="text-sm font-medium text-muted-foreground mb-2">Arguments Used:</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {Object.entries(args).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-medium text-muted-foreground">{formatLabel(key)}:</span>
            {/* Assert type here to satisfy linter */}
            <span>{formatValue(value as string | number | boolean | undefined | null, key)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ToolStatusDisplayProps {
  status: ToolCallContentPartProps<unknown, unknown>['status'];
  loadingText?: string;
  errorText?: string;
}

const ToolStatusDisplay: React.FC<ToolStatusDisplayProps> = ({
  status,
  loadingText = "Processing...",
  errorText = "Failed to process request"
}) => {
  if (status.type === "running" || status.type === "requires-action") {
    return (
      <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> {loadingText}</span>
    );
  }
  if (status.type === "incomplete") {
    return (
      <span className="text-destructive">{status.reason || errorText}</span>
    );
  }
  return null;
};

// Specific Tool Display Components
const SetRetrieveRatesDisplay = ({ args, status, result }: ToolCallContentPartProps<GetPurchaseRatesArgs, { purchaseRatesResult: PurchaseRatesResult }>) => {
    const rates = result?.purchaseRatesResult?.results;

    return (
      <div className={cn(
        "flex flex-col min-h-[68px] gap-3 rounded-md border-2 bg-muted/50 p-3 transition-all duration-300 hover:bg-muted/70 hover:shadow-md w-full",
        status.type === 'running' || status.type === 'requires-action' ? "border-blue-400 hover:border-blue-500" :
        status.type === 'incomplete' ? "border-destructive hover:border-destructive/80" :
        "border-green-400 hover:border-green-500"
      )}>
        <ToolArgumentsDisplay args={args} />
        <ToolStatusDisplay status={status} loadingText="Fetching rates from ClosingWTF..." errorText="Failed to fetch rates" />

        {status.type === "complete" && rates && rates.length > 0 && (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rate</TableHead>
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
                    <TableCell>{rate.apr?.toFixed ? rate.apr.toFixed(3) + '%' : '-'}</TableCell>
                    <TableCell>{formatCurrency(rate.interest)}</TableCell>
                    <TableCell>{formatCurrency(rate.totalCost)}</TableCell>
                    <TableCell>{rate.totalPoints?.toFixed ? rate.totalPoints.toFixed(3) : '-'}</TableCell>
                    <TableCell>{formatCurrency(rate.pointsCost)}</TableCell>
                    <TableCell>{rate.pointsNeeded?.toFixed ? rate.pointsNeeded.toFixed(3) : '-'}</TableCell>
                    <TableCell>{formatCurrency(rate.principal)}</TableCell>
                    <TableCell>{formatCurrency(rate.closingCosts)}</TableCell>
                    <TableCell>{rate.breakEvenMonths ?? '-'}</TableCell>
                    <TableCell>{formatCurrency(rate.downPaymentAmount)}</TableCell>
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

export const SetRetrieveRatesToolUI = () => {
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
        return <SetRetrieveRatesDisplay {...obj} />;
      },
      parameters: mortgageDetailsSchema,
    });
  return null;
}

const AnalyzeRateDisplay = ({ args, status, result }: ToolCallContentPartProps<AnalyzeRateArgs, { analyzeRateResult: AnalyzeRateResult }>) => {
  const analysis = result?.analyzeRateResult;

  return (
    <div className={cn(
      "flex flex-col min-h-[68px] gap-3 rounded-md border-2 bg-muted/50 p-3 transition-all duration-300 hover:bg-muted/70 hover:shadow-md w-full",
      status.type === 'running' || status.type === 'requires-action' ? "border-blue-400 hover:border-blue-500" :
      status.type === 'incomplete' ? "border-destructive hover:border-destructive/80" :
      "border-green-400 hover:border-green-500"
    )}>
      <ToolArgumentsDisplay args={args} />
      <ToolStatusDisplay status={status} loadingText="Analyzing rate..." errorText="Failed to analyze rate" />

      {status.type === "complete" && analysis && (
        <div className="w-full overflow-x-auto text-sm space-y-2">
            <p className="text-base font-semibold mb-2">Rate Analysis:</p>
            {Object.entries(analysis).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                    <span className="font-medium text-muted-foreground">{formatLabel(key)}:</span>
                    <span>{formatValue(value as string | number | boolean | undefined | null, key)}</span>
                </div>
            ))}
            {/* // TODO: Potentially add more structured display for analysis if needed */}
        </div>
      )}
      {status.type === "complete" && !analysis && (
        <span>No analysis results found.</span>
      )}
    </div>
  );
};

export const AnalyzeRateToolUI = () => {
    useAssistantTool({
        toolName: "analyzeRate",
        description: "Analyze an individual mortgage offer, and calculates a grade based on how competitive the offer is compared to the market. Returns a rate analysis and an array of comparable market rates.",
        parameters: rateAnalyzerSchema,
        execute: async (args) => {
            // Assert type here to ensure required fields are present for the API call
            const validatedArgs = args as AnalyzeRateArgs;
            const analyzeRateResult = await analyzeMortgageRate(validatedArgs);
            return { success: true, message: "Rate analyzed successfully", analyzeRateResult: analyzeRateResult };
        },
        render: (obj) => {
            return <AnalyzeRateDisplay {...obj} args={obj.args as AnalyzeRateArgs} />;
        },
    });
    return null;
}