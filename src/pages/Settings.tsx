import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

export function Settings() {
  const { settings, updateSettings } = useSettings();

  const Toggle = ({ label, desc, value, onChange }: { label: string, desc?: string, value: boolean, onChange: () => void }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-700/50 last:border-0">
      <div>
        <h3 className="font-medium text-white">{label}</h3>
        {desc && <p className="text-slate-400 text-sm mt-1">{desc}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${
          value ? 'bg-yellow-500' : 'bg-slate-600'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  const Select = ({ label, value, options, onChange }: { label: string, value: string, options: {label: string, value: string}[], onChange: (v: any) => void }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-700/50 last:border-0">
      <h3 className="font-medium text-white">{label}</h3>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 outline-none focus:border-yellow-500"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Settings */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 text-yellow-500">Test Behavior</h2>
          <div className="mb-4">
            <h3 className="font-medium text-white mb-3">Test Duration</h3>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 60, 120].map((time) => (
                <button
                  key={time}
                  onClick={() => updateSettings({ testDuration: time })}
                  className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                    settings.testDuration === time
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                      : 'border-slate-700 hover:border-slate-500 text-slate-300'
                  }`}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>
          <Toggle label="Blind Mode" desc="Hide the text and type from memory" value={settings.blindMode} onChange={() => updateSettings({ blindMode: !settings.blindMode })} />
          <Toggle label="Auto-start typing" desc="Start timer on first keystroke" value={settings.autoStart} onChange={() => updateSettings({ autoStart: !settings.autoStart })} />
          <Toggle label="Backspace ON/OFF" desc="Allow deleting characters" value={settings.backspaceEnabled} onChange={() => updateSettings({ backspaceEnabled: !settings.backspaceEnabled })} />
          <Toggle label="Spacebar Error Detection" desc="Count mismatched spaces as errors" value={settings.spacebarError} onChange={() => updateSettings({ spacebarError: !settings.spacebarError })} />
        </div>

        {/* Visual Settings */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 text-yellow-500">Appearance</h2>
          <Select 
            label="Color Mode" 
            value={settings.colorMode} 
            onChange={(v) => updateSettings({ colorMode: v })}
            options={[
              { label: 'Dark Mode', value: 'dark' },
              { label: 'Light Mode', value: 'light' },
            ]}
          />
          <Select 
            label="Theme (Accent)" 
            value={settings.theme} 
            onChange={(v) => updateSettings({ theme: v })}
            options={[
              { label: 'Yellow (Default)', value: 'yellow' },
              { label: 'Blue', value: 'blue' },
              { label: 'Green', value: 'green' },
              { label: 'Purple', value: 'purple' },
              { label: 'Rose', value: 'rose' },
            ]}
          />
          <Select 
            label="Cursor Style" 
            value={settings.cursorStyle} 
            onChange={(v) => updateSettings({ cursorStyle: v })}
            options={[
              { label: 'Line', value: 'line' },
              { label: 'Block', value: 'block' },
              { label: 'Underline', value: 'underline' },
            ]}
          />
          <Select 
            label="Base Font Size" 
            value={settings.fontSize} 
            onChange={(v) => updateSettings({ fontSize: v })}
            options={[
              { label: 'Small', value: 'sm' },
              { label: 'Base', value: 'base' },
              { label: 'Large', value: 'lg' },
              { label: 'X-Large', value: 'xl' },
              { label: '2X-Large', value: '2xl' },
            ]}
          />
          <Select 
            label="Passage Font Size" 
            value={settings.passageFontSize} 
            onChange={(v) => updateSettings({ passageFontSize: v })}
            options={[
              { label: 'Small', value: 'sm' },
              { label: 'Base', value: 'base' },
              { label: 'Large', value: 'lg' },
              { label: 'X-Large', value: 'xl' },
              { label: '2X-Large', value: '2xl' },
            ]}
          />
          <Toggle label="Highlight Correct Chars" value={settings.highlightCorrect} onChange={() => updateSettings({ highlightCorrect: !settings.highlightCorrect })} />
          <Toggle label="Highlight Errors" value={settings.highlightError} onChange={() => updateSettings({ highlightError: !settings.highlightError })} />
        </div>

        {/* UI Elements */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 text-yellow-500">UI Elements</h2>
          <Toggle label="Show WPM" value={settings.showWpm} onChange={() => updateSettings({ showWpm: !settings.showWpm })} />
          <Toggle label="Show Accuracy" value={settings.showAccuracy} onChange={() => updateSettings({ showAccuracy: !settings.showAccuracy })} />
          <Toggle label="Show Timer" value={settings.showTimer} onChange={() => updateSettings({ showTimer: !settings.showTimer })} />
        </div>

        {/* Audio */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 text-yellow-500">Audio</h2>
          <Toggle label="Typing Sound" desc="Play sound on correct keystrokes" value={settings.typingSound} onChange={() => updateSettings({ typingSound: !settings.typingSound })} />
          <Toggle label="Error Sound" desc="Play sound on incorrect keystrokes" value={settings.errorSound} onChange={() => updateSettings({ errorSound: !settings.errorSound })} />
        </div>
      </div>
    </div>
  );
}
