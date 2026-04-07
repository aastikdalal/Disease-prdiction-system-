import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Home, Hospital, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DiagnosisData {
  diagnosis: string;
  confidence: number;
  confidenceLevel?: string;
  description: string;
  language?: string;
  isEmergency?: boolean;
  emergencyInstructions?: string | null;
  possibleCauses: string[];
  recommendations: string[];
  homeRemedies: string[];
  redFlags?: string[];
  doctorVisit: {
    recommended: boolean;
    urgency: string;
    estimatedCost?: string;
    estimatedConsultationFee?: string;
    estimatedTreatmentCost?: string;
    specialists: string[];
    city?: string;
    topDoctors?: Array<{
      name: string;
      hospital?: string;
      experience?: string;
      rating?: number;
    }>;
  };
  relatedConditions: string[];
  alternativeDiagnoses?: Array<{
    condition: string;
    confidence: number;
    notes?: string;
  }>;
  nextSteps?: string[];
  disclaimer?: string;
}

interface DiagnosisResultsProps {
  data: DiagnosisData;
}

const DiagnosisResults = ({ data }: DiagnosisResultsProps) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Emergency Alert */}
      {data.isEmergency && (
        <Card className="p-6 bg-destructive/20 border-destructive animate-pulse">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-destructive mb-2">⚠️ MEDICAL EMERGENCY DETECTED</h3>
              <p className="text-destructive-foreground font-semibold mb-3">
                {data.emergencyInstructions || "Call emergency services immediately (108 in India)"}
              </p>
              <p className="text-sm text-muted-foreground">
                This requires immediate medical attention. Do not delay seeking emergency care.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Main Diagnosis */}
      <Card className={`p-6 bg-gradient-to-br from-card to-card/50 border-primary/30 medical-glow ${data.isEmergency ? 'border-destructive/50' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">{data.diagnosis}</h2>
            <p className="text-muted-foreground">{data.description}</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2 border-primary/50">
            {data.confidence}% Confidence
          </Badge>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="text-primary font-semibold">{data.confidence}%</span>
          </div>
          <Progress value={data.confidence} className="h-3" />
        </div>
      </Card>

      {/* Doctor Consultation */}
      <Card className="p-6 bg-card border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Hospital className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Doctor Consultation</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Recommended:</span>
            <Badge variant={data.doctorVisit.recommended ? 'default' : 'secondary'}>
              {data.doctorVisit.recommended ? 'Yes' : 'No'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Urgency:</span>
            <Badge variant={getUrgencyColor(data.doctorVisit.urgency)}>
              {data.doctorVisit.urgency.toUpperCase()}
            </Badge>
          </div>
          
          {(data.doctorVisit.estimatedConsultationFee || data.doctorVisit.estimatedCost) && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Consultation Fee:</span>
              <span className="font-semibold text-primary">
                {data.doctorVisit.estimatedConsultationFee || data.doctorVisit.estimatedCost}
              </span>
            </div>
          )}
          
          {data.doctorVisit.estimatedTreatmentCost && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Treatment Cost Range:</span>
              <span className="font-semibold text-primary">{data.doctorVisit.estimatedTreatmentCost}</span>
            </div>
          )}
          
          <div>
            <span className="text-sm text-muted-foreground block mb-2">Recommended Specialists:</span>
            <div className="flex flex-wrap gap-2">
              {data.doctorVisit.specialists.map((specialist, index) => (
                <Badge key={index} variant="outline" className="border-primary/30">
                  {specialist}
                </Badge>
              ))}
            </div>
          </div>

          {data.doctorVisit.topDoctors && data.doctorVisit.topDoctors.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground block mb-3">Top Recommended Doctors:</span>
              <div className="space-y-2">
                {data.doctorVisit.topDoctors.map((doctor, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30 border border-primary/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{doctor.name}</p>
                        {doctor.hospital && (
                          <p className="text-sm text-muted-foreground">{doctor.hospital}</p>
                        )}
                        {doctor.experience && (
                          <p className="text-xs text-muted-foreground mt-1">{doctor.experience}</p>
                        )}
                      </div>
                      {doctor.rating && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          ⭐ {doctor.rating}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Possible Causes */}
        <Card className="p-6 bg-card border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Possible Causes</h3>
          </div>
          <ul className="space-y-2">
            {data.possibleCauses.map((cause, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">{cause}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Recommendations */}
        <Card className="p-6 bg-card border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {data.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Home Remedies */}
      <Card className="p-6 bg-card border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Home Remedies</h3>
        </div>
        <ul className="space-y-3">
          {data.homeRemedies.map((remedy, index) => (
            <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <span className="text-primary font-semibold min-w-6">{index + 1}.</span>
              <span className="text-sm text-muted-foreground">{remedy}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Red Flags Warning */}
      {data.redFlags && data.redFlags.length > 0 && (
        <Card className="p-6 bg-destructive/10 border-destructive/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <h3 className="text-xl font-semibold text-destructive">⚠️ Warning Signs</h3>
          </div>
          <ul className="space-y-2">
            {data.redFlags.map((flag, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-destructive mt-1 font-bold">!</span>
                <span className="text-foreground">{flag}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground font-semibold">
            If you experience any of these symptoms, seek immediate medical attention.
          </p>
        </Card>
      )}

      {/* Alternative Diagnoses */}
      {data.alternativeDiagnoses && data.alternativeDiagnoses.length > 0 && (
        <Card className="p-6 bg-card border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Other Possible Conditions</h3>
          </div>
          <div className="space-y-3">
            {data.alternativeDiagnoses.map((alt, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-foreground">{alt.condition}</p>
                  <Badge variant="outline" className="border-primary/30">
                    {alt.confidence}% confidence
                  </Badge>
                </div>
                {alt.notes && (
                  <p className="text-sm text-muted-foreground">{alt.notes}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Next Steps */}
      {data.nextSteps && data.nextSteps.length > 0 && (
        <Card className="p-6 bg-card border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Next Steps</h3>
          </div>
          <ol className="space-y-2 list-decimal list-inside">
            {data.nextSteps.map((step, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {step}
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Related Conditions */}
      {data.relatedConditions && data.relatedConditions.length > 0 && (
        <Card className="p-6 bg-card border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Related Conditions</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.relatedConditions.map((condition, index) => (
              <Badge key={index} variant="outline" className="border-primary/30">
                {condition}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="p-4 bg-muted/30 border-border">
        <p className="text-xs text-muted-foreground text-center">
          <strong>Medical Disclaimer:</strong> {data.disclaimer || 
            "This AI-powered triage is for informational and educational purposes only and does not constitute a medical diagnosis or prescription. Always consult with a qualified healthcare provider for accurate diagnosis and treatment. For medical emergencies, call your local emergency services (108 in India) immediately."}
        </p>
      </Card>
    </div>
  );
};

export default DiagnosisResults;
