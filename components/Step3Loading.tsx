import React, { useState, useEffect } from 'react';

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin h-12 w-12 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const loadingMessages = [
    "Analyzing your location...",
    "Searching for hidden gems...",
    "Checking local maps and guides...",
    "Filtering by your preferences...",
    "Considering the perfect vibe...",
    "Categorizing activities...",
    "Putting the final touches on your plan...",
];

export const Step3Loading: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 3000);

        const timerInterval = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
        }, 1000);

        return () => {
            clearInterval(messageInterval);
            clearInterval(timerInterval);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in transition-all duration-500">
            <LoadingSpinner />
            <h2 className="mt-6 text-2xl font-bold text-zinc-100">Curating your day...</h2>
            <p className="mt-2 text-cyan-400 h-6">{loadingMessages[messageIndex]}</p>
            <p className="mt-4 text-xs text-zinc-500">
              This can take up to 30 seconds.
              <br/>
              Elapsed time: {elapsedTime}s
            </p>
        </div>
    );
};