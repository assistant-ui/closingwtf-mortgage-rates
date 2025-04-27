import { PurchaseRatesResult } from "@/types/tools";
import { GetPurchaseRatesArgs } from "@/types/tools";

export const fetchPurchaseRates = async (args: GetPurchaseRatesArgs): Promise<PurchaseRatesResult | null> => {
    try {
      console.log("Fetching purchase rates for args", args);
      const response = await fetch(`https://staging.closingwtf.com/api/public/rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
      });
      if (!response.ok) throw new Error('Failed to fetch rate data');
      const data = await response.json();
      return data;
    } catch {
      return null;
    }
  }; 