import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArrowLeft,
  Crosshair,
  Gamepad2,
  Keyboard,
  RotateCcw,
  Trophy,
  Zap,
  Target,
  Heart,
  Clock3,
  Sparkles,
} from 'lucide-react';

const WORDS = [
  'keyboard',
  'typing',
  'speed',
  'accuracy',
  'practice',
  'master',
  'coding',
  'developer',
  'computer',
  'javascript',
  'python',
  'website',
  'focus',
  'challenge',
  'learn',
  'future',
  'creative',
  'power',
  'success',
  'program',
  'function',
  'project',
  'student',
  'career',
  'technology',
  'internet',
  'database',
  'screen',
  'mouse',
  'shortcut',
];

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

type GameId = 'falling' | 'blitz' | 'race';

export function TypingGame() {
  const [selected, setSelected] = useState<GameId | null>(null);

  const games = [
    {
      id: 'falling' as const,
      title: 'Falling Words',
      desc: 'Type the falling words before they reach the bottom.',
      icon: <Zap className="w-6 h-6" />,
      tag: 'Reflex',
    },
    {
      id: 'blitz' as const,
      title: 'Typing Blitz',
      desc: 'Type as many words as possible in 60 seconds.',
      icon: <Crosshair className="w-6 h-6" />,
      tag: 'Speed',
    },
    {
      id: 'race' as const,
      title: 'Word Race',
      desc: 'Beat the clock and complete the word chain.',
      icon: <Trophy className="w-6 h-6" />,
      tag: 'Challenge',
    },
  ];

  if (!selected) {
    return (
      <div className="page-enter w-full py-5 sm:py-8 lg:py-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-yellow-400 text-xs sm:text-sm font-bold mb-5">
              <Gamepad2 className="w-4 h-4" />
              TYPING GAMES
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Play. Type.{' '}
              <span className="text-yellow-400">Improve.</span>
            </h1>

            <p className="text-slate-400 max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
              Fun typing challenges designed to improve your speed, accuracy,
              reaction time and keyboard confidence.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mb-10">
            <GameIntroStat
              icon={<Keyboard className="w-4 h-4" />}
              value="3"
              label="Games"
            />
            <GameIntroStat
              icon={<Target className="w-4 h-4" />}
              value="∞"
              label="Attempts"
            />
            <GameIntroStat
              icon={<Trophy className="w-4 h-4" />}
              value="XP"
              label="Earn Skills"
            />
          </div>

          {/* Games */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {games.map((game, index) => (
              <button
                key={game.id}
                onClick={() => setSelected(game.id)}
                className="group text-left pro-card p-6 sm:p-7 hover:-translate-y-1 hover:border-yellow-500/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {game.icon}
                  </div>

                  <span className="px-2.5 py-1 rounded-full border border-slate-700 bg-slate-800/70 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {game.tag}
                  </span>
                </div>

                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                  Game {index + 1}
                </p>

                <h2 className="text-2xl font-bold text-white mt-2 group-hover:text-yellow-400 transition-colors">
                  {game.title}
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed mt-3 min-h-[48px]">
                  {game.desc}
                </p>

                <div className="flex items-center justify-between mt-7 pt-5 border-t border-slate-800">
                  <span className="text-yellow-400 text-sm font-bold">
                    Play now
                  </span>

                  <span className="text-slate-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom info */}
          <div className="mt-8 pro-card p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>

              <div>
                <h3 className="font-bold text-white">
                  Train different typing skills
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Falling Words focuses on reflexes, Blitz on speed, and Word
                  Race on consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter w-full py-3 sm:py-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setSelected(null)}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Games
        </button>

        {selected === 'falling' && <FallingWords />}
        {selected === 'blitz' && <TypingBlitz />}
        {selected === 'race' && <WordRace />}
      </div>
    </div>
  );
}

function GameIntroStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="pro-card px-3 py-4 text-center">
      <div className="flex justify-center text-yellow-400 mb-1">{icon}</div>
      <div className="text-lg font-black text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </div>
    </div>
  );
}

function GameShell({
  title,
  subtitle,
  children,
  onReset,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onReset: () => void;
}) {
  return (
    <div className="pro-card overflow-hidden shadow-2xl">
      <div className="px-5 sm:px-6 py-5 border-b border-slate-800 bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gamepad2 className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold">
                Typing Game
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {title}
            </h2>

            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          </div>

          <button
            onClick={onReset}
            className="pro-btn pro-btn-secondary !px-4 !py-2.5 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}

function FallingWords() {
  const [items, setItems] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      word: randomWord(),
      x: 8 + Math.random() * 84,
      y: -10 - i * 16,
    }))
  );

  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [levelWords, setLevelWords] = useState(0);
  const [transition, setTransition] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const makeItems = () =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      word: randomWord(),
      x: 8 + Math.random() * 84,
      y: -10 - i * 16,
    }));

  const reset = useCallback(() => {
    setItems(makeItems());
    setInput('');
    setScore(0);
    setLives(5);
    setStarted(false);
    setLevel(1);
    setLevelWords(0);
    setTransition(null);
  }, []);

  useEffect(() => {
    if (!started || lives <= 0 || transition) return;

    const timer = setInterval(() => {
      const progressSpeed = levelWords / 10;
      const baseSpeed = level === 1 ? 0.9 : level === 2 ? 1.35 : 1.8;
      const growth = level === 1 ? 0.65 : level === 2 ? 0.9 : 1.2;
      const speed = baseSpeed + progressSpeed * growth;

      setItems((prev) =>
        prev
          .map((item) => ({
            ...item,
            y: item.y + speed,
          }))
          .map((item) => {
            if (item.y > 94) {
              setLives((v) => Math.max(0, v - 1));

              return {
                ...item,
                word: randomWord(),
                x: 8 + Math.random() * 84,
                y: -8,
              };
            }

            return item;
          })
      );
    }, 120);

    return () => clearInterval(timer);
  }, [started, lives, transition, level, levelWords]);

  useEffect(() => {
    if (!transition) return;

    const timer = setTimeout(() => {
      setTransition(null);
      setStarted(true);
      inputRef.current?.focus();
    }, 3000);

    return () => clearTimeout(timer);
  }, [transition]);

  const completeLevel = () => {
    if (level < 3) {
      const next = level + 1;

      setLevel(next);
      setLevelWords(0);
      setLives(5);
      setItems(makeItems());
      setInput('');
      setStarted(false);
      setTransition(
        `Now ${next === 2 ? 'Medium' : 'Hard'} Level is Starting...`
      );
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (transition || lives <= 0) return;

    const found = items.find(
      (i) => i.word === input.trim().toLowerCase()
    );

    if (found) {
      setScore((s) => s + found.word.length * 10);

      setLevelWords((w) => {
        const nextCount = w + 1;

        if (nextCount >= 10 && level < 3) {
          setTimeout(completeLevel, 0);
        }

        return nextCount;
      });

      setItems((prev) =>
        prev.map((i) =>
          i.id === found.id
            ? {
                ...i,
                word: randomWord(),
                x: 8 + Math.random() * 84,
                y: -8,
              }
            : i
        )
      );

      setInput('');
    }
  };

  const levelName =
    level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard';

  return (
    <GameShell
      title="Falling Words"
      subtitle="Type the word before it falls off the screen."
      onReset={reset}
    >
      <div className="p-4 sm:p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
          <GameStat
            label="Score"
            value={score}
            icon={<Trophy className="w-4 h-4" />}
          />

          <GameStat
            label="Level"
            value={`${levelName}`}
            icon={<Zap className="w-4 h-4" />}
          />

          <GameStat
            label="Progress"
            value={`${levelWords}/10`}
            icon={<Target className="w-4 h-4" />}
          />
        </div>

        {/* Lives */}
        <div className="flex items-center justify-end gap-2 mb-3">
          <Heart className="w-4 h-4 text-red-400" />

          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={index < lives ? 'text-red-400' : 'text-slate-700'}
              >
                ♥
              </span>
            ))}
          </div>
        </div>

        {/* Game Area */}
        <div className="relative h-[55vh] min-h-[360px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-yellow-500/30" />

          {transition && (
            <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-5">
                <Trophy className="w-7 h-7 text-yellow-400" />
              </div>

              <div className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">
                Level Complete!
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white">
                {transition}
              </h3>

              <p className="text-slate-500 mt-3">
                Get ready... 3 seconds
              </p>
            </div>
          )}

          {lives <= 0 && !transition && (
            <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
              <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
                Game Over
              </div>

              <h3 className="text-4xl sm:text-5xl font-black text-white">
                Nice Try!
              </h3>

              <p className="text-slate-400 mt-2">
                Final score:{' '}
                <span className="text-white font-bold">{score}</span>
              </p>

              <button
                onClick={reset}
                className="pro-btn pro-btn-primary mt-6"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="absolute px-3 py-2 rounded-xl bg-slate-800 border border-yellow-500/40 text-yellow-300 font-bold shadow-lg"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
              }}
            >
              {item.word}
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={submit} className="mt-4 flex gap-2 sm:gap-3">
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onFocus={() => setStarted(true)}
            onChange={(e) => setInput(e.target.value.toLowerCase())}
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault();
                submit(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Type a falling word..."
            disabled={lives <= 0 || !!transition}
            className="pro-input flex-1 !py-4"
          />

          <button
            type="submit"
            disabled={lives <= 0 || !!transition}
            className="pro-btn pro-btn-primary shrink-0"
          >
            Type
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-3 text-center">
          Type the falling word and press Space to submit. 10 correct words =
          next level.
        </p>
      </div>
    </GameShell>
  );
}

function TypingBlitz() {
  const [target, setTarget] = useState(randomWord);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [time, setTime] = useState(60);
  const [running, setRunning] = useState(false);

  const reset = useCallback(() => {
    setTarget(randomWord());
    setInput('');
    setScore(0);
    setCorrect(0);
    setTime(60);
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!running) return;

    if (time <= 0) {
      setRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setTime((v) => v - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running, time]);

  const onChange = (value: string) => {
    if (!running && time > 0) {
      setRunning(true);
    }

    setInput(value.toLowerCase());

    if (value.toLowerCase().trim() === target && target) {
      setScore((s) => s + target.length * 10);
      setCorrect((c) => c + 1);
      setTarget(randomWord());
      setInput('');
    }
  };

  return (
    <GameShell
      title="Typing Blitz"
      subtitle="60 seconds. Type as many words as you can."
      onReset={reset}
    >
      <div className="p-5 sm:p-8 text-center">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mb-10">
          <GameStat
            label="Time"
            value={`${time}s`}
            icon={<Clock3 className="w-4 h-4" />}
          />

          <GameStat
            label="Words"
            value={correct}
            icon={<Keyboard className="w-4 h-4" />}
          />

          <GameStat
            label="Score"
            value={score}
            icon={<Trophy className="w-4 h-4" />}
          />
        </div>

        {time === 0 ? (
          <div className="py-10 sm:py-16">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-5">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>

            <h3 className="text-4xl sm:text-5xl font-black text-white">
              Time's Up!
            </h3>

            <p className="text-slate-400 mt-3">
              {correct} words typed • {score} points
            </p>

            <button
              onClick={reset}
              className="pro-btn pro-btn-primary mt-7"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">
              Current Word
            </div>

            <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-yellow-400 tracking-wide mb-8 break-words">
              {target}
            </div>

            <input
              autoFocus
              value={input}
              onChange={(e) => onChange(e.target.value)}
              disabled={time === 0}
              placeholder="Start typing..."
              className="w-full max-w-2xl mx-auto pro-input !py-5 !text-xl sm:!text-2xl text-center"
            />

            <p className="text-slate-500 text-sm mt-4">
              Timer starts with your first keystroke.
            </p>
          </>
        )}
      </div>
    </GameShell>
  );
}

function WordRace() {
  const sequence = useMemo(
    () => Array.from({ length: 12 }, randomWord),
    []
  );

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const reset = () => {
    setIndex(0);
    setInput('');
    setTime(30);
    setRunning(false);
    setFinished(false);
  };

  useEffect(() => {
    if (!running || finished) return;

    if (time <= 0) {
      setFinished(true);
      setRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setTime((v) => v - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running, finished, time]);

  const change = (v: string) => {
    if (!running) {
      setRunning(true);
    }

    setInput(v.toLowerCase());

    if (v.trim().toLowerCase() === sequence[index]) {
      if (index === sequence.length - 1) {
        setFinished(true);
        setRunning(false);
      } else {
        setIndex((i) => i + 1);
        setInput('');
      }
    }
  };

  const progress = Math.round((index / sequence.length) * 100);

  return (
    <GameShell
      title="Word Race"
      subtitle="Finish the word chain before 30 seconds runs out."
      onReset={reset}
    >
      <div className="p-5 sm:p-8 max-w-4xl mx-auto">
        {finished ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-5">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>

            <h3 className="text-4xl sm:text-5xl font-black text-white">
              {index >= sequence.length - 1
                ? 'Race Complete!'
                : "Time's Up!"}
            </h3>

            <p className="text-slate-400 mt-3">
              {Math.min(
                index +
                  (index >= sequence.length - 1 ? 1 : 0),
                sequence.length
              )}{' '}
              / {sequence.length} words completed
            </p>

            <button
              onClick={reset}
              className="pro-btn pro-btn-primary mt-7"
            >
              <RotateCcw className="w-4 h-4" />
              Race Again
            </button>
          </div>
        ) : (
          <>
            {/* Header stats */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-yellow-400">
                Word {index + 1} / {sequence.length}
              </span>

              <span className="flex items-center gap-1.5 text-sm font-bold text-cyan-400">
                <Clock3 className="w-4 h-4" />
                {time}s
              </span>
            </div>

            {/* Progress */}
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-8">
              <div
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Words */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {sequence.map((word, i) => (
                <span
                  key={i}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs sm:text-sm transition-all',
                    i < index
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : i === index
                      ? 'bg-yellow-500 text-slate-950 font-bold shadow-lg shadow-yellow-500/10'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  )}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Current word */}
            <div className="text-center mb-5">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">
                Type this word
              </p>

              <p className="text-3xl sm:text-4xl font-black text-white">
                {sequence[index]}
              </p>
            </div>

            <input
              autoFocus
              value={input}
              onChange={(e) => change(e.target.value)}
              className="w-full pro-input !py-5 !text-xl text-center"
              placeholder="Type the highlighted word..."
            />

            <p className="text-center text-slate-500 text-sm mt-4">
              Timer starts when you begin typing.
            </p>
          </>
        )}
      </div>
    </GameShell>
  );
}

function GameStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3 sm:p-4">
      <div className="flex items-center justify-center gap-2 text-yellow-400 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          {label}
        </span>
      </div>

      <div className="text-xl sm:text-2xl font-black text-white truncate">
        {value}
      </div>
    </div>
  );
}