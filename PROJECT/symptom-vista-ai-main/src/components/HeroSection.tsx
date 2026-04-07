import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import heroImage from "@/assets/medical-hero.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Animated Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/30 bg-card/50 backdrop-blur-sm mb-8 medical-glow">
          <Stethoscope className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">Cure X - AI Medical Triage</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Cure X
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Advanced AI medical triage with voice chat and emergency detection. 
          Get instant health insights, home remedies, and doctor recommendations in any language.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground medical-glow px-8 py-6 text-lg"
          >
            Start Diagnosis
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="border-primary/30 hover:bg-primary/10 px-8 py-6 text-lg"
          >
            Learn More
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/20">
            <div className="text-4xl font-bold text-primary mb-2">90%+</div>
            <div className="text-sm text-muted-foreground">Diagnostic Accuracy</div>
          </div>
          
          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/20">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Available Anytime</div>
          </div>
          
          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/20">
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <div className="text-sm text-muted-foreground">Conditions Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
