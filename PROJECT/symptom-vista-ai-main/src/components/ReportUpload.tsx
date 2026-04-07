import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Loader2, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ReportUploadProps {
  onReportParsed: (reportData: any) => void;
}

const ReportUpload = ({ onReportParsed }: ReportUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);

        toast.loading("Parsing medical report...");

        try {
          const { data, error } = await supabase.functions.invoke('parse-report', {
            body: { imageBase64: base64String }
          });

          if (error) throw error;

          toast.success("Report parsed successfully!");
          onReportParsed(data);
        } catch (error) {
          console.error('Report parsing error:', error);
          toast.error("Failed to parse report. Please try again.");
          setImagePreview(null);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File reading error:', error);
      toast.error("Failed to read file");
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6 bg-card border-primary/20 medical-glow">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Upload Medical Report</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Upload blood test, urine test, X-ray, CT scan, or any medical report image for AI-powered analysis
        </p>

        {imagePreview ? (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Medical Report" 
              className="max-h-96 w-full object-contain rounded-lg border border-primary/30"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={clearImage}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div 
            className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
            <p className="text-sm font-medium mb-2">Click to upload medical report</p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing report...
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReportUpload;