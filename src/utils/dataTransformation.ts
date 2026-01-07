import { TractorSale } from "@/data/tractorData";

export interface PivotedSale {
  month: string;
  company: string;
  hp_range: string;
  [key: string]: string | number; // Dynamic keys for states (e.g., 'Maharashtra', 'Punjab')
}

export interface ChartDataPoint {
  month: string;
  [key: string]: string | number; // Dynamic keys for series (e.g., company names or state names)
}

/**
 * Pivots the raw tractor sales data to show units sold per state in separate columns.
 * @param data Array of raw TractorSale objects.
 * @param uniqueStates Array of all unique state names present in the data.
 * @returns Array of PivotedSale objects.
 */
export const pivotSalesData = (data: TractorSale[], uniqueStates: string[]): PivotedSale[] => {
  const aggregatedMap = new Map<string, PivotedSale>();

  for (const sale of data) {
    const key = `${sale.month}|${sale.company}|${sale.hp_range}`;
    
    if (!aggregatedMap.has(key)) {
      const newRecord: PivotedSale = {
        month: sale.month,
        company: sale.company,
        hp_range: sale.hp_range,
      };
      // Initialize state columns to 0 using the provided uniqueStates list
      uniqueStates.forEach(state => {
        newRecord[state] = 0;
      });
      aggregatedMap.set(key, newRecord);
    }

    const record = aggregatedMap.get(key)!;
    
    // Aggregate units sold for the specific state
    const currentUnits = record[sale.state] as number || 0;
    record[sale.state] = currentUnits + sale.units_sold;
  }

  return Array.from(aggregatedMap.values());
};

/**
 * Normalizes (unpivots) sales data from a pivoted CSV format 
 * (Month, Company, HP Range, State1 Units, State2 Units, ...) 
 * back into the row-based TractorSale format (Month, State, Company, HP Range, Units Sold).
 * @param csvData Array of CSV rows (string[][]), including headers.
 * @returns Array of TractorSale objects.
 */
export const normalizePivotedSalesData = (csvData: string[][]): TractorSale[] => {
  if (csvData.length <= 1) return [];

  // Assuming headers are: Month, Company, HP Range, State1, State2, ...
  const headers = csvData[0].map(h => h.trim());
  const dataRows = csvData.slice(1);
  const normalizedData: TractorSale[] = [];

  // Identify the indices of the fixed columns
  const monthIndex = headers.findIndex(h => h.toLowerCase() === 'month');
  const companyIndex = headers.findIndex(h => h.toLowerCase() === 'company');
  const hpRangeIndex = headers.findIndex(h => h.toLowerCase() === 'hp range');

  if (monthIndex === -1 || companyIndex === -1 || hpRangeIndex === -1) {
    console.error("CSV headers missing required fields: Month, Company, or HP Range.");
    return [];
  }

  // State columns start after the fixed columns (index 3 onwards)
  const stateColumns = headers.slice(3);

  for (const row of dataRows) {
    const month = row[monthIndex];
    const company = row[companyIndex];
    const hp_range = row[hpRangeIndex];

    if (!month || !company || !hp_range) continue; // Skip incomplete rows

    // Iterate over state columns
    for (let i = 0; i < stateColumns.length; i++) {
      const state = stateColumns[i];
      // Units sold is at index 3 + i
      const unitsSoldString = row[i + 3]; 
      const units_sold = parseInt(unitsSoldString, 10);

      // Only record sales if units_sold is a positive number
      if (!isNaN(units_sold) && units_sold > 0) {
        normalizedData.push({
          month,
          state,
          company,
          hp_range,
          units_sold,
        });
      }
    }
  }

  return normalizedData;
};

/**
 * Aggregates sales data by month and a specified dimension (e.g., company or state or hp_range)
 * for use in a line chart.
 * @param data Array of raw TractorSale objects (already filtered).
 * @param dimensionKey The key to use for creating separate series ('company', 'state', or 'hp_range').
 * @returns Array of ChartDataPoint objects.
 */
export const aggregateSalesForChart = (data: TractorSale[], dimensionKey: 'company' | 'state' | 'hp_range'): ChartDataPoint[] => {
  const aggregatedMap = new Map<string, ChartDataPoint>(); // Key: month

  for (const sale of data) {
    const month = sale.month;
    const dimensionValue = sale[dimensionKey];
    const unitsSold = sale.units_sold;

    if (!aggregatedMap.has(month)) {
      aggregatedMap.set(month, { month });
    }

    const record = aggregatedMap.get(month)!;
    
    // Aggregate units sold for the specific dimension value
    const currentUnits = record[dimensionValue] as number || 0;
    record[dimensionValue] = currentUnits + unitsSold;
  }

  // Simple sorting by month string
  return Array.from(aggregatedMap.values()).sort((a, b) => a.month.localeCompare(b.month));
};