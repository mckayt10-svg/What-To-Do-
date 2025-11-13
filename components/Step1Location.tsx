import React from 'react';
import type { FormData } from '../types';
import { CompassIcon } from './icons/CompassIcon';

interface Step1Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  isMetric: boolean;
}

export const Step1Location: React.FC<Step1Props> = ({ formData, setFormData, onNext, isMetric }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, distance: parseInt(e.target.value, 10) }));
  };
  
  const canProceed = formData.location.trim().length > 2;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Let's start with the basics</h2>
        <p className="text-zinc-400 mt-1">Where is your adventure beginning?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-zinc-300">
            Location
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <CompassIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="location"
              id="location"
              className="block w-full rounded-md border-zinc-600 bg-zinc-900/50 pl-10 pr-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              placeholder="Address, Zip Code, or City"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="distance" className="block text-sm font-medium text-zinc-300">
            Travel Distance ({formData.distance} {isMetric ? 'km' : 'miles'})
          </label>
          <input
            id="distance"
            type="range"
            min="1"
            max="100"
            value={formData.distance}
            onChange={handleSliderChange}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer mt-2 accent-cyan-500"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-cyan-800/50 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};