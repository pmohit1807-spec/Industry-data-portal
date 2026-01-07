import { supabase } from "./client";
import { TractorSale } from "@/data/tractorData";

/**
 * Fetches all tractor sales records from the database.
 * @returns Array of TractorSale objects.
 */
export async function getTractorSales(): Promise<TractorSale[]> {
  const { data, error } = await supabase
    .from("tractor_sales")
    .select("*");

  if (error) {
    console.error("Error fetching tractor sales data:", error);
    throw new Error(error.message);
  }

  return data as TractorSale[];
}

/**
 * Upserts an array of tractor sales records into the database.
 * @param data Array of TractorSale objects.
 * @returns The result of the upsert operation.
 */
export async function upsertTractorSales(data: TractorSale[]) {
  // The 'tractor_sales' table has RLS enabled, so this operation will run
  // under the context of the currently authenticated user.
  const { data: result, error } = await supabase
    .from("tractor_sales")
    .upsert(data, { onConflict: "month, state, company, hp_range" })
    .select();

  if (error) {
    console.error("Error upserting tractor sales data:", error);
    throw new Error(error.message);
  }

  return result;
}