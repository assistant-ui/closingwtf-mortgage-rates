import { z } from "zod";


// Define the schema for the form
export const mortgageDetailsSchema = z.object({
  zipCode: z.string()
    .min(5, "Enter a valid 5-digit zip code")
    .max(5, "Enter a valid 5-digit zip code"),
  purchasePrice: z.number()
    .positive("Purchase price must be a positive number"),
  maxOutOfPocket: z.number()
    .positive("Max out of pocket must be a positive number"),
  loanTermYears: z.enum(["10", "15", "20", "30"]),
  qualifyingFicoScore: z.number()
    .int()
    .min(300, "FICO score must be between 300 and 850")
    .max(850, "FICO score must be between 300 and 850"),
  loanPurpose: z.enum(["purchase", "refinance"]),
  propertyUsageType: z.enum(["PRIMARY_RESIDENCE", "SECOND_HOME", "INVESTMENT"]),
  neighborhoodHousingType: z.enum(["SINGLE_FAMILY", "MULTI_FAMILY", "CONDO", "MANUFACTURED"]),
  isFirstTimeHomeBuyer: z.boolean(),
});

export const rateAnalyzerSchema = z.object({
    loanPurpose: z.enum(["purchase", "refinance"]),
    zipCode: z.string().length(5, "ZIP code must be 5 digits"),
    purchasePrice: z.number().min(0, "Purchase price must be positive"),
    loanAmount: z.number().min(0, "Loan amount must be positive"),
    loanTermYears: z.number().min(1, "Loan term must be at least 1 year"),
    monthlyIncome: z.number().min(0, "Monthly income must be positive"),
    monthlyDebt: z.number().min(0, "Monthly debt must be positive"),
    neighborhoodHousingType: z.enum([
      "SINGLE_FAMILY",
      "MULTI_FAMILY",
      "CONDO",
      "MANUFACTURED",
    ]),
    propertyUsageType: z.enum(["PRIMARY_RESIDENCE", "SECOND_HOME", "INVESTMENT"]),
    qualifyingFicoScore: z.number().min(300).max(850),
    rateLockDays: z.number().min(1, "Rate lock days must be at least 1"),
    isBorrowerSelfEmployed: z.boolean(),
    isFirstTimeHomeBuyer: z.boolean(),
    waiveEscrow: z.boolean().default(false),
    originationCost: z.number(),
    // pointsCost: z.number(),
    pointsCostThreshold: z.number().optional(),
    apr: z
      .number()
      .min(0, "APR must be positive")
      .max(100, "APR cannot exceed 100% or be less than interest rate"),
    interestRate: z
      .number()
      .min(0, "Interest rate must be positive")
      .max(100, "Interest rate cannot exceed 100%"),
    lenderCredits: z.number().default(0),
    cashOutAmount: z
      .number()
      .min(0, "Cash out amount must be positive")
      .optional(),
    firstLienAmount: z.number().optional(),
  });