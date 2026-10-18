import React, { useState, useEffect } from 'react';
import { Storyboard, AspectRatio } from './types/storyboard';
import { SAMPLE_STORYBOARDS } from './data/presetStoryboards';
import { PromptScreen } from './components/PromptScreen';
import { StoryboardWorkspace } from './components/StoryboardWorkspace';
import { AnimaticModal } from './components/AnimaticModal';
import { ExportModal } from './components/ExportModal';

const STORAGE_KEY = 'cineboard_saved_storyboards';
const CURRENT_BOARD_KEY = 'cineboard_active_board_id';

export default function App() {
  // Screen state: 'prompt' (Home screen prompt box) -> 'workspace' (Three-column storyboard)
  const [currentView, setCurrentView] = useState<'prompt' | 'workspace'>('prompt');
  const [activeStoryboard, setActiveStoryboard] = useState<Storyboard | null>(null);
  const [savedStoryboards, setSavedStoryboards] = useState<Storyboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimatic, setShowAnimatic] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Initialize saved storyboards from localStorage or defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedStoryboards(parsed);
          return;
        }
      }
      // Default to sample storyboards if empty
      setSavedStoryboards(SAMPLE_STORYBOARDS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_STORYBOARDS));
    } catch (e) {
      console.warn('Storage read failed', e);
      setSavedStoryboards(SAMPLE_STORYBOARDS);
    }
  }, []);

  // Save changes to localStorage
  const saveStoryboardToStorage = (updatedBoard: Storyboard) => {
    setSavedStoryboards((prev) => {
      const existingIdx = prev.findIndex((b) => b.id === updatedBoard.id);
      let updatedList: Storyboard[];
      if (existingIdx >= 0) {
        updatedList = [...prev];
        updatedList[existingIdx] = updatedBoard;
      } else {
        updatedList = [updatedBoard, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {
        console.warn('Failed to save to localStorage', e);
      }
      return updatedList;
    });
  };

  // Delete saved storyboard
  const handleDeleteSaved = (id: string) => {
    setSavedStoryboards((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.warn('Failed to update storage', e);
      }
      return filtered;
    });
  };

  // Handle generation from PromptScreen (Screen 1) -> moves to Workspace (Screen 2)
  const handleGenerate = async (params: {
    prompt: string;
    genre: string;
    visualStyle: string;
    aspectRatio: AspectRatio;
    shotCount: number;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error(`Generation failed: ${res.statusText}`);
      }

      const generated: Storyboard = await res.json();
      setActiveStoryboard(generated);
      saveStoryboardToStorage(generated);

      // Move view from Prompt screen to the 3-column Storyboard Workspace!
      setCurrentView('workspace');
    } catch (err) {
      console.error('Error during generation:', err);
      // Fallback: pick first sample or clone with user prompt
      const fallback = {
        ...SAMPLE_STORYBOARDS[0],
        id: `sb-${Date.now()}`,
        prompt: params.prompt,
        genre: params.genre,
        visualStyle: params.visualStyle,
        aspectRatio: params.aspectRatio,
      };
      setActiveStoryboard(fallback);
      saveStoryboardToStorage(fallback);
      setCurrentView('workspace');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle picking an existing or preset storyboard -> moves to Workspace
  const handleSelectExisting = (storyboard: Storyboard) => {
    setActiveStoryboard(storyboard);
    setCurrentView('workspace');
  };

  // Handle updates made inside the 3-column workspace
  const handleUpdateStoryboard = (updated: Storyboard) => {
    setActiveStoryboard(updated);
    saveStoryboardToStorage(updated);
  };

  return (
    <div className="w-full h-full bg-zinc-950 min-h-screen text-zinc-100 font-sans">
      {/* SCREEN 1: Prompt Box Screen */}
      {currentView === 'prompt' && (
        <PromptScreen
          onGenerate={handleGenerate}
          onSelectExisting={handleSelectExisting}
          savedStoryboards={savedStoryboards}
          onDeleteSaved={handleDeleteSaved}
          isLoading={isLoading}
        />
      )}

      {/* SCREEN 2: Three-Column Storyboard Workspace */}
      {currentView === 'workspace' && activeStoryboard && (
        <StoryboardWorkspace
          storyboard={activeStoryboard}
          onUpdateStoryboard={handleUpdateStoryboard}
          onBackToPrompt={() => setCurrentView('prompt')}
          onOpenAnimatic={() => setShowAnimatic(true)}
          onOpenExport={() => setShowExport(true)}
        />
      )}

      {/* Animatic Modal Preview */}
      {showAnimatic && activeStoryboard && (
        <AnimaticModal
          storyboard={activeStoryboard}
          onClose={() => setShowAnimatic(false)}
        />
      )}

      {/* Export / Print Modal */}
      {showExport && activeStoryboard && (
        <ExportModal
          storyboard={activeStoryboard}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
