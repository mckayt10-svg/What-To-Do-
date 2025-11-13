import React, { useState, useEffect, useCallback } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { Step1Location } from './components/Step1Location';
import { Step2Group } from './components/Step2Group';
import { Step3Loading } from './components/Step3Loading';
import { Step4Results } from './components/Step4Results';
import { UserProfileView } from './components/UserProfile';
import { PlansListView } from './components/AdventuresListView';
import { findActivities } from './services/geminiService';
import { profileService } from './services/profileService';
import { planService } from './services/adventureService';
import type { FormData, Activity, GroundingChunk, CategorizedActivities, SavedPlan } from './types';
import { DEFAULT_FORM_DATA } from './constants';
import { BookmarkIcon } from './components/icons/BookmarkIcon';
import { MapIcon } from './components/icons/MapIcon';

type View = 'home' | 'form' | 'loading' | 'results' | 'profile' | 'plansList';

const ProgressBar: React.FC<{ step: number }> = ({ step }) => {
    const progress = step === 1 ? 0 : 50;
    return (
        <div className="w-full bg-zinc-700 rounded-full h-2 mb-8">
            <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}>
            </div>
        </div>
    );
};

function App() {
    const [view, setView] = useState<View>('home');
    const [previousView, setPreviousView] = useState<View>('home');
    const [formStep, setFormStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
    const [isMetric, setIsMetric] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<CategorizedActivities>({});
    const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
    
    // For individual liked activities
    const [savedActivities, setSavedActivities] = useState<Activity[]>([]);
    // For entire saved searches
    const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);

    useEffect(() => {
        setSavedActivities(profileService.getSavedActivities());
        setSavedPlans(planService.getPlans());
    }, []);

    useEffect(() => {
        const usZipRegex = /\b\d{5}\b/;
        const usStateRegex = /,\s*(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\s*$/i;
        if (usZipRegex.test(formData.location) || usStateRegex.test(formData.location)) {
            setIsMetric(false);
        } else {
            setIsMetric(true);
        }
    }, [formData.location]);
    
    const handleFormSubmit = useCallback(async (refinementQuery?: string) => {
      setIsLoading(true);
      setError(null);
      if (!refinementQuery) {
        setView('loading');
        setResults({});
        setGroundingChunks([]);
      }
      
      try {
        const response = await findActivities(formData, isMetric, refinementQuery);
        setResults(response.activities);
        setGroundingChunks(response.groundingChunks);
        setView('results');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        setFormStep(2);
        setView('form');
      } finally {
        setIsLoading(false);
      }
    }, [formData, isMetric]);

    const handleStartNew = () => {
        setFormData(DEFAULT_FORM_DATA);
        setResults({});
        setGroundingChunks([]);
        setError(null);
        setFormStep(1);
        setView('form');
    };
    
    const handleToggleSaveActivity = (activity: Activity) => {
        const isSaved = savedActivities.some(a => a.activityName === activity.activityName);
        const updatedActivities = isSaved 
            ? profileService.removeActivity(activity.activityName)
            : profileService.addActivity(activity);
        setSavedActivities(updatedActivities);
    };

    const handleSavePlan = (name: string) => {
      if (name && name.trim()) {
        const planData = { name: name.trim(), formData, results, groundingChunks };
        const updatedPlans = planService.addPlan(planData);
        setSavedPlans(updatedPlans);
        alert(`Plan "${name.trim()}" saved successfully!`);
      } else {
        alert("Please enter a valid name for your plan.");
      }
    };
    
    const handleViewPlan = (plan: SavedPlan) => {
        setFormData(plan.formData);
        setResults(plan.results);
        setGroundingChunks(plan.groundingChunks);
        setView('results');
    };

    const handleRemovePlan = (planId: string) => {
        const updatedPlans = planService.removePlan(planId);
        setSavedPlans(updatedPlans);
    };

    const showOverlay = (overlayView: 'profile' | 'plansList') => {
        if (view !== 'profile' && view !== 'plansList') {
            setPreviousView(view);
        }
        setView(overlayView);
    };

    const hideOverlay = () => {
        setView(previousView);
    };


    const renderContent = () => {
        switch (view) {
            case 'home':
                return <HomeScreen onStartNew={handleStartNew} />;
            case 'form':
                return (
                  <div className="bg-zinc-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-zinc-700">
                      <ProgressBar step={formStep} />
                      {error && (
                        <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded" role="alert">
                            <p className="font-bold">Oops!</p>
                            <p>{error}</p>
                        </div>
                      )}
                      {formStep === 1 ? (
                          <Step1Location 
                            formData={formData} 
                            setFormData={setFormData} 
                            onNext={() => setFormStep(2)}
                            isMetric={isMetric}
                         />
                      ) : (
                          <Step2Group 
                            formData={formData} 
                            setFormData={setFormData} 
                            onSubmit={() => handleFormSubmit()} 
                            onBack={() => setFormStep(1)} 
                         />
                      )}
                  </div>
                );
            case 'loading':
                 return (
                    <div className="bg-zinc-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-zinc-700">
                      <Step3Loading />
                    </div>
                  );
            case 'results':
                return (
                  <div className="bg-zinc-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-zinc-700">
                    <Step4Results 
                      results={results}
                      savedActivities={savedActivities}
                      formData={formData}
                      onRefine={(query) => handleFormSubmit(query)}
                      onNewSearch={handleStartNew}
                      onEditSearch={() => { setFormStep(1); setView('form'); }}
                      onSavePlan={handleSavePlan}
                      onToggleSave={handleToggleSaveActivity}
                      isLoading={isLoading}
                    />
                  </div>
                );
            case 'profile':
                return <UserProfileView 
                  savedActivities={savedActivities}
                  onClose={hideOverlay}
                  onRemove={handleToggleSaveActivity}
                />
            case 'plansList':
                return <PlansListView
                    plans={savedPlans}
                    onClose={hideOverlay}
                    onView={handleViewPlan}
                    onRemove={handleRemovePlan}
                />
            default:
                return null;
        }
    };

    if (view === 'profile' || view === 'plansList') {
        return renderContent();
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-4 font-sans">
            <div className="w-full max-w-2xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="text-left">
                        <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight cursor-pointer" onClick={() => setView('home')}>
                            What <span className="text-cyan-400">To Do?</span>
                        </h1>
                        <p className="mt-1 text-lg text-zinc-400">Your personal guide to local activities.</p>
                    </div>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={() => showOverlay('plansList')}
                            className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            aria-label="View saved plans"
                          >
                           <MapIcon className="h-5 w-5 sm:mr-2" /> <span className="hidden sm:inline">My Plans ({savedPlans.length})</span>
                        </button>
                        <button
                            onClick={() => showOverlay('profile')}
                            className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            aria-label="View saved activities"
                          >
                           <BookmarkIcon className="h-5 w-5 sm:mr-2" /> <span className="hidden sm:inline">Saved ({savedActivities.length})</span>
                        </button>
                     </div>
                </header>
                <main>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default App;