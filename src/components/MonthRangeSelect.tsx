import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface MonthRangeSelectProps {
  uniqueMonths: string[];
  startMonth: string | undefined;
  setStartMonth: (month: string) => void;
  endMonth: string | undefined;
  setEndMonth: (month: string) => void;
}

const MonthRangeSelect: React.FC<MonthRangeSelectProps> = ({
  uniqueMonths,
  startMonth,
  setStartMonth,
  endMonth,
  setEndMonth,
}) => {
  // Determine available end months based on start month selection
  const startIndex = startMonth ? uniqueMonths.indexOf(startMonth) : 0;
  const availableEndMonths = uniqueMonths.slice(startIndex);

  // Effect to ensure endMonth is valid if startMonth changes
  useEffect(() => {
    if (startMonth && endMonth) {
      const startIdx = uniqueMonths.indexOf(startMonth);
      const endIdx = uniqueMonths.indexOf(endMonth);
      
      // If end month is chronologically before start month, reset end month to start month
      if (endIdx !== -1 && startIdx !== -1 && endIdx < startIdx) {
        setEndMonth(startMonth);
      }
    }
  }, [startMonth, endMonth, uniqueMonths, setEndMonth]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="start-month-select">Start Month</Label>
        <Select 
          value={startMonth} 
          onValueChange={(v) => setStartMonth(v === "All" ? undefined : v)}
        >
          <SelectTrigger id="start-month-select">
            <SelectValue placeholder="Select Start Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Months (Start)</SelectItem>
            {uniqueMonths.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="end-month-select">End Month</Label>
        <Select 
          value={endMonth} 
          onValueChange={(v) => setEndMonth(v === "All" ? undefined : v)}
        >
          <SelectTrigger id="end-month-select">
            <SelectValue placeholder="Select End Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Months (End)</SelectItem>
            {availableEndMonths.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default MonthRangeSelect;