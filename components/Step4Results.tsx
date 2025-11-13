import React, { useState } from 'react';
import type { Activity, CategorizedActivities, FormData } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface Step4Props {
  results: CategorizedActivities;
  savedActivities: Activity[];
  formData: FormData;
  onRefine: (query: string) => void;
  onNewSearch: () => void;
  onEditSearch: () => void;
  onSavePlan: (name: string) => void;
  onToggleSave: (activity: Activity) => void;
  isLoading: boolean;
}

const ActivityCard: React.FC<{ activity: Activity; isSaved: boolean; onToggleSave: (activity: Activity) => void; }> = ({ activity, isSaved, onToggleSave }) => (
    <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] animate-fade-in-up relative border border-zinc-700">
        <div className="p-5">
            <h3 className="text-xl font-bold text-zinc-100 pr-10">{activity.activityName}</h3>
            <p className="mt-2 text-zinc-300">{activity.description}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-400">
                <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
                    {activity.costPerPerson}
                </span>
                <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {activity.durationEstimate}
                </span>
            </div>
        </div>
        <button 
            onClick={() => onToggleSave(activity)}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-700/50 hover:bg-zinc-600 transition-colors"
            aria-label={isSaved ? 'Unsave activity' : 'Save activity'}
        >
            <HeartIcon className={`w-6 h-6 ${isSaved ? 'text-red-500' : 'text-zinc-400'}`} filled={isSaved} />
        </button>
        <div className="px-5 py-3 bg-zinc-700/50 flex items-center justify-end space-x-4">
             <a href={activity.websiteLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Website</a>
             <a href={activity.mapsLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Directions</a>
        </div>
    </div>
);

const RefinementChatbot: React.FC<{ onRefine: (query: string) => void; isLoading: boolean }> = ({ onRefine, isLoading }) => {
    const [query, setQuery] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onRefine(query);
            setQuery('');
        }
    };

    return (
        <div className="sticky bottom-0 bg-zinc-900/80 backdrop-blur-sm p-4 mt-8 rounded-t-lg shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
             <p className="text-center text-sm font-medium text-zinc-300 mb-2">Too many options? Let's narrow it down.</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., 'Something indoors' or 'only cultural activities'"
                    className="flex-grow block w-full rounded-md border-zinc-600 bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-cyan-800/50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Refining...' : 'Refine'}
                </button>
            </form>
        </div>
    );
};


export const Step4Results: React.FC<Step4Props> = ({ results, savedActivities, formData, onRefine, onNewSearch, onEditSearch, onSavePlan, onToggleSave, isLoading }) => {
  const categories = Object.keys(results);
  const [activeCategory, setActiveCategory] = useState(categories[0] || null);
  const [isSaving, setIsSaving] = useState(false);
  const [planName, setPlanName] = useState('');

  const isSaved = (activityName: string) => savedActivities.some(a => a.activityName === activityName);

  const handleInitiateSave = () => {
    setPlanName(`Plan for ${formData.location}`);
    setIsSaving(true);
  };

  const handleConfirmSave = () => {
    onSavePlan(planName);
    setIsSaving(false);
  };
  
  const handleCancelSave = () => {
    setIsSaving(false);
    setPlanName('');
  };

  return (
    <div className="animate-fade-in w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-zinc-100">Your Curated Activities</h2>
      </div>
       <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-6">
          <button onClick={onEditSearch} className="px-4 py-2 text-sm font-medium rounded-md text-zinc-200 bg-zinc-700 border border-zinc-600 hover:bg-zinc-600 transition-colors w-full sm:w-auto">Edit Search</button>
          
          {!isSaving ? (
            <button onClick={handleInitiateSave} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 transition-colors w-full sm:w-auto">Save Plan</button>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-md bg-zinc-700/50 border border-zinc-600 w-full sm:w-auto">
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="flex-grow rounded-md border-zinc-500 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full"
                placeholder="Enter plan name"
                autoFocus
              />
              <button onClick={handleConfirmSave} className="px-3 py-1.5 text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 transition-colors flex-shrink-0">Save</button>
              <button onClick={handleCancelSave} className="px-3 py-1.5 text-sm font-medium rounded-md text-zinc-300 bg-zinc-600 hover:bg-zinc-500 transition-colors flex-shrink-0">Cancel</button>
            </div>
          )}

          <button onClick={onNewSearch} className="px-4 py-2 text-sm font-medium rounded-md text-cyan-400 hover:bg-cyan-900/50 transition-colors w-full sm:w-auto">New Search</button>
        </div>

      {categories.length > 0 ? (
        <>
          <div className="border-b border-zinc-700 mb-6">
            <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`${
                    activeCategory === category
                      ? 'border-cyan-500 text-cyan-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
                  } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                >
                  {category} ({results[category].length})
                </button>
              ))}
            </nav>
          </div>
          <div className="space-y-6">
              {activeCategory && results[activeCategory]?.map((activity, index) => (
                  <ActivityCard key={`${activeCategory}-${index}`} activity={activity} isSaved={isSaved(activity.activityName)} onToggleSave={onToggleSave} />
              ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 px-6 bg-zinc-800 rounded-lg shadow-sm border border-zinc-700">
            <h3 className="text-xl font-semibold text-zinc-100">No activities found</h3>
            <p className="mt-2 text-zinc-400">We couldn't find any activities matching your criteria. Try adjusting your search.</p>
        </div>
      )}
      
      {categories.length > 0 && <RefinementChatbot onRefine={onRefine} isLoading={isLoading} />}
    </div>
  );
};