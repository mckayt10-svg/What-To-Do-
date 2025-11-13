export type AgeRequirement = 'over21' | 'under21';

export interface FormData {
  location: string;
  distance: number;
  people: number;
  ageRequirement: AgeRequirement;
  budget: string;
  duration: string;
  includeRestaurants: boolean;
}

export interface Activity {
  activityName: string;
  costPerPerson: string;
  durationEstimate: string;
  websiteLink: string;
  mapsLink: string;
  description: string;
  category: string;
}

// Represents the new structure from the Gemini API: { "CategoryName": [Activity, ...], ... }
export type CategorizedActivities = Record<string, Activity[]>;

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri?: string;
    title?: string;
  };
}

export interface GeminiServiceResponse {
  activities: CategorizedActivities;
  groundingChunks: GroundingChunk[];
}

export interface UserProfile {
    savedActivities: Activity[];
}

export interface SavedPlan {
  id: string;
  name: string;
  formData: FormData;
  results: CategorizedActivities;
  groundingChunks: GroundingChunk[];
  createdAt: string;
}