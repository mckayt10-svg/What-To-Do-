import React from 'react';
import type { Activity } from '../types';

interface UserProfileProps {
  savedActivities: Activity[];
  onClose: () => void;
  onRemove: (activity: Activity) => void;
}

const SavedActivityCard: React.FC<{ activity: Activity; onRemove: (activity: Activity) => void }> = ({ activity, onRemove }) => (
    <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden animate-fade-in-up border border-zinc-700">
        <div className="p-5">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-zinc-100 pr-4">{activity.activityName}</h3>
              <button
                onClick={() => onRemove(activity)}
                className="text-sm font-medium text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{activity.category}</p>
            <p className="mt-2 text-zinc-300">{activity.description}</p>
        </div>
        <div className="px-5 py-3 bg-zinc-700/50 flex items-center justify-end space-x-4">
             <a href={activity.websiteLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Website</a>
             <a href={activity.mapsLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Directions</a>
        </div>
    </div>
);


export const UserProfileView: React.FC<UserProfileProps> = ({ savedActivities, onClose, onRemove }) => {
  return (
    <div className="fixed inset-0 bg-zinc-900 z-50 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
                Your Saved Activities
            </h1>
            <button
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
                Close
            </button>
        </header>

        <main>
          {savedActivities.length > 0 ? (
            <div className="space-y-6">
              {savedActivities.map(activity => (
                <SavedActivityCard key={activity.activityName} activity={activity} onRemove={onRemove} />
              ))}
            </div>
          ) : (
             <div className="text-center py-16 px-6 bg-zinc-800/50 rounded-lg shadow-sm border border-zinc-700">
                <h3 className="text-xl font-semibold text-zinc-100">No saved activities yet</h3>
                <p className="mt-2 text-zinc-400">Go find some activities and click the heart icon to save them for later!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};