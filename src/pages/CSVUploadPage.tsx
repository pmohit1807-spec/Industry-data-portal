import React from 'react';
import CSVUploadForm from '@/components/CSVUploadForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const CSVUploadPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Data Upload</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload New Sales Data</CardTitle>
        </CardHeader>
        <CardContent>
          <CSVUploadForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CSVUploadPage;