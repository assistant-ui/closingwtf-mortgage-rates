import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CurrencyInput } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { makeAssistantVisible, ToolCallContentPart, useComposerRuntime, useThreadListItemRuntime, useThreadRuntime } from "@assistant-ui/react";
import { DEFAULT_ZIP_DATA, useZip } from "@/lib/context/zip-context";
import { mortgageDetailsSchema } from "@/types/schemas";
import { GetPurchaseRatesArgs, PurchaseRatesResult } from "@/types/tools";
import { useForm } from "react-hook-form";
// import { useAssistantForm } from "@assistant-ui/react-hook-form";
// Assuming CurrencyInput might be needed for loan amount, like in the example
// If not available or needed, we'll use standard Input
// import { CurrencyInput } from "@/components/ui/input";

// const AssistantSelect = makeAssistantVisible(Select);
// const AssistantDiv = makeAssistantVisible("div" as any);

// const AssistantCurrencyInput = makeAssistantVisible(CurrencyInput);

interface FormLabelWithTooltipProps {
  label: string;
  tooltip: string;
}

function FormLabelWithTooltip({ label, tooltip }: FormLabelWithTooltipProps) {
  return (
    <div className="flex items-center gap-2">
      <FormLabel>{label}</FormLabel>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger type="button">
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

const AssistantCurrencyInput = makeAssistantVisible(CurrencyInput, {
  editable: true,
});

export function MortgageDetailsForm() {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const { zipData } = useZip();

  // "run-start"
  // | "run-end"
  // | "initialize"
  // | "model-context-update";
  const threadRuntime = useThreadRuntime();
  const threadListItemRuntime = useThreadListItemRuntime();
  // const threadListRuntime = useAssistantRuntime();
  // const assistantRuntime = useAssistantRuntime();
  const composerRuntime = useComposerRuntime();

  useEffect(() => {
    return threadRuntime.unstable_on("run-end", () => {
      const currentState = threadRuntime.getState();
      console.log("currentState", currentState);
      const lastMessage = currentState.messages[currentState.messages.length - 1];
      const lastContent = lastMessage?.content?.findLast(content => 'toolName' in content) as ToolCallContentPart<GetPurchaseRatesArgs, { purchaseRatesResult: PurchaseRatesResult }>;
      if(lastContent?.toolName === "retrieveMortgageRates") {
        const args = lastContent.args;
        const newThreadTitle = `${args.loanPurpose === "purchase" ? "Purchase" : "Refinance"} - $${(args.purchasePrice / 1000).toFixed(0)}k - ${args.loanTermYears}yr - FICO ${args.qualifyingFicoScore} - Zip ${args.zipCode}`;
        threadListItemRuntime?.rename(newThreadTitle);
      }

      
      // this does the same things as clicking new thread
      // threadListRuntime.threads.switchToNewThread();
    });
  }, [threadRuntime, threadListItemRuntime]);

  const form = useForm<z.infer<typeof mortgageDetailsSchema>>({
    resolver: zodResolver(mortgageDetailsSchema),
    defaultValues: {
      purchasePrice: 800000,
      maxOutOfPocket: 160000,
      loanTermYears: "30",
      qualifyingFicoScore: 740,
      loanPurpose: "purchase",
      propertyUsageType: "PRIMARY_RESIDENCE",
      neighborhoodHousingType: "SINGLE_FAMILY",
      isFirstTimeHomeBuyer: false,
    },
  });

  // Initialize composerRuntime config on first render
  useEffect(() => {
    composerRuntime.setRunConfig({
      custom: { formData: form.getValues(), zipCode: zipData || DEFAULT_ZIP_DATA}
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update composerRuntime config whenever form changes
  useEffect(() => {
    composerRuntime.setRunConfig({
      custom: { formData: form.getValues(), zipCode: zipData || DEFAULT_ZIP_DATA}
    });
  }, [composerRuntime, zipData, form]);


  return (
    <Form {...form}>
      <form 
      // onSubmit={form.handleSubmit(onSubmit)}
       className="space-y-8">
        {/* Personal Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="flex-grow h-px bg-border" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="qualifyingFicoScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Credit Score
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger className="bg-background dark:bg-gray-950">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="780">780 or higher</SelectItem>
                        <SelectItem value="760">760-779</SelectItem>
                        <SelectItem value="740">740-759</SelectItem>
                        <SelectItem value="720">720-739</SelectItem>
                        <SelectItem value="700">700-719</SelectItem>
                        <SelectItem value="680">680-699</SelectItem>
                        <SelectItem value="660">660-679</SelectItem>
                        <SelectItem value="640">640-659</SelectItem>
                        <SelectItem value="620">620-639</SelectItem>
                        <SelectItem value="600">600-619</SelectItem>
                        <SelectItem value="580">Below 600</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxOutOfPocket"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Out of Pocket</FormLabel>
                  <FormControl>
                    <AssistantCurrencyInput
                      {...field}
                      onChange={(e) => field.onChange(e)}
                      value={field.value ?? 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Property Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">Property Details</h2>
            <div className="flex-grow h-px bg-border" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="loanPurpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabelWithTooltip
                    label="Loan Purpose"
                    tooltip="Are you purchasing a new home or refinancing an existing one?"
                  />
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select loan purpose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background w-full">
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="refinance">Refinance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Price</FormLabel>
                  <FormControl>
                    <AssistantCurrencyInput
                      {...field}
                      onChange={(e) => field.onChange(e)}
                      value={field.value ?? 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Mortgage Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">Mortgage Details</h2>
            <div className="flex-grow h-px bg-border" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="loanTermYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Term (Years)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select loan term" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background">
                      <SelectItem value="30">30 Years Fixed</SelectItem>
                      <SelectItem value="20">20 Years Fixed</SelectItem>
                      <SelectItem value="15">15 Years Fixed</SelectItem>
                      <SelectItem value="10">10 Years Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Advanced Section */}
        <Collapsible
          open={isAdvancedOpen}
          onOpenChange={setIsAdvancedOpen}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent w-full flex items-center justify-between"
              >
                <h2 className="text-lg font-semibold">Advanced Details</h2>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isAdvancedOpen ? "transform rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <div className="flex-grow h-px bg-border" />
          </div>

          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="propertyUsageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelWithTooltip
                      label="Property Usage"
                      tooltip="How you plan to use the property"
                    />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select usage type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background">
                        <SelectItem value="PRIMARY_RESIDENCE">
                          Primary Residence
                        </SelectItem>
                        <SelectItem value="SECOND_HOME">
                          Second Home
                        </SelectItem>
                        <SelectItem value="INVESTMENT">
                          Investment Property
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhoodHousingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelWithTooltip
                      label="Property Type"
                      tooltip="Type of property"
                    />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background">
                        <SelectItem value="SINGLE_FAMILY">
                          Single Family
                        </SelectItem>
                        <SelectItem value="MULTI_FAMILY">
                          Multi Family
                        </SelectItem>
                        <SelectItem value="CONDO">Condo</SelectItem>
                        <SelectItem value="MANUFACTURED">
                          Manufactured
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFirstTimeHomeBuyer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelWithTooltip
                      label="First Time Home Buyer"
                      tooltip="Are you a first-time home buyer?"
                    />
                    <RadioGroup
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      defaultValue={field.value ? "true" : "false"}
                      className="grid grid-cols-2 w-full"
                    >
                      <FormItem className="flex items-center space-x-2 m-0 p-0">
                        <div className="flex items-center justify-between w-full border rounded-md p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 [&:has([data-state=checked])]:bg-primary/5 [&:has([data-state=checked])]:border-primary">
                          <FormLabel className="text-lg font-normal cursor-pointer flex-1">
                            Yes
                          </FormLabel>
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 m-0 p-0">
                        <div className="flex items-center justify-between w-full border rounded-md p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 [&:has([data-state=checked])]:bg-primary/5 [&:has([data-state=checked])]:border-primary">
                          <FormLabel className="text-lg font-normal cursor-pointer flex-1">
                            No
                          </FormLabel>
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                        </div>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Fetching Rates... (coming soon)
            </>
          ) : (
            "Show ClosingWTF Marketing Rates"
          )}
        </Button> */}
        <Button onClick={(e) => {
          composerRuntime.setText(
            JSON.stringify(form.getValues(), null, 2) + 
            `\n ZIP CODE: ${JSON.stringify(zipData)}`
          );
          composerRuntime.send();
          e.preventDefault();
        }}>
          Send Form to Assistant
        </Button>
      </form>
    </Form>
  );
}

