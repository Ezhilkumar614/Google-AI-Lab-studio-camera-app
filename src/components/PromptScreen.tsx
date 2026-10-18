import React, { useState } from 'react';
import { AspectRatio, Storyboard } from '../types/storyboard';
import { PRESET_IDEAS, SAMPLE_STORYBOARDS } from '../data/presetStoryboards';
import {
  Clapperboard,
  Sparkles,
  Film,
  Camera,
  Layers,
  Wand2,
  Clock,
  ArrowRight,
  FolderOpen,
  Trash2,
  Tv,
  Monitor,
  Smartphone,
  ChevronRight,
  Play
} from 'lucide-react';

interface PromptScreenProps {
  onGenerate: (params: {
    prompt: string;
    genre: string;
    visualStyle: string;
    aspectRatio: AspectRatio;
    shotCount: number;
  }) => Promise<void>;
  onSelectExisting: (storyboard: Storyboard) => void;
  savedStoryboards: Storyboard[];
  onDeleteSaved: (id: string) => void;
  isLoading: boolean;
}

const GENRES = [
  'Cyberpunk Thriller',
  'Hard Sci-Fi Mystery',
  'Classic Film Noir',
  'Psychological Drama',
  'High-Octane Action',
  'Historical Epic',
  'Atmospheric Horror',
  'Indie Coming-of-Age'
];

const VISUAL_STYLES = [
  'Neo-Noir / High Contrast Cyan & Orange',
  'Atmospheric Kubrickian 70mm Clean',
  'Monochrome High-Contrast Chiaroscuro',
  'Warm 35mm Vintage Panavision Grain',
  'Fincher Clinical Precision Dark Palette',
  'Vibrant Anime & Graphic Novel Framing'
];

const ASPECT_RATIOS: { label: string; value: AspectRatio; desc: string; icon: any }[] = [
  { label: 'Scope 2.39:1', value: '2.39:1', desc: 'Anamorphic Widescreen', icon: Film },
  { label: 'Cinema 16:9', value: '16:9', desc: 'Modern High-Definition', icon: Monitor },
  { label: 'Academy 4:3', value: '4:3', desc: 'Vintage Classic / Indie', icon: Tv },
  { label: 'Vertical 9:16', value: '9:16', desc: 'Mobile / Social Short', icon: Smartphone }
];

export const PromptScreen: React.FC<PromptScreenProps> = ({
  onGenerate,
  onSelectExisting,
  savedStoryboards,
  onDeleteSaved,
  isLoading
}) => {
  const [prompt, setPrompt] = useState(
    'A stealth courier sprint across rainy neon rooftops in futuristic Neo-Tokyo, evading hovering security drones to deliver a glowing quantum drive.'
  );
  const [genre, setGenre] = useState('Cyberpunk Thriller');
  const [visualStyle, setVisualStyle] = useState('Neo-Noir / High Contrast Cyan & Orange');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('2.39:1');
  const [shotCount, setShotCount] = useState<number>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate({
      prompt: prompt.trim(),
      genre,
      visualStyle,
      aspectRatio,
      shotCount
    });
  };

  const handleApplyPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setPrompt(preset.prompt);
    setGenre(preset.genre);
    setAspectRatio(preset.aspectRatio);
    setShotCount(preset.shots);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Cinematic Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/10 via-sky-500/5 to-transparent blur-3xl opacity-60" />
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-48 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        {/* Subtle film grain & grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Header bar */}
      <header className="relative z-10 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/20 text-zinc-950">
              <Clapperboard className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base uppercase bg-gradient-to-r from-amber-200 via-zinc-100 to-amber-400 bg-clip-text text-transparent">
                  CineBoard Studio
                </span>
                <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                  AI STORYBOARD ENGINE
                </span>
              </div>
              <p className="text-xs text-zinc-400">Cinematic shot breakdown & animatic workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {savedStoryboards.length > 0 && (
              <span className="text-xs font-mono text-zinc-400 hidden sm:inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
                <FolderOpen className="h-3.5 w-3.5 text-amber-400" />
                {savedStoryboards.length} Storyboards Saved
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero & Dedicated Prompt Hub */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center">
        {/* Stage Hero Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-medium text-amber-400 mb-3 shadow-inner">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Turn Any Scene Idea Into a 3-Column Visual Storyboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-50 leading-tight">
            Craft Your Vision, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Shot by Cinematic Shot
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-2.5 max-w-xl mx-auto">
            Input your premise below. CineBoard will structure the narrative beats, camera angles, lighting specs, and visual cards in our multi-column production studio.
          </p>
        </div>

        {/* Dedicated Cinematic Prompt Box Container */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-7 shadow-2xl backdrop-blur-xl transition-all relative group"
        >
          {/* Subtle glowing border accent */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-sky-500/10 to-transparent -z-10 blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />

          {/* Prompt Input Header */}
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Film className="h-4 w-4" />
              1. Storyboard Concept / Scene Prompt
            </label>
            <span className="text-[11px] font-mono text-zinc-400">
              {prompt.length} characters • {prompt.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          {/* Text Area */}
          <div className="relative mb-5">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your scene, dramatic turning point, chase sequence, or script dialogue... (e.g., A lone astronaut exploring an abandoned crystalline cavern discovers an artifact that begins broadcasting their childhood memories.)"
              rows={4}
              className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/80 p-4 text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all leading-relaxed resize-none shadow-inner"
            />
          </div>

          {/* Quick Preset Ideas Chips */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400 font-medium">Instant Inspiration Presets:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_IDEAS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 hover:border-amber-500/50 px-2.5 py-1 text-xs text-zinc-300 hover:text-amber-300 transition-all text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Wand2 className="h-3 w-3 text-amber-400/80" />
                  <span>{preset.title}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">({preset.shots} shots)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cinematography Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/80 mb-6">
            {/* Genre */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                Narrative Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-lg border border-zinc-700/80 bg-zinc-950 px-3 py-2 text-xs sm:text-sm text-zinc-200 focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Visual Style */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                Director / Visual Style
              </label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full rounded-lg border border-zinc-700/80 bg-zinc-950 px-3 py-2 text-xs sm:text-sm text-zinc-200 focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                {VISUAL_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Shot Count */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Shot Count: <span className="font-mono text-amber-400">{shotCount} Shots</span>
                </label>
                <span className="text-[10px] text-zinc-400">~{shotCount * 4}s runtime</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[3, 4, 5, 6, 8].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setShotCount(n)}
                    className={`flex-1 py-1.5 rounded text-xs font-mono font-semibold border transition-all cursor-pointer ${
                      shotCount === n
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-zinc-300 mb-2 block">
              Frame Aspect Ratio
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((item) => {
                const Icon = item.icon;
                const isSelected = aspectRatio === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setAspectRatio(item.value)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                        : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono">{item.label}</div>
                      <div className="text-[10px] text-zinc-400">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
            <div className="text-xs text-zinc-400 flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-zinc-400" />
              <span>Next step: Enters the 3-column interactive storyboard workspace</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-7 py-3.5 text-sm sm:text-base font-bold text-zinc-950 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                  <span>Synthesizing Storyboard...</span>
                </>
              ) : (
                <>
                  <Clapperboard className="h-5 w-5" />
                  <span>Generate Storyboard & Open Studio</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Explore Sample Storyboards / Saved Storyboards Section */}
        <div className="mt-12 space-y-8">
          {/* Sample Production Storyboards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Film className="h-4 w-4 text-amber-400" />
                Pre-built Master Storyboards (Instant Launch)
              </h2>
              <span className="text-xs text-zinc-400">Click to load into 3-column view</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {SAMPLE_STORYBOARDS.map((sb) => (
                <div
                  key={sb.id}
                  onClick={() => onSelectExisting(sb)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-amber-500/50 p-4 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {sb.genre}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {sb.shots.length} shots • {sb.estimatedRuntime}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                      {sb.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {sb.logline}
                    </p>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 group-hover:text-zinc-200">
                    <span className="font-mono text-[10px]">{sb.aspectRatio}</span>
                    <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-xs">
                      Open in Studio <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Storyboards if user previously saved any */}
          {savedStoryboards.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-sky-400" />
                  Your Saved Storyboards ({savedStoryboards.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {savedStoryboards.map((sb) => (
                  <div
                    key={sb.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-sky-500/40 p-3.5 transition-all flex flex-col justify-between"
                  >
                    <div onClick={() => onSelectExisting(sb)} className="cursor-pointer">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-sky-400">{sb.genre}</span>
                        <span className="text-[10px] font-mono text-zinc-400">{sb.shots.length} shots</span>
                      </div>
                      <h3 className="font-bold text-sm text-zinc-200 hover:text-sky-300 line-clamp-1">
                        {sb.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{sb.logline}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                      <button
                        onClick={() => onSelectExisting(sb)}
                        className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="h-3 w-3" /> Resume Studio
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSaved(sb.id);
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                        title="Delete saved storyboard"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/80 bg-zinc-950/80 px-6 py-4 text-center text-xs text-zinc-400">
        <p>
          CineBoard Studio • Professional Storyboard Generation & Shot Planning Engine • Powered by Gemini AI
        </p>
      </footer>
    </div>
  );
};
