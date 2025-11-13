import type { SavedPlan } from '../types';

const PLAN_STORAGE_KEY = 'whatToDoPlans';

type NewPlanPayload = Omit<SavedPlan, 'id' | 'createdAt'>;

const getPlans = (): SavedPlan[] => {
  try {
    const plansJson = localStorage.getItem(PLAN_STORAGE_KEY);
    if (plansJson) {
      const plans = JSON.parse(plansJson) as SavedPlan[];
      // Sort by most recent first
      return plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (error) {
    console.error("Failed to parse plans from localStorage", error);
  }
  return [];
};

const savePlans = (plans: SavedPlan[]): void => {
  try {
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error("Failed to save plans to localStorage", error);
  }
};

const addPlan = (planData: NewPlanPayload): SavedPlan[] => {
  const plans = getPlans();
  const newPlan: SavedPlan = {
    ...planData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  const updatedPlans = [newPlan, ...plans];
  savePlans(updatedPlans);
  return updatedPlans;
};

const removePlan = (planId: string): SavedPlan[] => {
  const plans = getPlans();
  const updatedPlans = plans.filter(a => a.id !== planId);
  savePlans(updatedPlans);
  return updatedPlans;
};

export const planService = {
  getPlans,
  addPlan,
  removePlan,
};