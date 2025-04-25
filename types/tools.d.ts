export type RateTableArgs = {
    zipCode: string;
    loanAmount: number;
    loanTermYears: number;
    ltv: number;
    qualifyingFicoScore: number;
};

export type RateTableResult = {
    rates: {
        rate: number;
        apr: number;
        points: number;
        loanTermYears: number;
        ltv: number;
        qualifyingFicoScore: number;
    }[];
};
