export type GetPurchaseRatesArgs = {
    zipCode?: string;
    purchasePrice?: number;
    maxOutOfPocket?: number;
    qualifyingFicoScore?: number;
    neighborhoodHousingType?: string;
    loanTermYears?: string;
    loanPurpose?: string;
    propertyUsageType?: string;
    isFirstTimeHomeBuyer?: boolean;
};

export type PurchaseRatesResult = {
    results: {
        rate: number;
        apr: number;
        points: number;
        loanTermYears: number;
        ltv: number;
        qualifyingFicoScore: number;
        totalCost: number;
        totalPoints: number;
        pointsCost: number;
        pointsNeeded: number;
        principal: number;
        closingCosts: number;
        breakEvenMonths: number;
        downPaymentAmount: number;
        interest: number;
        ratePoints: number;
        product: {
            id: string;
            description: string;
        };
    }[];
};

export type AnalyzeRateArgs = {
    loanPurpose: "purchase" | "refinance";
    zipCode: string;
    purchasePrice: number;
    loanAmount: number;
    loanTermYears: number;
    monthlyIncome: number;
    monthlyDebt: number;
    neighborhoodHousingType: "SINGLE_FAMILY" | "MULTI_FAMILY" | "CONDO" | "MANUFACTURED";
    propertyUsageType: "PRIMARY_RESIDENCE" | "SECOND_HOME" | "INVESTMENT";
    qualifyingFicoScore: number;
    rateLockDays: number;
    isBorrowerSelfEmployed: boolean;
    isFirstTimeHomeBuyer: boolean;
    waiveEscrow: boolean;
    originationCost: number;
    pointsCostThreshold?: number;
    apr: number;
    interestRate: number;
    lenderCredits: number;
    cashOutAmount?: number;
    firstLienAmount?: number;
};

export type AnalyzeRateResult = {
    success: boolean;
    message: string;
    analysis: {
        rate: number;
        apr: number;
        points: number;
        loanTermYears: number;
        ltv: number;
        qualifyingFicoScore: number;
        totalCost: number;
        totalPoints: number;
        pointsCost: number;
        pointsNeeded: number;
        principal: number;
        closingCosts: number;
        breakEvenMonths: number;
        downPaymentAmount: number;
        interest: number;
        ratePoints: number;
        product: {
            id: string;
            description: string;
        };
    };
};