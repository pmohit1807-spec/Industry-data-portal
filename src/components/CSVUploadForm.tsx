import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/utils/toast";
import { upsertTractorSales } from "@/integrations/supabase/tractorSales";
import { TractorSale } from "@/data/tractorData";
import { Upload, Loader2, Download } from "lucide-react";
import CSVReader from "react-csv-reader";
import { normalizePivotedSalesData } from "@/utils/dataTransformation";
import { useQueryClient } from "@tanstack/react-query";

// Define a type alias for CSVReader to bypass strict type checking 
// for the render prop pattern, as the library's types seem incomplete regarding the 'children' prop function.
const TypedCSVReader = CSVReader as React.FC<any>;


const CSVUploadForm: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleCSVData = async (data: string[][]) => {
    if (data.length <= 1) {
      showError("The CSV file is empty or only contains headers.");
      return;
    }

    setIsUploading(true);
    try {
      // Use the new normalization function to convert pivoted data to row-based data
      const salesData = normalizePivotedSalesData(data);
      
      if (salesData.length === 0) {
        showError("No valid sales records found in the CSV.");
        return;
      }

      await upsertTractorSales(salesData);
      showSuccess(`${salesData.length} sales records successfully uploaded and updated.`);
      
      // Invalidate the query cache to trigger a dashboard refresh
      queryClient.invalidateQueries({ queryKey: ["tractorSales"] });

    } catch (error) {
      console.error(error);
      showError("Failed to upload data. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCSVError = (error: any) => {
    console.error("CSV Parsing Error:", error);
    showError("Error reading CSV file. Please ensure it is correctly formatted.");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Sales Data (CSV)</CardTitle>
        <CardDescription>
          Upload a CSV file to add new records or update existing ones.
          <br />
          Required columns: <code>Month</code>, <code>Company</code>, <code>HP Range</code>, and columns for each state (e.g., State1, State2, ...).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <a href="/demo_sales_data.csv" download className="w-full max-w-xs">
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Demo Template
            </Button>
          </a>
          
          <div className="w-full max-w-xs text-center text-sm text-muted-foreground">
            — OR —
          </div>

          <TypedCSVReader
            cssClass="csv-reader-input"
            label="Select CSV file"
            onFileLoaded={handleCSVData}
            onError={handleCSVError}
            parserOptions={{
              header: false, // We handle headers manually
              skipEmptyLines: true,
            }}
            inputStyle={{ display: 'none' }}
            inputName="csv-upload"
          >
            {({ file, inputRef, open }) => (
              <div className="flex flex-col items-center space-y-4 w-full">
                <Input
                  type="file"
                  accept=".csv"
                  ref={inputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      // The CSVReader component handles the file selection internally when 'open' is called.
                      // We keep the Input here for reference but rely on the CSVReader's logic.
                    }
                  }}
                  className="hidden"
                />
                <Button 
                  onClick={open} 
                  disabled={isUploading}
                  className="w-full max-w-xs"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Choose CSV File
                    </>
                  )}
                </Button>
                {file && <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>}
              </div>
            )}
          </TypedCSVReader>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVUploadForm;