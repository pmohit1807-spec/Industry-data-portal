import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { CardContent } from '@/components/ui/card';

interface TIVDataPoint {
  month: string;
  tiv: number;
  companySales: number;
}

interface TIVTrendChartProps {
  data: TIVDataPoint[];
  yourCompany: string;
}

const TIVTrendChart: React.FC<TIVTrendChartProps> = ({ data, yourCompany }) => {
  if (data.length === 0) {
    return (
      <CardContent className="p-6 text-center text-muted-foreground h-[400px] flex items-center justify-center">
        No data available to display TIV trend.
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6 h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
          
          {/* Left Y-Axis for TIV (Bar) */}
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#3b82f6" 
            tickFormatter={(value) => value.toLocaleString()}
            label={{ value: 'Total Industry Volume (TIV)', angle: -90, position: 'insideLeft', fill: '#3b82f6' }}
          />
          
          {/* Right Y-Axis for Company Sales (Line) */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#10b981" 
            tickFormatter={(value) => value.toLocaleString()}
            label={{ value: `${yourCompany} Sales`, angle: 90, position: 'insideRight', fill: '#10b981' }}
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
          <Legend />
          
          {/* Bar for TIV */}
          <Bar yAxisId="left" dataKey="tiv" name="Total Industry Volume" fill="#3b82f6" />
          
          {/* Line for Company Sales */}
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="companySales" 
            name={`${yourCompany} Sales`} 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </CardContent>
  );
};

export default TIVTrendChart;