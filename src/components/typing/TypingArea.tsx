import React, { useMemo, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useSettings } from '../../contexts/SettingsContext';

interface TypingAreaProps {
  text: string;
  input: string;
  status: 'idle' | 'running' | 'finished';
  onInput: (val: string) => void;
  onReset: () => void;
}

export function TypingArea({ text, input, status, onInput, onReset }: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { settings } = useSettings();

  // Focus input automatically when idle or running
  useEffect(() => {
    if (status !== 'finished') {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleContainerClick = () => {
    if (status !== 'finished') {
      inputRef.current?.focus();
    }
  };

  // Pre-calculate character statuses
  const characters = useMemo(() => {
    return text.split('').map((char, index) => {
      let state = 'untyped';
      if (index < input.length) {
        state = input[index] === char ? 'correct' : 'incorrect';
      }
      return { char, state };
    });
  }, [text, input]);

  const getFontSizeClass = () => {
    switch(settings.fontSize) {
      case 'sm': return 'text-sm md:text-base';
      case 'base': return 'text-base md:text-lg';
      case 'lg': return 'text-lg md:text-xl';
      case 'xl': return 'text-xl md:text-2xl';
      case '2xl': return 'text-2xl md:text-3xl';
      default: return 'text-2xl md:text-3xl';
    }
  };

  const renderCursor = () => {
    let cursorClass = "bg-yellow-500 caret-blink";
    if (settings.cursorStyle === 'block') {
      cursorClass = "bg-yellow-500/50 caret-blink w-[1ch] left-0 right-auto";
    } else if (settings.cursorStyle === 'underline') {
      cursorClass = "bg-yellow-500 caret-blink w-[1ch] h-[2px] bottom-0 top-auto left-0";
    } else {
      cursorClass = "bg-yellow-500 caret-blink w-[2px] -ml-[1px] left-0 bottom-0 top-0";
    }
    return <span className={cn("absolute", cursorClass)} />;
  };

  return (
    <div 
      className={cn("relative w-full max-w-4xl mx-auto cursor-text leading-relaxed tracking-wide font-mono select-none", getFontSizeClass())}
      onClick={handleContainerClick}
    >
      {/* Hidden input to capture keystrokes */}
      <input
        ref={inputRef}
        type="text"
        className="absolute inset-0 opacity-0 cursor-default"
        value={input}
        onChange={(e) => onInput(e.target.value)}
        disabled={status === 'finished'}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      <div className="relative z-10 text-slate-500 whitespace-pre-wrap break-words">
        {characters.map((item, index) => {
          const isCurrent = index === input.length;
          
          let charClass = "text-slate-600";
          if (item.state === 'correct') {
            charClass = settings.highlightCorrect ? "text-slate-100" : "text-slate-600";
          }
          if (item.state === 'incorrect') {
            charClass = settings.highlightError ? "text-red-500 bg-red-500/20 rounded-sm" : "text-slate-600";
          }
          
          if (settings.blindMode && item.state === 'untyped') {
             charClass = "opacity-0";
          }
          if (settings.blindMode && item.state === 'correct') {
             charClass = "text-slate-700"; // Barely visible in blind mode
          }
          if (settings.blindMode && item.state === 'incorrect') {
             charClass = "text-red-900"; // Barely visible error
          }
          
          return (
            <span key={index} className="relative">
              {isCurrent && status !== 'finished' && renderCursor()}
              <span 
                className={cn(
                  "transition-colors duration-100",
                  charClass
                )}
              >
                {item.char}
              </span>
            </span>
          );
        })}
        {/* Caret at the very end if we finished typing the whole string */}
        {input.length === text.length && status !== 'finished' && (
           <span className="relative">
             <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-yellow-500 caret-blink -ml-[1px]" />
           </span>
        )}
      </div>

      <div className="mt-8 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
        <button 
          onClick={onReset}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors flex items-center space-x-2 text-sm font-sans"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Restart Test</span>
        </button>
      </div>
    </div>
  );
}
