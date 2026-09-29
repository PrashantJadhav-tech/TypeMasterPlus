import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import {
  Settings as SettingsIcon,
  Timer,
  Eye,
  Keyboard,
  Palette,
  MousePointer2,
  Type,
  Highlighter,
  BarChart3,
  Clock3,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';

export function Settings() {
  const { settings, updateSettings } = useSettings();

  const Toggle = ({
    label,
    desc,
    value,
    onChange,
    icon,
  }: {
    label: string;
    desc?: string;
    value: boolean;
    onChange: () => void;
    icon?: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between gap-4 border-b border-slate-700/50 py-4 last:border-0">
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              value
                ? 'bg-yellow-500/10 text-yellow-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="font-semibold text-white">{label}</h3>

          {desc && (
            <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">
              {desc}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${label}`}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 ${
          value
            ? 'border-yellow-400 bg-yellow-400'
            : 'border-slate-600 bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const Select = ({
    label,
    desc,
    value,
    options,
    onChange,
    icon,
  }: {
    label: string;
    desc?: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
    icon?: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-3 border-b border-slate-700/50 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-yellow-400">
            {icon}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-white">{label}</h3>

          {desc && (
            <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">
              {desc}
            </p>
          )}
        </div>
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm font-medium text-white outline-none transition focus:border-yellow-500 sm:w-auto sm:min-w-[150px]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="page-enter min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
              Personal Preferences
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                Customize your typing experience, test behavior, appearance,
                display and audio preferences.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 sm:flex">
              <SettingsIcon className="h-4 w-4 text-yellow-400" />

              <span className="text-xs font-semibold text-slate-300">
                Changes save automatically
              </span>

              <Check className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* QUICK OVERVIEW */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickInfo
            icon={<Timer className="h-5 w-5" />}
            label="Duration"
            value={`${settings.testDuration}s`}
          />

          <QuickInfo
            icon={<Keyboard className="h-5 w-5" />}
            label="Backspace"
            value={settings.backspaceEnabled ? 'ON' : 'OFF'}
          />

          <QuickInfo
            icon={<Eye className="h-5 w-5" />}
            label="Blind Mode"
            value={settings.blindMode ? 'ON' : 'OFF'}
          />

          <QuickInfo
            icon={<Volume2 className="h-5 w-5" />}
            label="Typing Sound"
            value={settings.typingSound ? 'ON' : 'OFF'}
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* TEST BEHAVIOR */}
          <SettingsCard
            icon={<Keyboard className="h-5 w-5" />}
            title="Test Behavior"
            description="Control how typing tests start and behave."
          >
            <div className="mb-2">
              <div className="mb-3 flex items-center gap-2">
                <Timer className="h-4 w-4 text-yellow-400" />

                <h3 className="font-semibold text-white">
                  Test Duration
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[15, 30, 60, 120].map((time) => {
                  const active = settings.testDuration === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() =>
                        updateSettings({
                          testDuration: time,
                        })
                      }
                      className={`rounded-xl border py-3 text-sm font-bold transition-all ${
                        active
                          ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300 shadow-lg shadow-yellow-500/5'
                          : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      {time}s
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Choose the default duration for supported typing tests.
              </p>
            </div>

            <Toggle
              label="Blind Mode"
              desc="Hide the passage while typing from memory."
              value={settings.blindMode}
              onChange={() =>
                updateSettings({
                  blindMode: !settings.blindMode,
                })
              }
              icon={<Eye className="h-4 w-4" />}
            />

            <Toggle
              label="Auto-start Typing"
              desc="Start the timer automatically on your first keystroke."
              value={settings.autoStart}
              onChange={() =>
                updateSettings({
                  autoStart: !settings.autoStart,
                })
              }
              icon={<Sparkles className="h-4 w-4" />}
            />

            <Toggle
              label="Backspace"
              desc="Allow deleting characters while typing."
              value={settings.backspaceEnabled}
              onChange={() =>
                updateSettings({
                  backspaceEnabled: !settings.backspaceEnabled,
                })
              }
              icon={<Keyboard className="h-4 w-4" />}
            />

            <Toggle
              label="Spacebar Error Detection"
              desc="Count mismatched spaces as typing errors."
              value={settings.spacebarError}
              onChange={() =>
                updateSettings({
                  spacebarError: !settings.spacebarError,
                })
              }
              icon={<Type className="h-4 w-4" />}
            />
          </SettingsCard>

          {/* APPEARANCE */}
          <SettingsCard
            icon={<Palette className="h-5 w-5" />}
            title="Appearance"
            description="Customize the visual style of your typing workspace."
          >
            <Select
              label="Color Mode"
              desc="Choose your preferred interface mode."
              value={settings.colorMode}
              onChange={(value) =>
                updateSettings({
                  colorMode: value,
                })
              }
              icon={<Palette className="h-4 w-4" />}
              options={[
                {
                  label: 'Dark Mode',
                  value: 'dark',
                },
                {
                  label: 'Light Mode',
                  value: 'light',
                },
              ]}
            />

            <Select
              label="Accent Theme"
              desc="Choose your interface accent color."
              value={settings.theme}
              onChange={(value) =>
                updateSettings({
                  theme: value,
                })
              }
              icon={<Sparkles className="h-4 w-4" />}
              options={[
                {
                  label: 'Yellow',
                  value: 'yellow',
                },
                {
                  label: 'Blue',
                  value: 'blue',
                },
                {
                  label: 'Green',
                  value: 'green',
                },
                {
                  label: 'Purple',
                  value: 'purple',
                },
                {
                  label: 'Rose',
                  value: 'rose',
                },
              ]}
            />

            <Select
              label="Cursor Style"
              desc="Choose how the typing cursor appears."
              value={settings.cursorStyle}
              onChange={(value) =>
                updateSettings({
                  cursorStyle: value,
                })
              }
              icon={<MousePointer2 className="h-4 w-4" />}
              options={[
                {
                  label: 'Line',
                  value: 'line',
                },
                {
                  label: 'Block',
                  value: 'block',
                },
                {
                  label: 'Underline',
                  value: 'underline',
                },
              ]}
            />

            <Select
              label="Base Font Size"
              desc="Change the general interface text size."
              value={settings.fontSize}
              onChange={(value) =>
                updateSettings({
                  fontSize: value,
                })
              }
              icon={<Type className="h-4 w-4" />}
              options={[
                {
                  label: 'Small',
                  value: 'sm',
                },
                {
                  label: 'Base',
                  value: 'base',
                },
                {
                  label: 'Large',
                  value: 'lg',
                },
                {
                  label: 'X-Large',
                  value: 'xl',
                },
                {
                  label: '2X-Large',
                  value: '2xl',
                },
              ]}
            />

            <Select
              label="Passage Font Size"
              desc="Change the text size of typing passages."
              value={settings.passageFontSize}
              onChange={(value) =>
                updateSettings({
                  passageFontSize: value,
                })
              }
              icon={<Type className="h-4 w-4" />}
              options={[
                {
                  label: 'Small',
                  value: 'sm',
                },
                {
                  label: 'Base',
                  value: 'base',
                },
                {
                  label: 'Large',
                  value: 'lg',
                },
                {
                  label: 'X-Large',
                  value: 'xl',
                },
                {
                  label: '2X-Large',
                  value: '2xl',
                },
              ]}
            />
          </SettingsCard>

          {/* TYPING DISPLAY */}
          <SettingsCard
            icon={<BarChart3 className="h-5 w-5" />}
            title="Typing Display"
            description="Choose which information appears during your tests."
          >
            <Toggle
              label="Show WPM"
              desc="Display your live words-per-minute score."
              value={settings.showWpm}
              onChange={() =>
                updateSettings({
                  showWpm: !settings.showWpm,
                })
              }
              icon={<BarChart3 className="h-4 w-4" />}
            />

            <Toggle
              label="Show Accuracy"
              desc="Display your current typing accuracy."
              value={settings.showAccuracy}
              onChange={() =>
                updateSettings({
                  showAccuracy: !settings.showAccuracy,
                })
              }
              icon={<TargetIcon />}
            />

            <Toggle
              label="Show Timer"
              desc="Display the remaining test time."
              value={settings.showTimer}
              onChange={() =>
                updateSettings({
                  showTimer: !settings.showTimer,
                })
              }
              icon={<Clock3 className="h-4 w-4" />}
            />

            <Toggle
              label="Highlight Correct Characters"
              desc="Visually highlight correctly typed characters."
              value={settings.highlightCorrect}
              onChange={() =>
                updateSettings({
                  highlightCorrect: !settings.highlightCorrect,
                })
              }
              icon={<Highlighter className="h-4 w-4" />}
            />

            <Toggle
              label="Highlight Errors"
              desc="Visually highlight incorrect characters."
              value={settings.highlightError}
              onChange={() =>
                updateSettings({
                  highlightError: !settings.highlightError,
                })
              }
              icon={<Highlighter className="h-4 w-4" />}
            />
          </SettingsCard>

          {/* AUDIO */}
          <SettingsCard
            icon={<Volume2 className="h-5 w-5" />}
            title="Audio"
            description="Control typing and error sound feedback."
          >
            <Toggle
              label="Typing Sound"
              desc="Play a sound when a character is typed correctly."
              value={settings.typingSound}
              onChange={() =>
                updateSettings({
                  typingSound: !settings.typingSound,
                })
              }
              icon={
                settings.typingSound ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )
              }
            />

            <Toggle
              label="Error Sound"
              desc="Play a sound when an incorrect character is typed."
              value={settings.errorSound}
              onChange={() =>
                updateSettings({
                  errorSound: !settings.errorSound,
                })
              }
              icon={
                settings.errorSound ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )
              }
            />

            <div className="mt-5 rounded-2xl border border-slate-700/70 bg-slate-900/50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                  <Volume2 className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Audio Feedback
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Sounds are useful during practice, but you can disable
                    them for silent exam-style typing.
                  </p>
                </div>
              </div>
            </div>
          </SettingsCard>
        </div>

        {/* RESET INFO */}
        <div className="mt-6 rounded-2xl border border-slate-700/70 bg-slate-900/40 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                <RotateCcw className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Settings are saved automatically
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  Your preferences are managed by the existing Settings
                  Context and are applied across the typing experience.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Check className="h-4 w-4" />
              Auto Saved
            </div>
          </div>
        </div>

        {/* MOBILE SAVE STATUS */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 sm:hidden">
          <Check className="h-4 w-4 text-emerald-400" />
          Changes save automatically
        </div>
      </div>
    </div>
  );
}

/* =========================
   SETTINGS CARD
========================= */

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pro-card overflow-hidden">
      <div className="border-b border-slate-700/60 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
            {icon}
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-slate-400">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6">{children}</div>
    </section>
  );
}

/* =========================
   QUICK INFO
========================= */

function QuickInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
      <div className="mb-3 text-yellow-400">{icon}</div>

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate text-lg font-black text-white">
        {value}
      </p>
    </div>
  );
}

/* =========================
   TARGET ICON
========================= */

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}