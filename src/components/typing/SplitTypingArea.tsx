import React, { useEffect, useRef, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { useSettings } from '../../contexts/SettingsContext';

interface SplitTypingAreaProps {
  text: string;
  input: string;
  status: 'idle' | 'running' | 'finished';
  onInput: (val: string) => void;
  onReset: () => void;
  onCancel: () => void;
  stats: any;
  timeLeft: number;
  passages: {
    id: string;
    title: string;
    text: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }[];
  currentPassageId: string | null;
  onPassageChange: (id: string) => void;
  onSubmit: () => void;
}

export function SplitTypingArea({
  text, input, status, onInput, onReset, onCancel, stats, timeLeft,
  passages, currentPassageId, onPassageChange, onSubmit
}: SplitTypingAreaProps) {
  const { settings } = useSettings();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (status !== 'finished') {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Do not steal focus from controls such as the passage dropdown.
    const target = e.target as HTMLElement;
    if (target.closest('select, button, input, textarea')) return;

    if (status !== 'finished') {
      inputRef.current?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getFontSizeClass = () => {
    switch(settings.fontSize) {
      case 'sm': return 'text-sm';
      case 'base': return 'text-base';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      case '2xl': return 'text-2xl';
      default: return 'text-xl';
    }
  };

  // Words calculation
  const typedWords = input.split(' ');
  const targetWords = text.split(' ');
  
  let correctWords = 0;
  let wrongWords = 0;
  
  typedWords.forEach((word, index) => {
    if (index < typedWords.length - 1) {
      if (word === targetWords[index]) {
        correctWords++;
      } else {
        wrongWords++;
      }
    }
  });

  const characters = useMemo(() => {
    return text.split('').map((char, index) => {
      let state = 'untyped';
      if (index < input.length) {
        state = input[index] === char ? 'correct' : 'incorrect';
      }
      return { char, state };
    });
  }, [text, input]);

  useEffect(() => {
    const activeChar = document.getElementById('active-char');
    if (activeChar) {
      activeChar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [input.length]);

  return (
    <div className="w-full flex-1 flex flex-col md:flex-row bg-slate-900 overflow-hidden">
      {/* Left Side: Passage */}
      <div className="w-full md:w-1/2 p-6 pt-16 md:p-12 md:pt-16 md:border-r border-slate-700 bg-slate-800/30 flex flex-col h-1/2 md:h-full">
        <h3 className="text-xl font-bold text-slate-300 mb-6 flex items-center">
          <span className="w-3 h-3 rounded-full bg-yellow-500 mr-3 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span>
          Original Passage
        </h3>
        <div 
          className={cn(
            "flex-1 overflow-y-auto pr-6 pb-20 text-slate-400 whitespace-pre-wrap break-words font-mono leading-relaxed",
            getFontSizeClass()
          )}
        >
          {characters.map((item, index) => {
            const isCurrent = index === input.length;
            
            let charClass = "text-slate-500";
            if (item.state === 'correct') {
              charClass = settings.highlightCorrect ? "text-slate-100" : "text-slate-500";
            }
            if (item.state === 'incorrect') {
              charClass = settings.highlightError ? "text-red-500 bg-red-500/20" : "text-slate-500";
            }
            
            return (
              <span 
                key={index} 
                id={isCurrent ? "active-char" : undefined}
                className={cn("transition-colors duration-100", charClass, isCurrent ? "bg-yellow-500/30 text-slate-100 border-b-2 border-yellow-500" : "")}
              >
                {item.char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Right Side: Input & Stats */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col h-1/2 md:h-full" onClick={handleContainerClick}>
        
        {/* Select Passage + Timer */}
        <div className="flex justify-between items-center mb-3 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Select Passage</span>
            <select
              value={currentPassageId || ''}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onPassageChange(e.target.value)}
              disabled={status === 'running'}
              className="max-w-[220px] px-3 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 outline-none focus:border-yellow-500 text-sm"
            >
              {passages.map((passage) => (
                <option key={passage.id} value={passage.id}>
                  {passage.title}
                </option>
              ))}
            </select>
          </div>

          <div className="px-4 py-2 rounded-lg bg-slate-800/70 border border-slate-700 shrink-0">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mr-2">Time</span>
            <span className="text-lg font-bold text-yellow-500 font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Typing Input */}
        <div className="flex-1 flex flex-col relative">
          <textarea
            ref={inputRef}
            className={cn(
              "w-full h-full bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-slate-100 resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none whitespace-pre-wrap break-words font-mono leading-relaxed",
              getFontSizeClass()
            )}
            placeholder="Start typing here..."
            value={input}
            onChange={(e) => onInput(e.target.value)}
            disabled={status === 'finished'}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (window.confirm("Are you sure you want to cancel this test?")) {
                onCancel();
              }
            }}
            className="px-6 py-2 bg-red-900/40 hover:bg-red-800/80 text-red-300 hover:text-white rounded-lg transition-colors flex items-center space-x-2 text-sm font-sans border border-red-800/50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancel Test</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onSubmit(); }}
            disabled={status !== 'running' || input.length === 0}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 rounded-lg transition-colors text-sm font-sans font-bold border border-yellow-500"
          >
            Submit Test
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); onReset(); }}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center space-x-2 text-sm font-sans border border-slate-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Restart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
