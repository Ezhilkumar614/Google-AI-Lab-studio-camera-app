import React, { useState, useEffect, useRef } from 'react';
import { Storyboard, Shot } from '../types/storyboard';
import { CinematicFrame } from './CinematicFrame';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Camera
} from 'lucide-react';

interface AnimaticModalProps {
  storyboard: Storyboard;
  onClose: () => void;
}

export const AnimaticModal: React.FC<AnimaticModalProps> = ({ storyboard, onClose }) => {
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [shotSecondsElapsed, setShotSecondsElapsed] = useState(0);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const shots = storyboard.shots;
  const currentShot = shots[currentShotIndex] || shots[0];

  // Total runtime calculation
  const totalSeconds = shots.reduce((acc, s) => acc + s.duration, 0);
  const currentOverallSeconds =
    shots.slice(0, currentShotIndex).reduce((acc, s) => acc + s.duration, 0) + shotSecondsElapsed;

  // Speak dialogue when shot transitions if TTS is enabled
  useEffect(() => {
    if (!ttsEnabled || !currentShot?.dialogue?.text) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `${currentShot.dialogue.speaker}: ${currentShot.dialogue.text}`
      );
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentShotIndex, ttsEnabled]);

  // Main playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setShotSecondsElapsed((prev) => {
        if (prev + 1 >= currentShot.duration) {
          // Move to next shot
          if (currentShotIndex + 1 < shots.length) {
            setCurrentShotIndex(currentShotIndex + 1);
            return 0;
          } else {
            // Loop back to start or pause
            setIsPlaying(false);
            return currentShot.duration;
          }
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentShotIndex, currentShot.duration, shots.length]);

  const handleNext = () => {
    if (currentShotIndex + 1 < shots.length) {
      setCurrentShotIndex(currentShotIndex + 1);
      setShotSecondsElapsed(0);
    }
  };

  const handlePrev = () => {
    if (currentShotIndex > 0) {
      setCurrentShotIndex(currentShotIndex - 1);
      setShotSecondsElapsed(0);
    }
  };

  const handleRestart = () => {
    setCurrentShotIndex(0);
    setShotSecondsElapsed(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                Animatic Playback Preview: {storyboard.title}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                SHOT {currentShotIndex + 1} OF {shots.length} • {storyboard.aspectRatio} • {storyboard.genre}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                ttsEnabled
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
              title={ttsEnabled ? 'Dialogue voice read enabled' : 'Dialogue voice read muted'}
            >
              {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span className="hidden sm:inline">Voice Synthesizer</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cinematic Screen Center */}
        <div className="relative bg-black p-4 sm:p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl space-y-3">
            {/* Title & Recording Specs: Sits cleanly ABOVE the image with clear spacing */}
            <div className="flex items-center justify-between px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-zinc-900 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  REC ● 00:{currentOverallSeconds < 10 ? `0${currentOverallSeconds}` : currentOverallSeconds} / 00:{totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds}
                </span>
                <span className="font-mono text-xs text-zinc-300 font-bold uppercase">
                  SHOT #{currentShot.shotNumber}: {currentShot.shotType}
                </span>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-900 text-sky-400 border border-sky-500/30">
                {currentShot.cameraMovement}
              </span>
            </div>

            {/* Visual Frame Render (No text overlapping the image!) */}
            <div className="relative rounded-lg overflow-hidden ring-1 ring-zinc-800">
              <CinematicFrame
                shot={currentShot}
                aspectRatio={storyboard.aspectRatio}
                showGuides={false}
                className="w-full shadow-2xl"
              />
            </div>

            {/* Screenplay Subtitles: Sits cleanly BELOW the image with clear spacing */}
            {currentShot.dialogue && (
              <div className="text-center bg-zinc-900/90 backdrop-blur-md px-5 py-3 rounded-xl border border-zinc-800 max-w-2xl mx-auto shadow-xl">
                <div className="text-amber-400 text-xs font-bold tracking-wider font-mono uppercase mb-1">
                  {currentShot.dialogue.speaker}
                </div>
                <div className="text-zinc-100 text-sm sm:text-base font-medium italic font-serif">
                  "{currentShot.dialogue.text}"
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shot Description & Production Notes */}
        <div className="px-6 py-4 bg-zinc-950/80 border-t border-zinc-800/80 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px] block mb-1">
                Visual Scene Action
              </span>
              <p className="text-zinc-200 leading-relaxed font-sans">{currentShot.sceneDescription}</p>
            </div>
            <div>
              <span className="font-semibold text-amber-400/90 uppercase tracking-wider text-[10px] block mb-1">
                Sound Design & Score Cue
              </span>
              <p className="text-zinc-300 font-mono text-[11px] leading-relaxed">
                SFX: {currentShot.soundDesign}
                <br />
                Score: {currentShot.musicCue}
              </p>
            </div>
          </div>
        </div>

        {/* Playback Controls & Scrubber */}
        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex flex-col gap-3">
          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-400 min-w-[36px]">
              00:{currentOverallSeconds < 10 ? `0${currentOverallSeconds}` : currentOverallSeconds}
            </span>
            <div className="relative flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                style={{ width: `${(currentOverallSeconds / totalSeconds) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs text-zinc-400 min-w-[36px]">
              00:{totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds}
            </span>
          </div>

          {/* Buttons row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentShotIndex === 0}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-200 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 font-bold text-zinc-950 text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={handleNext}
                disabled={currentShotIndex >= shots.length - 1}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-200 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Restart from Beginning"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Shot jump timeline pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {shots.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentShotIndex(idx);
                    setShotSecondsElapsed(0);
                  }}
                  className={`h-7 px-2.5 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    idx === currentShotIndex
                      ? 'bg-amber-500 text-zinc-950 ring-2 ring-amber-400/50'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                  }`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
