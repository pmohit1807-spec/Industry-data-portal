import React, { useMemo, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TractorSale } from '@/data/tractorData';
import { aggregateSalesForChart, ChartDataPoint, pivotSalesData } from '@/utils/dataTransformation';
import StateSelector from '@/components/StateSelector';
import RegionalTIVChart from '@/components/RegionalTIVChart';
import MarketShareChart from '@/components/MarketShareChart';
import TractorTable from '@/components/TractorTable';
import { parseMonthString } from '@/utils/dateUtils';
import { useSalesData } from '@/components/DashboardLayout';

// Define "Your Company" for the dashboard context
const YOUR_COMPANY = "Mahindra";

// Helper function to calculate Market Share per month for a specific state
const calculateStateMarketShareData = (salesData: TractorSale[], state: string, uniqueCompanies: string[]): ChartDataPoint[] => {
  const stateFilteredData = salesData.filter(d => d.state === state);
  const monthlyAggregates = aggregateSalesForChart(stateFilteredData, 'company');

  return monthlyAggregates.map(monthData => {
    const totalSales = uniqueCompanies.reduce((sum, company) => sum + (monthData[company] as number || 0), 0);

    const shareData: ChartDataPoint = { month: monthData.month };

    uniqueCompanies.forEach(company => {
      const sales = monthData[company] as number || 0;
      // Store market share as percentage (0 to 100)
      shareData[company] = totalSales > 0 ? (sales / totalSales) * 100 : 0;
    });

    return shareData;
  }).sort((a, b) => 
    parseMonthString(a.month as string).getTime() - parseMonthString(b.month as string).getTime()
  );
};


const RegionalAnalysis: React.FC = () => {
  const { filteredSalesData: salesData, isLoading, isError } = useSalesData();
  
  const uniqueStates = useMemo(() => Array.from(new Set(salesData?.map(d => d.state) || [])).sort(), [salesData]);
  const uniqueCompanies = useMemo(() => Array.from(new Set(salesData?.map(d => d.company) || [])), [salesData]);
  
  const [selectedState, setSelectedState] = useState<string>('');

  // Update selectedState when uniqueStates loads or changes
  useEffect(() => {
    if (uniqueStates.length > 0) {
      if (!selectedState || !uniqueStates.includes(selectedState)) {
        setSelectedState(uniqueStates[0]);
      }
    } else if (selectedState) {
        setSelectedState('');
    }
  }, [uniqueStates, selectedState]);

  // 1. Regional TIV Trend Data (for the selected state)
  const regionalTIVTrendData = useMemo(() => {
    if (!salesData || !selectedState) return [];
    
    // Filter data for the selected state
    const stateFilteredData = salesData.filter(d => d.state === selectedState);
    
    // Aggregate by month and use state name as the dimension key
    const monthlyAggregates = aggregateSalesForChart(stateFilteredData, 'state');
    
    // Sort by date
    return monthlyAggregates.sort((a, b) => 
      parseMonthString(a.month as string).getTime() - parseMonthString(b.month as string).getTime()
    );
    
  }, [salesData, selectedState]);

  // 2. Regional Market Share Trend Data (for the selected state)
  const regionalMarketShareData = useMemo(() => {
    if (!salesData || !selectedState) return [];
    return calculateStateMarketShareData(salesData, selectedState, uniqueCompanies);
  }, [salesData, selectedState, uniqueCompanies]);
  
  // 3. Pivoted Table Data (Latest Month in the FILTERED range)
  const pivotedTableData = useMemo(() => {
    if (!salesData || salesData.length === 0) return [];
    
    // Find the latest month in the FILTERED data
    const uniqueMonths = Array.from(new Set(salesData.map(d => d.month)));
    const latestMonth = uniqueMonths.sort((a, b) => parseMonthString(b).getTime() - parseMonthString(a).getTime())[0];
    
    const latestMonthSales = salesData.filter(d => d.month === latestMonth);
    
    // Pivot the latest month data across all states (using uniqueStates from filtered data)
    return pivotSalesData(latestMonthSales, uniqueStates);
    
  }, [salesData, uniqueStates]);


  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-center text-destructive">Failed to load sales data.</div>;
  }
  
  if (uniqueStates.length === 0) {
     return <div className="p-8 text-center text-muted-foreground">No sales data available for the selected period.</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Regional Analysis: State-wise Performance</h1>
      
      <div className="flex justify-start">
        {/* State selector is now optional if no states are present in the filtered data */}
        {selectedState && (
            <StateSelector 
              uniqueStates={uniqueStates} 
              selectedState={selectedState} 
              onStateChange={setSelectedState} 
            />
        )}
      </div>
      
      {/* Regional TIV Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Total Industry Volume (TIV) Trend in {selectedState}</CardTitle>
        </CardHeader>
        <RegionalTIVChart data={regionalTIVTrendData} stateName={selectedState} />
      </Card>

      {/* Regional Market Share Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Market Share Trend in {selectedState}</CardTitle>
        </CardHeader>
        <MarketShareChart data={regionalMarketShareData} seriesKeys={uniqueCompanies} />
      </Card>
      
      {/* Detailed Data Table (Latest Month) */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Sales Breakdown (Latest Month)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TractorTable data={pivotedTableData} uniqueStates={uniqueStates} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionalAnalysis;