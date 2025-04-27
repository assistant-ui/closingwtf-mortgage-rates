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