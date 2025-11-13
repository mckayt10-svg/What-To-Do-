import React from 'react';
import type { FormData, AgeRequirement } from '../types';

interface Step2Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: () => void;
  onBack: () => void;
}

export const Step2Group: React.FC<Step2Props> = ({ formData, setFormData, onSubmit, onBack }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value, 10) || 1);
    setFormData(prev => ({ ...prev, people: value }));
  };

  const handleAgeRequirement = (value: AgeRequirement) => {
    setFormData(prev => ({ ...prev, ageRequirement: value }));
  };

  const canProceed = formData.budget.trim() !== '' && formData.duration.trim() !== '';

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Tell us about your plans</h2>
        <p className="text-zinc-400 mt-1">A few more details to find the perfect match.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="people" className="block text-sm font-medium text-zinc-300">
              Number of People
            </label>
            <input
              type="number"
              name="people"
              id="people"
              min="1"
              value={formData.people}
              onChange={handleNumericInputChange}
              className="mt-1 block w-full rounded-md border-zinc-600 bg-zinc-900/50 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300">
              Age Requirement
            </label>
            <div className="mt-1 grid grid-cols-2 gap-2 rounded-md">
              <button
                type="button"
                onClick={() => handleAgeRequirement('under21')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${formData.ageRequirement === 'under21' ? 'bg-cyan-600 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border border-zinc-600'}`}
              >
                Includes Under 21
              </button>
              <button
                type="button"
                onClick={() => handleAgeRequirement('over21')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${formData.ageRequirement === 'over21' ? 'bg-cyan-600 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border border-zinc-600'}`}
              >
                All Over 21
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-zinc-300">
              Budget (Per Person)
            </label>
            <input
              type="text"
              name="budget"
              id="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="$50, £100, Free, etc."
              className="mt-1 block w-full rounded-md border-zinc-600 bg-zinc-900/50 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
           <div>
            <label htmlFor="duration" className="block text-sm font-medium text-zinc-300">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              id="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 2-4 hours, All day"
              className="mt-1 block w-full rounded-md border-zinc-600 bg-zinc-900/50 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="includeRestaurants"
              name="includeRestaurants"
              type="checkbox"
              checked={formData.includeRestaurants}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-zinc-500 bg-zinc-700 text-cyan-600 focus:ring-cyan-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="includeRestaurants" className="font-medium text-zinc-300">
              Include Restaurants?
            </label>
            <p className="text-zinc-400">Factor restaurants into the search results.</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center px-6 py-2 border border-zinc-600 text-base font-medium rounded-md shadow-sm text-zinc-300 bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!canProceed}
          className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-cyan-800/50 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors"
        >
          Find Activities
        </button>
      </div>
    </div>
  );
};