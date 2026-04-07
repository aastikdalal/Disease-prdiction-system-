import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, imageBase64 } = await req.json();
    
    if (!symptoms && !imageBase64) {
      throw new Error('Please provide symptoms or an image');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing medical diagnosis request...');

    const messages: any[] = [
      {
        role: 'system',
        content: `You are an advanced medical triage AI assistant for India. Analyze symptoms and medical images/reports to provide comprehensive medical guidance.

CRITICAL SAFETY RULES:
- IMMEDIATELY flag medical emergencies (chest pain, severe breathing difficulty, uncontrolled bleeding, loss of consciousness, severe trauma)
- For emergencies, set isEmergency: true and urgency: "immediate"
- This is TRIAGE and EDUCATIONAL guidance only - NOT a definitive diagnosis
- Always include clear disclaimers

RESPONSE FORMAT - You MUST respond with ONLY valid JSON in this exact structure:
{
  "diagnosis": "Primary suspected condition",
  "confidence": 90,
  "confidenceLevel": "high",
  "description": "Detailed clinical explanation",
  "language": "en",
  "isEmergency": false,
  "emergencyInstructions": null,
  "possibleCauses": ["Cause with clinical detail", "Cause 2", "Cause 3"],
  "recommendations": ["Evidence-based recommendation 1", "Recommendation 2", "Recommendation 3"],
  "homeRemedies": ["Safe home remedy 1 (with dosing if OTC)", "Remedy 2", "Remedy 3"],
  "redFlags": ["Warning sign 1", "When to seek immediate care", "Complications to watch"],
  "doctorVisit": {
    "recommended": true,
    "urgency": "medium",
    "estimatedConsultationFee": "₹500-1500",
    "estimatedTreatmentCost": "₹5000-50000",
    "specialists": ["General Physician", "Specialist 1"],
    "city": "Mumbai",
    "topDoctors": [
      {"name": "Dr. Sample", "hospital": "Hospital Name", "experience": "15 years", "rating": 4.8}
    ]
  },
  "relatedConditions": ["Related condition 1", "Related condition 2"],
  "alternativeDiagnoses": [
    {"condition": "Alternative 1", "confidence": 75, "notes": "Why this is possible"}
  ],
  "nextSteps": ["Get test X", "Monitor symptom Y", "Follow-up in Z days"],
  "disclaimer": "This is informational guidance and not a medical diagnosis. For emergencies, call local emergency services immediately. Always consult a qualified healthcare provider for diagnosis and treatment."
}

GUIDELINES:
- Confidence ≥90% = "high", 70-89% = "medium", <70% = "low"
- For confidence <90%, provide multiple probable conditions in alternativeDiagnoses
- Include city-specific doctor recommendations for India (use major cities if not specified)
- Estimate consultation fees: Government ₹50-300, Private ₹400-2000, Super-specialty ₹1000-5000
- Treatment costs: ranges based on condition severity (OPD vs hospitalization)
- Home remedies: Only safe, non-prescription options with clear instructions
- Red flags: Specific symptoms requiring immediate medical attention
- Auto-detect language from input and respond in same language
- For lab reports: extract values, compare to normal ranges, explain clinical significance

EMERGENCY DETECTION:
If ANY of these present, set isEmergency: true:
- Chest pain/pressure (cardiac emergency)
- Severe breathing difficulty
- Uncontrolled bleeding
- Loss of consciousness/altered mental status
- Severe head injury
- Signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty)
- Anaphylaxis symptoms
- Severe abdominal pain with fever
- High fever in infant <3 months

DO NOT include any text before or after the JSON. Only output valid JSON.`
      }
    ];

    // Build user message
    const userContent: any[] = [];
    
    if (symptoms) {
      userContent.push({
        type: 'text',
        text: `Patient symptoms: ${symptoms}\n\nPlease analyze these symptoms and provide a comprehensive medical assessment in the required JSON format.`
      });
    }

    if (imageBase64) {
      userContent.push({
        type: 'image_url',
        image_url: {
          url: imageBase64
        }
      });
      if (!symptoms) {
        userContent.unshift({
          type: 'text',
          text: 'Please analyze this medical image and provide a comprehensive assessment in the required JSON format.'
        });
      }
    }

    messages.push({
      role: 'user',
      content: userContent
    });

    console.log('Calling Lovable AI for diagnosis...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    const aiResponse = data.choices?.[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('Raw AI response:', aiResponse);

    // Parse the JSON response
    let result;
    try {
      // Try to extract JSON if there's extra text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse:', aiResponse);
      throw new Error('Invalid response format from AI');
    }

    console.log('Successfully parsed diagnosis:', result.diagnosis);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Diagnosis error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
