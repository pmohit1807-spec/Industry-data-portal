import { useQuery } from "@tanstack/react-query";
import { getTractorSales } from "@/integrations/supabase/tractorSales";

export const useTractorSales = () => {
  return useQuery({
    queryKey: ["tractorSales"],
    queryFn: getTractorSales,
  });
};