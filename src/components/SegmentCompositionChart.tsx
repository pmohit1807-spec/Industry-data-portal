import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CardContent } from '@/components/ui/card';

interface SegmentVolumeData {
  hp_range: string;
  totalVolume: number;
}

interface SegmentCompositionChartProps {
  data: SegmentVolumeData[];
}

const SegmentCompositionChart: React.FC<SegmentCompositionChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <CardContent className="p-6 text-center text-muted-foreground h-[300px] flex items-center justify-center">
        No segment composition data available.
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6 h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          // Reduced margins for better fit on smaller screens
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis dataKey="hp_range" stroke="hsl(var(--foreground))" />
          <YAxis 
            stroke="hsl(var(--foreground))" 
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem'
            }}
            labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
            formatter={(value: number) => [value.toLocaleString(), "Total Volume"]}
          />
          
          <Bar 
            dataKey="totalVolume" 
            name="Total Volume" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  );
};

export default SegmentCompositionChart;