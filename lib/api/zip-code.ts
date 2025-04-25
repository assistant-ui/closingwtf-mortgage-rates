import { toast } from "sonner";

export type ZipData = {
  zip: number;
  countyName: string;
  state: string;
  stCountyFp: number;
  classFp: string;
} | null;

export const fetchZipData = async (zipCode: string): Promise<ZipData> => {
  try {
    const response = await fetch(`https://staging.closingwtf.com/api/public/fips?zipcode=${zipCode}`);
    if (!response.ok) throw new Error('Failed to fetch zip data');
    const data = await response.json();
    toast.success('Zip code updated successfully');
    return data;
  } catch {
    toast.error('Failed to fetch zip code data');
    return null;
  }
}; 