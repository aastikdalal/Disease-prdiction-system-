```tsx
import { useState, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import SymptomInput from "@/components/SymptomInput";
import DiagnosisResults from "@/components/DiagnosisResults";
import ReportUpload from "@/components/ReportUpload";
import ReportResults from "@/components/ReportResults";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    setShowDiagnosisForm(true);
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }, 100);
  };

  // FAKE DIAGNOSIS FUNCTION (No Supabase)
  const handleSubmit = async (symptoms: string) => {
    setIsLoading(true);
    setDiagnosisData(null);

    setTimeout(() => {
      const fakeDiagnosis = {
        possibleConditions: [
          { name: "Common Cold", probability: "60%" },
          { name: "Viral Fever", probability: "30%" },
          { name: "Allergy", probability: "10%" }
        ],
        recommendations: [
          "Drink plenty of fluids",
          "Take adequate rest",
          "Consult a doctor if symptoms persist"
        ],
        severity: "Low"
      };

      setDiagnosisData(fakeDiagnosis);
      setIsLoading(false);

      toast.success("Diagnosis generated!");

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 2000);
  };

  const handleReportParsed = (data: any) => {
    setReportData({
      summary: "Report analyzed successfully.",
      findings: ["Blood levels normal", "No major abnormalities detected"],
      recommendation: "Maintain healthy lifestyle"
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBack = () => {
    setDiagnosisData(null);
    setReportData(null);
    setShowDiagnosisForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={handleGetStarted} />

      {showDiagnosisForm && (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            {!diagnosisData && !reportData && (
              <Button
                variant="ghost"
                className="mb-6 hover:bg-primary/10"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            )}

            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4 text-center">
                AI Medical Analysis
              </h2>
              <p className="text-muted-foreground text-center">
                Get instant health insights from symptoms or medical reports
              </p>
            </div>

            <Tabs defaultValue="symptoms" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="symptoms">Symptom Check</TabsTrigger>
                <TabsTrigger value="reports">Medical Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="symptoms">
                <SymptomInput onSubmit={handleSubmit} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="reports">
                <ReportUpload onReportParsed={handleReportParsed} />
              </TabsContent>
            </Tabs>

            {diagnosisData && (
              <div ref={resultsRef} className="mt-12">
                <DiagnosisResults data={diagnosisData} />

                <div className="mt-8 text-center">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                    size="lg"
                  >
                    New Analysis
                  </Button>
                </div>
              </div>
            )}

            {reportData && (
              <div ref={resultsRef} className="mt-12">
                <ReportResults data={reportData} />

                <div className="mt-8 text-center">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                    size="lg"
                  >
                    New Analysis
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
```
