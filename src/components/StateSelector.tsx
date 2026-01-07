import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface StateSelectorProps {
  uniqueStates: string[];
  selectedState: string;
  onStateChange: (state: string) => void;
}

const StateSelector: React.FC<StateSelectorProps> = ({ uniqueStates, selectedState, onStateChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="state-select">Select State for Deep Dive</Label>
      <Select value={selectedState} onValueChange={onStateChange}>
        <SelectTrigger id="state-select" className="w-[200px]">
          <SelectValue placeholder="Select a State" />
        </SelectTrigger>
        <SelectContent>
          {uniqueStates.map(state => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StateSelector;