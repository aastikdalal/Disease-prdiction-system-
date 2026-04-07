import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface ReportResultsProps {
  data: any;
}

const ReportResults = ({ data }: ReportResultsProps) => {
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Normal</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 flex items-center gap-1"><TrendingUp className="w-3 h-3" />High</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30 flex items-center gap-1"><TrendingDown className="w-3 h-3" />Low</Badge>;
      case 'abnormal':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Abnormal</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Report Analysis</h3>
        </div>

        {data.reportType && (
          <div className="mb-4">
            <Badge variant="secondary" className="text-sm">
              {data.reportType}
            </Badge>
          </div>
        )}

        {data.extractedData && data.extractedData.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-foreground">Test Results</h4>
            <div className="space-y-3">
              {data.extractedData.map((test: any, index: number) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-foreground">{test.testName}</p>
                      <p className="text-sm text-muted-foreground">
                        Normal Range: {test.normalRange || 'N/A'}
                      </p>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{test.value}</span>
                    <span className="text-sm text-muted-foreground">{test.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.abnormalFindings && data.abnormalFindings.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h4 className="font-semibold text-foreground">Abnormal Findings</h4>
            </div>
            <ul className="space-y-2">
              {data.abnormalFindings.map((finding: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-destructive mt-1">•</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.clinicalSignificance && (
          <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2 text-foreground">Clinical Significance</h4>
            <p className="text-muted-foreground">{data.clinicalSignificance}</p>
          </div>
        )}

        {data.recommendedFollowUp && data.recommendedFollowUp.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Recommended Follow-up</h4>
            <ul className="space-y-2">
              {data.recommendedFollowUp.map((action: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">✓</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card className="p-4 bg-destructive/5 border-destructive/20">
        <p className="text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> This analysis is for informational purposes only and does not constitute medical advice. 
          Always consult with a qualified healthcare professional for proper diagnosis and treatment.
        </p>
      </Card>
    </div>
  );
};

export default ReportResults;