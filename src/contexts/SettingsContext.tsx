import React, { createContext, useContext, useState, useEffect } from 'react';

type Settings = {
  testDuration: number;
  blindMode: boolean;
  typingSound: boolean;
  errorSound: boolean;
  highlightCorrect: boolean;
  highlightError: boolean;
  showWpm: boolean;
  showAccuracy: boolean;
  showTimer: boolean;
  autoStart: boolean;
  cursorStyle: 'line' | 'block' | 'underline';
  fontSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  passageFontSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  theme: 'yellow' | 'blue' | 'green' | 'purple' | 'rose';
  colorMode: 'dark' | 'light';
  spacebarError: boolean;
  backspaceEnabled: boolean;
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

const defaultSettings: Settings = {
  testDuration: 30, // seconds
  blindMode: false,
  typingSound: true,
  errorSound: false,
  highlightCorrect: true,
  highlightError: true,
  showWpm: true,
  showAccuracy: true,
  showTimer: true,
  autoStart: true,
  cursorStyle: 'line',
  fontSize: '2xl',
  passageFontSize: 'lg',
  theme: 'yellow',
  colorMode: 'dark',
  spacebarError: true,
  backspaceEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('typemaster_settings');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('typemaster_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
