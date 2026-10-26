import React, { useState, useEffect } from 'react';
import { SpeechUnit } from '../utils/ttsSpeechFormatter';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Gauge,
  Sliders,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
  X
} from 'lucide-react';

interface AudioPlayerBarProps {
  isOpen: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  currentUnit: SpeechUnit | null;
  currentIndex: number;
  totalUnits: number;
  speed: number;
  autoScroll: boolean;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceURI: string;
  onTogglePlay: () => void;
  onStop: () => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onChangeSpeed: (newSpeed: number) => void;
  onToggleAutoScroll: () => void;
  onSelectVoice: (voiceURI: string) => void;
}

const SPEED_PRESETS = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isOpen,
  isPlaying,
  isPaused,
  currentUnit,
  currentIndex,
  totalUnits,
  speed,
  autoScroll,
  availableVoices,
  selectedVoiceURI,
  onTogglePlay,
  onStop,
  onClose,
  onPrev,
  onNext,
  onChangeSpeed,
  onToggleAutoScroll,
  onSelectVoice
}) => {
  const [showSpeedControls, setShowSpeedControls] = useState(false);
  const [showVoiceSelect, setShowVoiceSelect] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Keyboard shortcut listener for spacebar play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle space if not typing in an input/textarea
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        (isPlaying || isPaused)
      ) {
        e.preventDefault();
        onTogglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, onTogglePlay]);

  // If closed or disabled, never render to the DOM
  if (!isOpen) {
    return null;
  }

  const progressPercent = totalUnits > 0 ? Math.round(((currentIndex + 1) / totalUnits) * 100) : 0;

  // Minimized floating bubble with both Expand and Close
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#FFFDF9] text-black border-2 border-black rounded-full px-3 py-1.5 shadow-2xl animate-bounce-subtle no-print">
        <button
          type="button"
          onClick={onTogglePlay}
          className="p-1.5 bg-black text-white rounded-full hover:bg-slate-800 transition-transform active:scale-95 cursor-pointer"
          title={isPaused ? 'Resume Audio' : 'Pause Audio'}
        >
          {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
        </button>

        <span className="font-mono text-xs font-bold truncate max-w-[140px]">
          {currentUnit?.label || 'Listening Audio'} ({speed.toFixed(2)}x)
        </span>

        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="text-slate-700 hover:text-black px-2 py-0.5 text-xs font-bold underline font-mono cursor-pointer"
          title="Expand audio controls"
        >
          Expand
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-500 hover:text-rose-600 rounded-full hover:bg-rose-50 cursor-pointer ml-1"
          title="Close Audio Player"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Audio Reader Control Bar"
      className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-3 bg-[#FFFDF9] border-t-2 border-black shadow-[0_-8px_30px_rgba(0,0,0,0.18)] no-print transition-all duration-200"
    >
      <div className="max-w-[940px] mx-auto space-y-2">
        {/* Top Meta Line: Status, Sentence Progress, and Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 truncate">
            {/* Live Audio Pulse */}
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[11px] border ${
                isPlaying && !isPaused
                  ? 'bg-amber-100 border-amber-400 text-amber-950 animate-pulse'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>{isPaused ? 'Audio Paused' : 'Now Narrating'}</span>
            </span>

            {/* Current Section & Sentence Context */}
            {currentUnit && (
              <span className="font-bold text-slate-900 truncate">
                {currentUnit.chapterNumber > 0 ? `Ch ${currentUnit.chapterNumber} · ` : ''}
                {currentUnit.label}:{' '}
                <span className="text-slate-600 font-normal italic">
                  "{currentUnit.displayText.slice(0, 45)}
                  {currentUnit.displayText.length > 45 ? '...' : ''}"
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Sentence Counter */}
            <span className="text-slate-600 font-bold bg-white border border-black/30 px-2 py-0.5 rounded text-[11px]">
              Sentence {currentIndex + 1} of {totalUnits} ({progressPercent}%)
            </span>

            {/* Auto-scroll toggle */}
            <button
              type="button"
              onClick={onToggleAutoScroll}
              className={`px-2 py-0.5 rounded border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                autoScroll
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                  : 'bg-white border-slate-300 text-slate-500 hover:border-black'
              }`}
              title="Automatically keep current sentence centered in screen"
            >
              <MapPin className="w-3 h-3 text-emerald-700" />
              <span>Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}</span>
            </button>

            {/* Minimize */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1 text-slate-500 hover:text-black rounded hover:bg-slate-100 cursor-pointer"
              title="Minimize to floating pill"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Explicit Close Player Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2 py-0.5 text-slate-700 hover:text-white bg-slate-100 hover:bg-rose-600 border border-black/30 rounded text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
              title="Close and hide audio reader completely"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-1.5 bg-slate-200 border border-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Playback Transport Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Prev Sentence */}
            <button
              type="button"
              onClick={onPrev}
              disabled={currentIndex <= 0}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 text-black border border-black rounded shadow-2xs font-mono text-xs font-bold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed transition-colors"
              title="Skip back to previous sentence"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Primary Play / Pause Button */}
            <button
              type="button"
              onClick={onTogglePlay}
              className="px-4 py-1.5 bg-black hover:bg-slate-800 text-white border border-black rounded shadow-2xs font-mono text-xs font-extrabold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
              title="Press Spacebar to Play / Pause"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              )}
            </button>

            {/* Next Sentence */}
            <button
              type="button"
              onClick={onNext}
              disabled={currentIndex >= totalUnits - 1}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 text-black border border-black rounded shadow-2xs font-mono text-xs font-bold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed transition-colors"
              title="Skip to next sentence"
            >
              <span className="hidden sm:inline">Next</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Stop Button */}
            <button
              type="button"
              onClick={onStop}
              className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-700 border border-black rounded shadow-2xs font-mono text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Stop audio playback"
            >
              <Square className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          </div>

          {/* User-Friendly Speed Selector & Presets (Fixed: Never restarts audio!) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-amber-700" />
              <span>Speed:</span>
            </span>

            {/* Stepper Buttons for Granular Speed Adjustment */}
            <button
              type="button"
              onClick={() => onChangeSpeed(Math.max(0.5, Math.round((speed - 0.1) * 20) / 20))}
              className="w-7 h-7 bg-white hover:bg-slate-100 border border-black rounded flex items-center justify-center font-mono font-bold text-xs cursor-pointer active:scale-95 shadow-2xs"
              title="Decrease speed by 0.1x"
            >
              -
            </button>

            {/* Speed Presets Buttons */}
            <div className="flex items-center bg-slate-100 border border-black rounded p-0.5 gap-0.5">
              {SPEED_PRESETS.map((preset) => {
                const isActive = Math.abs(speed - preset) < 0.04;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onChangeSpeed(preset)}
                    className={`px-2 py-0.5 text-xs font-mono font-bold rounded transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-black border border-black shadow-2xs font-extrabold'
                        : 'text-slate-700 hover:text-black hover:bg-white'
                    }`}
                  >
                    {preset}x
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onChangeSpeed(Math.min(2.5, Math.round((speed + 0.1) * 20) / 20))}
              className="w-7 h-7 bg-white hover:bg-slate-100 border border-black rounded flex items-center justify-center font-mono font-bold text-xs cursor-pointer active:scale-95 shadow-2xs"
              title="Increase speed by 0.1x"
            >
              +
            </button>

            {/* Current Speed Badge */}
            <span className="font-mono text-xs font-extrabold bg-amber-100 text-amber-950 border border-amber-400 px-2 py-0.5 rounded">
              {speed.toFixed(2)}x
            </span>

            {/* Advanced Voice Settings Button */}
            {availableVoices.length > 0 && (
              <button
                type="button"
                onClick={() => setShowVoiceSelect(!showVoiceSelect)}
                className={`p-1.5 rounded border text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  showVoiceSelect
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-black'
                }`}
                title="Change browser reading voice"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Voice</span>
              </button>
            )}
          </div>
        </div>

        {/* Optional Voice Picker Drawer */}
        {showVoiceSelect && availableVoices.length > 0 && (
          <div className="pt-2 border-t border-black/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-white p-2.5 rounded border border-black/30">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <span>Select Speech Voice:</span>
            </label>
            <select
              value={selectedVoiceURI}
              onChange={(e) => onSelectVoice(e.target.value)}
              className="flex-1 max-w-[400px] bg-slate-50 border border-black rounded px-2 py-1 text-xs font-mono font-semibold text-slate-900 cursor-pointer"
            >
              {availableVoices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang}) {voice.default ? '★ Default' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
