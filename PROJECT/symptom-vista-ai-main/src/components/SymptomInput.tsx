import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mic, Upload, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface SymptomInputProps {
  onSubmit: (symptoms: string, imageBase64?: string) => void;
  isLoading: boolean;
}

const SymptomInput = ({ onSubmit, isLoading }: SymptomInputProps) => {
  const [symptoms, setSymptoms] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          
          toast.loading("Processing voice...");
          
          try {
            const { supabase } = await import("@/integrations/supabase/client");
            const { data, error } = await supabase.functions.invoke('speech-to-text', {
              body: { audio: base64Audio }
            });

            if (error) throw error;

            if (data?.text) {
              setSymptoms(prev => prev ? `${prev} ${data.text}` : data.text);
              toast.success("Voice converted to text!");
            }
          } catch (error) {
            console.error('Speech-to-text error:', error);
            toast.error("Failed to process voice input");
          }
        };
        reader.readAsDataURL(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started - speak now");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setImagePreview(base64String);
        toast.success("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!symptoms.trim() && !selectedImage) {
      toast.error("Please provide symptoms or upload an image");
      return;
    }

    onSubmit(symptoms, selectedImage || undefined);
  };

  return (
    <Card className="p-6 bg-card border-primary/20 medical-glow">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Describe Your Symptoms
          </label>
          <Textarea
            placeholder="e.g., I have a persistent headache, fever of 101°F, and feeling dizzy..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="min-h-32 bg-input border-border focus:border-primary resize-none"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
          >
            <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'text-destructive animate-pulse' : ''}`} />
            {isRecording ? 'Stop Recording' : 'Voice Input'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {imagePreview && (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Uploaded" 
              className="max-h-64 rounded-lg border border-primary/30"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
            >
              Remove
            </Button>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isLoading || (!symptoms.trim() && !selectedImage)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground medical-glow"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Get Diagnosis
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default SymptomInput;
