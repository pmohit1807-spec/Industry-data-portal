import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CardContent } from '@/components/ui/card';
import { ChartDataPoint } from '@/utils/dataTransformation';

interface RegionalTIVChartProps {
  data: ChartDataPoint[]; // Data points where keys are states (only one state key expected here)
  stateName: string;
}

const RegionalTIVChart: React.FC<RegionalTIVChartProps> = ({ data, stateName }) => {
  if (data.length === 0) {
    return (
      <CardContent className="p-6 text-center text-muted-foreground h-[400px] flex items-center justify-center">
        No TIV trend data available for {stateName}.
      </CardContent>
    );
  }
  
  // The data key is the stateName itself, as aggregated by aggregateSalesForChart
  const dataKey = stateName;

  return (
    <CardContent className="p-6 h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
          <YAxis 
            stroke="hsl(var(--foreground))" 
            tickFormatter={(value) => value.toLocaleString()}
            label={{ value: 'Units Sold (TIV)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem'
            }}
            labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
            formatter={(value: number, name: string) => [value.toLocaleString(), name]}
          />
          
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#3b82f6"
            name={`TIV in ${stateName}`}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  );
};

export default RegionalTIVChart;