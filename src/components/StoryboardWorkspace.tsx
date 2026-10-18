import React, { useState } from 'react';
import { Storyboard, Shot, ShotType, CameraMovement, AspectRatio, CompositionGuide } from '../types/storyboard';
import { CinematicFrame } from './CinematicFrame';
import {
  ArrowLeft,
  Play,
  Share2,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Volume2,
  Camera,
  Layers,
  Sparkles,
  Sliders,
  Eye,
  Film,
  Music,
  Mic,
  MessageSquare,
  Wand2,
  Clock,
  Maximize2,
  Palette,
  CheckCircle2,
  Settings,
  FolderOpen
} from 'lucide-react';

interface StoryboardWorkspaceProps {
  storyboard: Storyboard;
  onUpdateStoryboard: (updated: Storyboard) => void;
  onBackToPrompt: () => void;
  onOpenAnimatic: () => void;
  onOpenExport: () => void;
}

const SHOT_TYPES: ShotType[] = [
  'Extreme Wide Shot',
  'Wide Shot',
  'Medium Shot',
  'Medium Close-Up',
  'Close-Up',
  'Extreme Close-Up',
  'Over-the-Shoulder',
  'Dutch Angle',
  'Low Angle',
  'High Angle',
  'POV',
  'Tracking Shot'
];

const CAMERA_MOVEMENTS: CameraMovement[] = [
  'Static',
  'Pan Left',
  'Pan Right',
  'Tilt Up',
  'Tilt Down',
  'Tracking / Dolly',
  'Crane / Jib',
  'Dolly Zoom',
  'Handheld',
  'Steadicam Push'
];

const COMPOSITION_GUIDES: CompositionGuide[] = [
  'rule-of-thirds',
  'center-framed',
  'diagonal-lead',
  'symmetric',
  'golden-spiral'
];

export const StoryboardWorkspace: React.FC<StoryboardWorkspaceProps> = ({
  storyboard,
  onUpdateStoryboard,
  onBackToPrompt,
  onOpenAnimatic,
  onOpenExport
}) => {
  const [selectedShotId, setSelectedShotId] = useState<string>(
    storyboard.shots[0]?.id || ''
  );
  const [showGuidesInInspector, setShowGuidesInInspector] = useState(true);
  const [isAiActionLoading, setIsAiActionLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const selectedShot =
    storyboard.shots.find((s) => s.id === selectedShotId) || storyboard.shots[0];

  // Helper to update a single shot
  const handleUpdateShot = (updatedShot: Shot) => {
    const newShots = storyboard.shots.map((s) =>
      s.id === updatedShot.id ? updatedShot : s
    );
    onUpdateStoryboard({
      ...storyboard,
      shots: newShots
    });
  };

  // Helper to reorder shots
  const handleMoveShot = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= storyboard.shots.length) return;

    const newShots = [...storyboard.shots];
    const [moved] = newShots.splice(index, 1);
    newShots.splice(targetIndex, 0, moved);

    // Re-number
    const renumbered = newShots.map((s, idx) => ({
      ...s,
      shotNumber: idx + 1
    }));

    onUpdateStoryboard({
      ...storyboard,
      shots: renumbered
    });
  };

  // Helper to delete a shot
  const handleDeleteShot = (shotId: string) => {
    if (storyboard.shots.length <= 1) return; // Keep at least one
    const newShots = storyboard.shots
      .filter((s) => s.id !== shotId)
      .map((s, idx) => ({ ...s, shotNumber: idx + 1 }));

    onUpdateStoryboard({
      ...storyboard,
      shots: newShots
    });

    if (selectedShotId === shotId) {
      setSelectedShotId(newShots[0]?.id || '');
    }
  };

  // Helper to duplicate shot
  const handleDuplicateShot = (shot: Shot, index: number) => {
    const duplicated: Shot = {
      ...shot,
      id: `shot-${Date.now()}`,
      sceneDescription: `${shot.sceneDescription} (Variation)`,
      shotNumber: index + 2
    };

    const newShots = [...storyboard.shots];
    newShots.splice(index + 1, 0, duplicated);

    const renumbered = newShots.map((s, idx) => ({
      ...s,
      shotNumber: idx + 1
    }));

    onUpdateStoryboard({
      ...storyboard,
      shots: renumbered
    });
    setSelectedShotId(duplicated.id);
  };

  // Helper to add a blank/new shot
  const handleAddShot = (afterIndex?: number) => {
    const insertIndex =
      afterIndex !== undefined ? afterIndex + 1 : storyboard.shots.length;
    const num = insertIndex + 1;

    const newShot: Shot = {
      id: `shot-${Date.now()}-${num}`,
      shotNumber: num,
      duration: 4,
      shotType: 'Medium Shot',
      cameraMovement: 'Static',
      lensAndSpecs: '35mm T1.8 Prime',
      lightingMood: 'Natural cinematic key light with soft shadow fill',
      sceneDescription: 'New scene beat: Subject performs key action.',
      characterAction: 'Character reacts to the situation.',
      dialogue: {
        speaker: 'CHARACTER',
        text: 'We have to move forward now.'
      },
      soundDesign: 'Ambient room tone and environmental foley',
      musicCue: 'Understated atmospheric score',
      directorNote: 'Keep framing clean and balanced.',
      visualColorTheme: storyboard.shots[0]?.visualColorTheme || {
        primary: '#090d16',
        secondary: '#00f0ff',
        accent: '#ff0055',
        mood: 'Cinematic'
      },
      compositionGuide: 'rule-of-thirds',
      silhouetteType: 'lone-figure'
    };

    const newShots = [...storyboard.shots];
    newShots.splice(insertIndex, 0, newShot);

    const renumbered = newShots.map((s, idx) => ({
      ...s,
      shotNumber: idx + 1
    }));

    onUpdateStoryboard({
      ...storyboard,
      shots: renumbered
    });
    setSelectedShotId(newShot.id);
  };

  // Handle AI Director Action (plot twist, add beat, etc.)
  const handleAiAction = async (action: 'plot-twist' | 'add-beat') => {
    setIsAiActionLoading(true);
    setAiMessage(null);
    try {
      const res = await fetch('/api/ai-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          currentStoryboard: storyboard,
          targetShotId: selectedShotId
        })
      });
      const data = await res.json();
      if (data.newShot) {
        const newShots = [...storyboard.shots, data.newShot].map((s, idx) => ({
          ...s,
          shotNumber: idx + 1
        }));
        onUpdateStoryboard({ ...storyboard, shots: newShots });
        setSelectedShotId(data.newShot.id);
        setAiMessage('New climax scene beat added by AI Director!');
      } else if (data.logline) {
        onUpdateStoryboard({ ...storyboard, logline: data.logline });
        setAiMessage('Plot twist injected into project logline!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiActionLoading(false);
      setTimeout(() => setAiMessage(null), 3500);
    }
  };

  // Play dialogue using speech synthesis
  const handleSpeakDialogue = (text?: string, speaker?: string) => {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${speaker ? speaker + ': ' : ''}${text}`);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Total runtime
  const totalSeconds = storyboard.shots.reduce((acc, s) => acc + s.duration, 0);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const runtimeDisplay = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
      {/* Top Studio Control Bar */}
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-6 py-3 z-30 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Prompt & Project info */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPrompt}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Return to the initial prompt screen to create a new storyboard"
            >
              <ArrowLeft className="h-4 w-4 text-amber-400" />
              <span>← New Prompt / Projects</span>
            </button>

            <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-zinc-100 tracking-wide line-clamp-1">
                  {storyboard.title}
                </h1>
                <span className="hidden sm:inline-flex rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                  {storyboard.genre}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden md:block line-clamp-1 max-w-md">
                {storyboard.logline}
              </p>
            </div>
          </div>

          {/* Right: Studio actions */}
          <div className="flex items-center gap-2">
            {/* Aspect Ratio Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
              <span className="text-[10px] font-mono text-zinc-400 px-1.5">Ratio:</span>
              {(['2.39:1', '16:9', '4:3', '9:16'] as AspectRatio[]).map((r) => (
                <button
                  key={r}
                  onClick={() => onUpdateStoryboard({ ...storyboard, aspectRatio: r })}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    storyboard.aspectRatio === r
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Quick runtime & shots summary badge */}
            <div className="hidden lg:flex items-center gap-2 font-mono text-xs bg-zinc-900/80 border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-300">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>{storyboard.shots.length} Shots</span>
              <span className="text-zinc-500">•</span>
              <span>{runtimeDisplay}</span>
            </div>

            {/* Play Animatic CTA */}
            <button
              onClick={onOpenAnimatic}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-3.5 py-1.5 text-xs font-bold text-zinc-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Play Animatic</span>
            </button>

            {/* Export Sheet */}
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* AI Action feedback message */}
        {aiMessage && (
          <div className="mt-2 py-1 px-3 rounded bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>{aiMessage}</span>
          </div>
        )}
      </header>

      {/* Main 3-Column Storyboard Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================= */}
        {/* COLUMN 1: Narrative & Beats Breakdown (Left Column)      */}
        {/* ========================================================= */}
        <aside className="w-64 lg:w-72 bg-zinc-950 border-r border-zinc-800/80 flex flex-col shrink-0 overflow-y-auto">
          {/* Column Header */}
          <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Column 1: Script & Beats
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                {storyboard.shots.length} Beats
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Narrative progression & timeline outline
            </p>
          </div>

          {/* Project Logline & Aesthetic Card */}
          <div className="p-3.5 border-b border-zinc-800/60 bg-zinc-900/20">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
              Story Premise
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed italic font-serif">
              "{storyboard.logline}"
            </p>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-zinc-400">
              <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-zinc-300 font-mono">
                {storyboard.visualStyle}
              </span>
            </div>
          </div>

          {/* Beat Sequence List (Click to select & jump) */}
          <div className="p-3.5 flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Shot Sequence
              </span>
              <button
                onClick={() => handleAddShot()}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Add Beat
              </button>
            </div>

            <div className="space-y-1.5">
              {storyboard.shots.map((shot, idx) => {
                const isSelected = shot.id === selectedShotId;
                return (
                  <div
                    key={shot.id}
                    onClick={() => setSelectedShotId(shot.id)}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer group flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm'
                        : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        #{shot.shotNumber < 10 ? `0${shot.shotNumber}` : shot.shotNumber}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate text-zinc-200">
                          {shot.shotType}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate">
                          {shot.cameraMovement} • {shot.duration}s
                        </div>
                      </div>
                    </div>

                    {/* Quick Reorder Buttons */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveShot(idx, 'up');
                        }}
                        disabled={idx === 0}
                        className="p-1 text-zinc-400 hover:text-zinc-100 disabled:opacity-20 cursor-pointer"
                        title="Move beat up"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveShot(idx, 'down');
                        }}
                        disabled={idx === storyboard.shots.length - 1}
                        className="p-1 text-zinc-400 hover:text-zinc-100 disabled:opacity-20 cursor-pointer"
                        title="Move beat down"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Director Toolbox in Column 1 */}
          <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-900/40 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI Director Tools
            </span>
            <button
              onClick={() => handleAiAction('plot-twist')}
              disabled={isAiActionLoading}
              className="w-full text-left p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-xs text-zinc-300 hover:text-amber-300 transition-all flex items-center justify-between cursor-pointer disabled:opacity-50"
            >
              <span>Inject Dramatic Plot Twist</span>
              <Wand2 className="h-3.5 w-3.5 text-amber-400" />
            </button>
            <button
              onClick={() => handleAiAction('add-beat')}
              disabled={isAiActionLoading}
              className="w-full text-left p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-sky-500/40 text-xs text-zinc-300 hover:text-sky-300 transition-all flex items-center justify-between cursor-pointer disabled:opacity-50"
            >
              <span>Generate Next Climax Beat</span>
              <Plus className="h-3.5 w-3.5 text-sky-400" />
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* COLUMN 2: Visual Storyboard Cards (Center Column)        */}
        {/* ========================================================= */}
        <main className="flex-1 bg-zinc-950 p-4 sm:p-6 overflow-y-auto">
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Film className="h-4 w-4" />
                Column 2: Visual Storyboard Cards
              </span>
              <p className="text-xs text-zinc-400 mt-0.5">
                Cinematic shot progression • Click any card to inspect and customize in Column 3
              </p>
            </div>
            <button
              onClick={() => handleAddShot()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-amber-400" />
              <span>Add Shot</span>
            </button>
          </div>

          {/* Cards List in Sequential Cinematic Flow */}
          <div className="space-y-6 max-w-3xl mx-auto pb-16">
            {storyboard.shots.map((shot, idx) => {
              const isSelected = shot.id === selectedShotId;
              return (
                <div key={shot.id} className="relative group/card">
                  {/* The Shot Card */}
                  <div
                    onClick={() => setSelectedShotId(shot.id)}
                    className={`rounded-2xl border transition-all cursor-pointer overflow-hidden shadow-xl ${
                      isSelected
                        ? 'border-amber-500/80 bg-zinc-900/90 ring-2 ring-amber-500/20 shadow-amber-500/10'
                        : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700'
                    }`}
                  >
                    {/* 1. Shot Title Header: Sits CLEARLY ABOVE the image with clear spacing */}
                    <div className="p-4 sm:p-5 pb-3 border-b border-zinc-800/60 bg-zinc-950/40">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            SHOT #{shot.shotNumber < 10 ? `0${shot.shotNumber}` : shot.shotNumber}
                          </span>
                          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                            {shot.shotType}
                          </h3>
                          <span className="text-zinc-600">•</span>
                          <span className="text-xs font-mono text-zinc-400">
                            {shot.duration}s duration
                          </span>
                        </div>

                        {/* Card quick actions */}
                        <div className="flex items-center gap-1 opacity-80 group-hover/card:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateShot(shot, idx);
                            }}
                            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                            title="Duplicate Shot"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteShot(shot.id);
                            }}
                            disabled={storyboard.shots.length <= 1}
                            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-20 cursor-pointer"
                            title="Delete Shot"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Camera motion and optics metadata bar */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
                        <span className="flex items-center gap-1 text-sky-400">
                          <Camera className="h-3 w-3" />
                          {shot.cameraMovement}
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span className="text-zinc-400">{shot.lensAndSpecs}</span>
                      </div>
                    </div>

                    {/* 2. Visual Frame Render: Sits below the title with clean spacing and no overlapping text */}
                    <div className="p-4 sm:p-5 bg-zinc-950/70 border-b border-zinc-800/80">
                      <CinematicFrame
                        shot={shot}
                        aspectRatio={storyboard.aspectRatio}
                        showGuides={isSelected}
                      />
                    </div>

                    {/* 3. Card Content & Director Metadata: Sits below the image with clean spacing */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      {/* Visual Scene Description */}
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                          Scene Visual Action
                        </span>
                        <p className="text-sm text-zinc-100 font-sans leading-relaxed">
                          {shot.sceneDescription}
                        </p>
                      </div>

                      {/* Character Action */}
                      {shot.characterAction && (
                        <div className="text-xs text-zinc-300 flex items-start gap-1.5 font-sans">
                          <span className="text-amber-400/80 font-mono text-[11px] uppercase tracking-wider shrink-0">
                            Action:
                          </span>
                          <span>{shot.characterAction}</span>
                        </div>
                      )}

                      {/* Screenplay Dialogue Bubble */}
                      {shot.dialogue && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 flex items-start justify-between gap-3 shadow-inner">
                          <div>
                            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                              {shot.dialogue.speaker}
                            </span>
                            <p className="text-xs text-zinc-200 font-serif italic">
                              "{shot.dialogue.text}"
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeakDialogue(shot.dialogue?.text, shot.dialogue?.speaker);
                            }}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer shrink-0"
                            title="Listen to Dialogue (Text-to-Speech)"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Sound & Music strip */}
                      <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 font-mono gap-2">
                        <div className="flex items-center gap-1.5 truncate max-w-sm">
                          <Music className="h-3 w-3 text-sky-400 shrink-0" />
                          <span className="truncate">SFX: {shot.soundDesign}</span>
                        </div>
                        <div className="text-zinc-500">
                          Score: {shot.musicCue}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inline Add Beat Divider between cards */}
                  <div className="py-2 flex items-center justify-center opacity-0 group-hover/card:opacity-100 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleAddShot(idx)}
                      className="px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-medium text-amber-400 hover:text-amber-300 shadow-md flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                    >
                      <Plus className="h-3 w-3" /> Insert Shot Here
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bottom Add Shot Bar */}
            <div className="text-center pt-4">
              <button
                onClick={() => handleAddShot()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-zinc-700 hover:border-amber-500 bg-zinc-900/30 hover:bg-zinc-900/80 text-xs font-bold text-zinc-300 hover:text-amber-300 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 text-amber-400" />
                <span>Add Shot #{storyboard.shots.length + 1} to Storyboard</span>
              </button>
            </div>
          </div>
        </main>

        {/* ========================================================= */}
        {/* COLUMN 3: Shot Inspector & Production Specs (Right Column)*/}
        {/* ========================================================= */}
        <aside className="w-80 lg:w-96 bg-zinc-950 border-l border-zinc-800/80 flex flex-col shrink-0 overflow-y-auto">
          {/* Column Header */}
          <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" />
              Column 3: Shot Inspector
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowGuidesInInspector(!showGuidesInInspector)}
                className={`p-1.5 rounded text-[10px] font-mono flex items-center gap-1 border transition-colors cursor-pointer ${
                  showGuidesInInspector
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
                title="Toggle composition guidelines"
              >
                <Eye className="h-3 w-3" />
                <span>Guides</span>
              </button>
            </div>
          </div>

          {selectedShot ? (
            <div className="p-4 space-y-5">
              {/* Active Shot Title Header: Sits cleanly ABOVE the image preview with clear spacing */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      SHOT #{selectedShot.shotNumber < 10 ? `0${selectedShot.shotNumber}` : selectedShot.shotNumber}
                    </span>
                    <h4 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                      {selectedShot.shotType}
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
                    {selectedShot.duration}s
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span className="text-sky-400 flex items-center gap-1">
                    <Camera className="h-3 w-3" />
                    {selectedShot.cameraMovement}
                  </span>
                  <span className="text-zinc-700">•</span>
                  <span className="truncate">{selectedShot.lensAndSpecs.split('•')[0].trim()}</span>
                </div>
              </div>

              {/* Active Shot Frame Preview: Sits cleanly BELOW the title header with clear spacing */}
              <div>
                <CinematicFrame
                  shot={selectedShot}
                  aspectRatio={storyboard.aspectRatio}
                  showGuides={showGuidesInInspector}
                  isInspecting={true}
                />
              </div>

              {/* Composition Guide Selector */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Composition Framing Guide
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {COMPOSITION_GUIDES.map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() =>
                        handleUpdateShot({ ...selectedShot, compositionGuide: comp })
                      }
                      className={`px-2 py-1.5 rounded text-[10px] font-mono border text-left transition-colors cursor-pointer ${
                        selectedShot.compositionGuide === comp
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shot Type & Camera Movement Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    Shot Framing
                  </label>
                  <select
                    value={selectedShot.shotType}
                    onChange={(e) =>
                      handleUpdateShot({
                        ...selectedShot,
                        shotType: e.target.value as ShotType
                      })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    {SHOT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    Camera Motion
                  </label>
                  <select
                    value={selectedShot.cameraMovement}
                    onChange={(e) =>
                      handleUpdateShot({
                        ...selectedShot,
                        cameraMovement: e.target.value as CameraMovement
                      })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    {CAMERA_MOVEMENTS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration and Lens Specs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    Duration (Seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={selectedShot.duration}
                    onChange={(e) =>
                      handleUpdateShot({
                        ...selectedShot,
                        duration: Math.max(1, parseInt(e.target.value, 10) || 1)
                      })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    Lens & Aperture
                  </label>
                  <input
                    type="text"
                    value={selectedShot.lensAndSpecs}
                    onChange={(e) =>
                      handleUpdateShot({
                        ...selectedShot,
                        lensAndSpecs: e.target.value
                      })
                    }
                    placeholder="35mm Anamorphic T1.5"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Visual Action Description */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Visual Scene Action
                </label>
                <textarea
                  rows={3}
                  value={selectedShot.sceneDescription}
                  onChange={(e) =>
                    handleUpdateShot({
                      ...selectedShot,
                      sceneDescription: e.target.value
                    })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Character Dialogue Editor */}
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" />
                    Dialogue Line
                  </span>
                  {selectedShot.dialogue?.text && (
                    <button
                      onClick={() =>
                        handleSpeakDialogue(
                          selectedShot.dialogue?.text,
                          selectedShot.dialogue?.speaker
                        )
                      }
                      className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="h-3 w-3" /> Test Voice
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Speaker Name (e.g. KIRA)"
                  value={selectedShot.dialogue?.speaker || ''}
                  onChange={(e) =>
                    handleUpdateShot({
                      ...selectedShot,
                      dialogue: {
                        speaker: e.target.value.toUpperCase(),
                        text: selectedShot.dialogue?.text || ''
                      }
                    })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs font-mono font-bold text-amber-300 focus:border-amber-500 focus:outline-none"
                />

                <textarea
                  rows={2}
                  placeholder="Spoken screenplay dialogue..."
                  value={selectedShot.dialogue?.text || ''}
                  onChange={(e) =>
                    handleUpdateShot({
                      ...selectedShot,
                      dialogue: {
                        speaker: selectedShot.dialogue?.speaker || 'CHARACTER',
                        text: e.target.value
                      }
                    })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Sound Design & Score notes */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Sound Design / SFX
                </label>
                <input
                  type="text"
                  value={selectedShot.soundDesign}
                  onChange={(e) =>
                    handleUpdateShot({
                      ...selectedShot,
                      soundDesign: e.target.value
                    })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Director's Note */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Director's Shooting Note
                </label>
                <textarea
                  rows={2}
                  value={selectedShot.directorNote}
                  onChange={(e) =>
                    handleUpdateShot({
                      ...selectedShot,
                      directorNote: e.target.value
                    })
                  }
                  placeholder="Lighting, pacing, or crew execution advice..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-zinc-400">
              Select a shot card from Column 2 to inspect specifications.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
