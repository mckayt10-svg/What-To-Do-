
import type { UserProfile, Activity } from '../types';

const PROFILE_STORAGE_KEY = 'localCuratorProfile';

const getProfile = (): UserProfile => {
  try {
    const profileJson = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (profileJson) {
      return JSON.parse(profileJson);
    }
  } catch (error) {
    console.error("Failed to parse user profile from localStorage", error);
  }
  return { savedActivities: [] };
};

const saveProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save user profile to localStorage", error);
  }
};

const getSavedActivities = (): Activity[] => {
  return getProfile().savedActivities;
};

const addActivity = (activity: Activity): Activity[] => {
  const profile = getProfile();
  // Avoid duplicates
  if (!profile.savedActivities.some(a => a.activityName === activity.activityName)) {
    const updatedProfile = {
      ...profile,
      savedActivities: [...profile.savedActivities, activity],
    };
    saveProfile(updatedProfile);
    return updatedProfile.savedActivities;
  }
  return profile.savedActivities;
};

const removeActivity = (activityName: string): Activity[] => {
  const profile = getProfile();
  const updatedProfile = {
    ...profile,
    savedActivities: profile.savedActivities.filter(a => a.activityName !== activityName),
  };
  saveProfile(updatedProfile);
  return updatedProfile.savedActivities;
};

export const profileService = {
  getSavedActivities,
  addActivity,
  removeActivity,
};
