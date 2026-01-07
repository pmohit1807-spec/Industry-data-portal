import React, { useState, useMemo } from "react";
import {
  TractorSale,
} from "@/data/tractorData";
import TractorTable from "./TractorTable";
import CSVUploadForm from "./CSVUploadForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pivotSalesData, aggregateSalesForChart } from "@/utils/dataTransformation";
import { useTractorSales } from "@/hooks/useTractorSales";
import { Loader2 } from "lucide-react";
import SalesLineChart from "./SalesLineChart";
import { isMonthStringWithinRange, parseMonthString } from "@/utils/dateUtils";
import MonthRangeSelect from "./MonthRangeSelect";

const TractorDashboard: React.FC = () => {
  const { data: salesData, isLoading, isError } = useTractorSales();
  
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedCompany, setSelectedCompany] = useState<string>("All");
  const [selectedHPRange, setSelectedHPRange] = useState<string>("All");
  const [chartDimension, setChartDimension] = useState<'company' | 'state'>('company');
  
  // New state for month range selection
  const [selectedStartMonth, setSelectedStartMonth] = useState<string | undefined>(undefined);
  const [selectedEndMonth, setSelectedEndMonth] = useState<string | undefined>(undefined);

  // Derive unique filter options from fetched data
  const uniqueStates = useMemo(() => Array.from(new Set(salesData?.map(d => d.state) || [])), [salesData]);
  const uniqueCompanies = useMemo(() => Array.from(new Set(salesData?.map(d => d.company) || [])), [salesData]);
  const uniqueHPRanges = useMemo(() => Array.from(new Set(salesData?.map(d => d.hp_range) || [])), [salesData]);
  
  // Derive and sort unique months
  const uniqueMonths = useMemo(() => {
    const months = Array.from(new Set(salesData?.map(d => d.month) || []));
    return months.sort((a, b) => parseMonthString(a).getTime() - parseMonthString(b).getTime());
  }, [salesData]);


  // 1. Filter raw data
  const rawFilteredData = useMemo(() => {
    if (!salesData) return [];
    
    return salesData.filter((sale: TractorSale) => {
      const stateMatch = selectedState === "All" || sale.state === selectedState;
      const companyMatch = selectedCompany === "All" || sale.company === selectedCompany;
      const hpMatch = selectedHPRange === "All" || sale.hp_range === selectedHPRange;
      
      const monthMatch = isMonthStringWithinRange(
        sale.month, 
        selectedStartMonth, 
        selectedEndMonth, 
        uniqueMonths
      );

      return stateMatch && companyMatch && hpMatch && monthMatch;
    });
  }, [salesData, selectedState, selectedCompany, selectedHPRange, selectedStartMonth, selectedEndMonth, uniqueMonths]);

  // 2. Pivot the filtered data for display
  const pivotedData = useMemo(() => {
    // Use the dynamically derived uniqueStates for pivoting
    return pivotSalesData(rawFilteredData, uniqueStates);
  }, [rawFilteredData, uniqueStates]);

  // 3. Prepare data for the chart
  const chartData = useMemo(() => {
    return aggregateSalesForChart(rawFilteredData, chartDimension);
  }, [rawFilteredData, chartDimension]);

  // 4. Determine series keys for the chart
  const chartSeriesKeys = useMemo(() => {
    return Array.from(new Set(rawFilteredData.map(d => d[chartDimension])));
  }, [rawFilteredData, chartDimension]);


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

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Tractor Sales Dashboard</h1>

      <Tabs defaultValue="view">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="view">View Data</TabsTrigger>
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-6">
          
          {/* Chart Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Sales Trend by Month</CardTitle>
              <div className="space-y-2 w-48">
                <Label htmlFor="chart-dimension-select">Breakdown by</Label>
                <Select 
                  value={chartDimension} 
                  onValueChange={(v) => setChartDimension(v as 'company' | 'state')}
                >
                  <SelectTrigger id="chart-dimension-select">
                    <SelectValue placeholder="Select Dimension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="state">State</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <SalesLineChart 
              data={chartData} 
              seriesKeys={chartSeriesKeys as string[]} 
              dimensionName={chartDimension} 
            />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Month Range Filter (Replaced DateRangePicker) */}
                <MonthRangeSelect 
                  uniqueMonths={uniqueMonths}
                  startMonth={selectedStartMonth}
                  setStartMonth={setSelectedStartMonth}
                  endMonth={selectedEndMonth}
                  setEndMonth={setSelectedEndMonth}
                />

                {/* State Filter */}
                <div className="space-y-2">
                  <Label htmlFor="state-filter">State</Label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger id="state-filter">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All States</SelectItem>
                      {uniqueStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Filter */}
                <div className="space-y-2">
                  <Label htmlFor="company-filter">Company</Label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger id="company-filter">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Companies</SelectItem>
                      {uniqueCompanies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* HP Range Filter */}
                <div className="space-y-2">
                  <Label htmlFor="hp-filter">HP Range</Label>
                  <Select value={selectedHPRange} onValueChange={setSelectedHPRange}>
                    <SelectTrigger id="hp-filter">
                      <SelectValue placeholder="Select HP Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All HP Ranges</SelectItem>
                      {uniqueHPRanges.map((hp) => (
                        <SelectItem key={hp} value={hp}>
                          {hp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Data ({pivotedData.length} Records)</CardTitle>
            </CardHeader>
            <CardContent>
              <TractorTable data={pivotedData} uniqueStates={uniqueStates} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <CSVUploadForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TractorDashboard;