import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface MonthRangeSelectorProps {
  allMonths: string[]; // Sorted list of all available months (e.g., ["Jan 2023", "Feb 2023", ...])
  startMonth: string | undefined;
  endMonth: string | undefined;
  onStartMonthChange: (month: string) => void;
  onEndMonthChange: (month: string) => void;
}

const MonthRangeSelector: React.FC<MonthRangeSelectorProps> = ({
  allMonths,
  startMonth,
  endMonth,
  onStartMonthChange,
  onEndMonthChange,
}) => {
  // Determine selectable start months (all months)
  const selectableStartMonths = allMonths;
  
  // Determine selectable end months (must be >= startMonth)
  const startMonthIndex = startMonth ? allMonths.indexOf(startMonth) : 0;
  const selectableEndMonths = allMonths.slice(startMonthIndex);

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-2 bg-card rounded-lg border shadow-sm">
      {/* Start Month Selector */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="start-month" className="text-xs text-muted-foreground">Start Month</Label>
        <Select 
          value={startMonth || allMonths[0]} 
          onValueChange={onStartMonthChange}
        >
          <SelectTrigger id="start-month" className="w-[150px]">
            <SelectValue placeholder="Select Start Month" />
          </SelectTrigger>
          <SelectContent>
            {selectableStartMonths.map(month => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* End Month Selector */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="end-month" className="text-xs text-muted-foreground">End Month</Label>
        <Select 
          value={endMonth || allMonths[allMonths.length - 1]} 
          onValueChange={onEndMonthChange}
        >
          <SelectTrigger id="end-month" className="w-[150px]">
            <SelectValue placeholder="Select End Month" />
          </SelectTrigger>
          <SelectContent>
            {selectableEndMonths.map(month => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MonthRangeSelector;