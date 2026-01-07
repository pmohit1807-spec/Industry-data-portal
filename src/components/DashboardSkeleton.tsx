import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 p-4">
      <Skeleton className="h-10 w-80 mb-4" /> {/* Title Skeleton */}
      
      {/* Filter/Selector Area */}
      <div className="flex justify-end">
        <Skeleton className="h-16 w-[350px]" />
      </div>

      {/* Executive Overview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Snapshot Card */}
        <Card className="lg:col-span-1 h-[450px]">
          <CardHeader><CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle></CardHeader>
          <CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent>
        </Card>
        
        {/* TIV Trend Card */}
        <Card className="lg:col-span-2 h-[450px]">
          <CardHeader><CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle></CardHeader>
          <CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent>
        </Card>
      </div>

      {/* Full Width Chart Card */}
      <Card className="h-[450px]">
        <CardHeader><CardTitle><Skeleton className="h-6 w-1/3" /></CardTitle></CardHeader>
        <CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent>
      </Card>
      
      {/* Data Table Placeholder */}
      <Card className="h-[300px]">
        <CardHeader><CardTitle><Skeleton className="h-6 w-1/4" /></CardTitle></CardHeader>
        <CardContent className="p-6"><Skeleton className="h-[200px] w-full" /></CardContent>
      </Card>
    </div>
  );
};

export default DashboardSkeleton;