import React from 'react';
import type { SavedPlan } from '../types';

interface PlansListProps {
  plans: SavedPlan[];
  onClose: () => void;
  onView: (plan: SavedPlan) => void;
  onRemove: (planId: string) => void;
}

const PlanCard: React.FC<{ plan: SavedPlan; onView: () => void; onRemove: () => void; }> = ({ plan, onView, onRemove }) => (
    <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden animate-fade-in-up border border-zinc-700">
        <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-zinc-100 pr-4">{plan.name}</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Saved on {new Date(plan.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={onRemove}
                className="text-sm font-medium text-red-500 hover:text-red-400 flex-shrink-0"
              >
                Remove
              </button>
            </div>
            <p className="mt-2 text-zinc-300">
              A curated plan for {plan.formData.people} people near <span className="font-semibold">{plan.formData.location}</span>.
            </p>
        </div>
        <div className="px-5 py-3 bg-zinc-700/50 flex items-center justify-end">
             <button onClick={onView} className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                View Plan
             </button>
        </div>
    </div>
);


export const PlansListView: React.FC<PlansListProps> = ({ plans, onClose, onView, onRemove }) => {
  return (
    <div className="fixed inset-0 bg-zinc-900 z-50 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
                Your Saved Plans
            </h1>
            <button
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
                Close
            </button>
        </header>

        <main>
          {plans.length > 0 ? (
            <div className="space-y-6">
              {plans.map(plan => (
                <PlanCard 
                    key={plan.id} 
                    plan={plan} 
                    onView={() => onView(plan)} 
                    onRemove={() => onRemove(plan.id)} 
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-16 px-6 bg-zinc-800/50 rounded-lg shadow-sm border border-zinc-700">
                <h3 className="text-xl font-semibold text-zinc-100">No saved plans yet</h3>
                <p className="mt-2 text-zinc-400">After finding activities, click "Save Plan" to keep your trip here for later!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};