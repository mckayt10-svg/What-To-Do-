import React from 'react';

interface HomeScreenProps {
  onStartNew: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartNew }) => {
  return (
    <div className="text-center p-8 animate-fade-in bg-zinc-800/50 rounded-xl shadow-lg border border-zinc-700">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-zinc-100">Ready for a new adventure?</h2>
        <p className="mt-2 text-zinc-400">
          Tell us what you're looking for, and we'll curate a personalized list of local activities just for you.
        </p>
        <div className="mt-8">
          <button
            onClick={onStartNew}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-transform hover:scale-105"
          >
            Start a New Adventure
          </button>
        </div>
      </div>
    </div>
  );
};