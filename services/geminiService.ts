
import { GoogleGenAI } from "@google/genai";
import type { FormData, GeminiServiceResponse, GroundingChunk, CategorizedActivities, Activity } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const findActivities = async (
  formData: FormData,
  isMetric: boolean,
  refinementQuery?: string
): Promise<GeminiServiceResponse> => {
  const prompt = `
    You are "What To Do?", an expert AI assistant for finding personalized activities. Based on the following criteria, find and return a large, diverse list of suitable local activities. Use Google Search and Google Maps to find up-to-date and relevant information.

    **Goal:** Provide as many high-quality, relevant results as possible (aim for 15-20+ if available).

    **Criteria:**
    - Location: ${formData.location}
    - Maximum Travel Distance: ${formData.distance} ${isMetric ? 'km' : 'miles'}
    - Number of People: ${formData.people}
    - Age Group: ${formData.ageRequirement === 'over21' ? 'All attendees must be over 21' : 'Activities suitable for all ages, including those under 21'}
    - Budget per Person: Approximately ${formData.budget}
    - Desired Duration: ${formData.duration}
    - Include Restaurants in suggestions: ${formData.includeRestaurants ? 'Yes' : 'No'}

    **Refinement:**
    ${refinementQuery || 'No additional refinement.'}

    **Output Format:**
    Return your findings strictly as a single JSON array of activity objects. Do not include any explanatory text or markdown formatting like \`\`\`json.
    Each object in the array represents a single activity and must have the following properties:
    - "activityName": string (The name of the activity or venue.)
    - "costPerPerson": string (An estimated cost per person, e.g., "$20-30" or "Free".)
    - "durationEstimate": string (An estimated time to complete the activity, e.g., "1-2 hours".)
    - "websiteLink": string (A direct URL to the official website or listing for the activity.)
    - "mapsLink": string (A direct Google Maps URL for the location.)
    - "description": string (A brief, engaging summary of the activity or venue.)
    - "category": string (A relevant category for the activity, e.g., "Outdoor Adventures", "Food & Dining", "Arts & Culture".)

    Example structure:
    [
      { "activityName": "City Park Hike", "costPerPerson": "$0", "durationEstimate": "2-3 hours", "websiteLink": "https://example.com/park", "mapsLink": "https://maps.google.com/...", "description": "A beautiful hike with scenic views.", "category": "Outdoor Adventures" },
      { "activityName": "Local Taco Tour", "costPerPerson": "$40", "durationEstimate": "3 hours", "websiteLink": "https://example.com/tacos", "mapsLink": "https://maps.google.com/...", "description": "Explore the best tacos in the city.", "category": "Food & Dining" }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      },
    });

    let responseText = response.text;
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      responseText = jsonMatch[1];
    }

    const rawActivities: Activity[] = JSON.parse(responseText);
    const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Group flat array into the categorized object the application expects
    const categorizedActivities = rawActivities.reduce((acc, activity) => {
      const category = activity.category || 'Miscellaneous';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(activity);
      return acc;
    }, {} as CategorizedActivities);

    return { activities: categorizedActivities, groundingChunks };
  } catch (error) {
    console.error("Error fetching activities from Gemini API:", error);
    throw new Error("Failed to curate activities. The model may have returned an invalid response. Please try adjusting your criteria.");
  }
};
