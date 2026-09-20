import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Crosshair, Gamepad2, Keyboard, RotateCcw, Trophy, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const WORDS = [
  'keyboard','typing','speed','accuracy','practice','master','coding','developer','computer','javascript',
  'python','website','focus','challenge','learn','future','creative','power','success','program',
  'function','project','student','career','technology','internet','database','screen','mouse','shortcut'
];

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

type GameId = 'falling' | 'blitz' | 'race';

export function TypingGame() {
  const [selected, setSelected] = useState<GameId | null>(null);
  const games = [
    { id: 'falling' as const, title: 'Falling Words', desc: 'Type the falling words before they reach the bottom.', icon: <Zap /> },
    { id: 'blitz' as const, title: 'Typing Blitz', desc: 'Type as many words as possible in 60 seconds.', icon: <Crosshair /> },
    { id: 'race' as const, title: 'Word Race', desc: 'Beat the clock and complete the word chain.', icon: <Trophy /> },
  ];

  if (!selected) return (
    <div className="min-h-[calc(100vh-8rem)] w-full py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-yellow-400 text-sm font-semibold mb-4">
            <Gamepad2 className="w-4 h-4" /> Typing Games
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Play. Type. Improve.</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Fun typing games to improve speed, accuracy and keyboard confidence.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((g, i) => (
            <button key={g.id} onClick={() => setSelected(g.id)}
              className="text-left bg-slate-800/70 border border-slate-700 rounded-3xl p-7 hover:border-yellow-500/60 hover:-translate-y-1 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {g.icon}
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Game {i + 1}</span>
              <h2 className="text-2xl font-bold text-white mt-2 mb-2">{g.title}</h2>
              <p className="text-slate-400 leading-relaxed">{g.desc}</p>
              <div className="mt-6 text-yellow-400 font-semibold">Play now →</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-8rem)] w-full py-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => setSelected(null)} className="mb-5 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Games
        </button>
        {selected === 'falling' && <FallingWords />}
        {selected === 'blitz' && <TypingBlitz />}
        {selected === 'race' && <WordRace />}
      </div>
    </div>
  );
}

function GameShell({ title, subtitle, children, onReset }: { title: string; subtitle: string; children: React.ReactNode; onReset: () => void }) {
  return <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
    <div className="px-6 py-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
      <div><h2 className="text-2xl font-bold text-white">{title}</h2><p className="text-sm text-slate-400">{subtitle}</p></div>
      <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"><RotateCcw className="w-4 h-4"/> Restart</button>
    </div>
    {children}
  </div>;
}

function FallingWords() {
  const [items, setItems] = useState(() => Array.from({length: 6}, (_, i) => ({id: i, word: randomWord(), x: 8 + Math.random()*84, y: -10 - i*16})));
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [levelWords, setLevelWords] = useState(0);
  const [transition, setTransition] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const makeItems = () => Array.from({length: 6}, (_, i) => ({id: i, word: randomWord(), x: 8 + Math.random()*84, y: -10 - i*16}));

  const reset = useCallback(() => {
    setItems(makeItems());
    setInput(''); setScore(0); setLives(5); setStarted(false);
    setLevel(1); setLevelWords(0); setTransition(null);
  }, []);

  useEffect(() => {
    if (!started || lives <= 0 || transition) return;

    const timer = setInterval(() => {
      // Falling speed increases gradually as the player progresses.
      const progressSpeed = levelWords / 10;
      const baseSpeed = level === 1 ? 0.9 : level === 2 ? 1.35 : 1.8;
      const growth = level === 1 ? 0.65 : level === 2 ? 0.9 : 1.2;
      const speed = baseSpeed + progressSpeed * growth;

      setItems(prev => prev.map(item => ({...item, y: item.y + speed})).map(item => {
        if (item.y > 94) {
          setLives(v => Math.max(0, v - 1));
          return {...item, word: randomWord(), x: 8 + Math.random()*84, y: -8};
        }
        return item;
      }));
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
      setTransition(`Now ${next === 2 ? 'Medium' : 'Hard'} Level is Starting...`);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transition || lives <= 0) return;
    const found = items.find(i => i.word === input.trim().toLowerCase());
    if (found) {
      setScore(s => s + found.word.length * 10);
      setLevelWords(w => {
        const nextCount = w + 1;
        if (nextCount >= 10 && level < 3) setTimeout(completeLevel, 0);
        return nextCount;
      });
      setItems(prev => prev.map(i => i.id === found.id ? {...i, word: randomWord(), x: 8 + Math.random()*84, y: -8} : i));
      setInput('');
    }
  };

  const levelName = level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard';

  return <GameShell title="Falling Words" subtitle="Type the word before it falls off the screen." onReset={reset}>
    <div className="p-5">
      <div className="flex flex-wrap justify-between gap-3 text-sm font-semibold mb-3">
        <span className="text-yellow-400">Score: {score}</span>
        <span className="text-cyan-400">Level: {levelName} • {levelWords}/10</span>
        <span className="text-red-400">Lives: {'❤️'.repeat(lives)}{'🖤'.repeat(5-lives)}</span>
      </div>
      <div className="relative h-[55vh] min-h-[360px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        {transition && <div className="absolute inset-0 z-30 bg-slate-950/95 flex flex-col items-center justify-center text-center p-6">
          <div className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-3">Level Complete!</div>
          <h3 className="text-3xl md:text-4xl font-black text-white">{transition}</h3>
          <p className="text-slate-400 mt-3">Get ready... 3 seconds</p>
        </div>}
        {lives <= 0 && !transition && <div className="absolute inset-0 z-20 bg-slate-950/90 flex flex-col items-center justify-center"><h3 className="text-4xl font-black text-white">Game Over</h3><p className="text-slate-400 mt-2">Score: {score}</p><button onClick={reset} className="mt-5 bg-yellow-500 text-slate-900 font-bold px-6 py-3 rounded-xl">Play Again</button></div>}
        {items.map(item => <div key={item.id} className="absolute px-3 py-2 rounded-xl bg-slate-800 border border-yellow-500/40 text-yellow-300 font-bold shadow-lg transition-none" style={{left: `${item.x}%`, top: `${item.y}%`}}>{item.word}</div>)}
      </div>
      <form onSubmit={submit} className="mt-4 flex gap-3">
        <input ref={inputRef} autoFocus value={input} onFocus={() => setStarted(true)} onChange={e => setInput(e.target.value.toLowerCase())}
          onKeyDown={e => { if (e.key === ' ') { e.preventDefault(); submit(e as unknown as React.FormEvent); } }}
          placeholder="Type a falling word..." disabled={lives <= 0 || !!transition}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-yellow-500" />
        <button type="submit" disabled={lives <= 0 || !!transition} className="px-6 rounded-xl bg-yellow-500 text-slate-900 font-bold disabled:opacity-50">Type</button>
      </form>
      <p className="text-xs text-slate-500 mt-3">Type the falling word and press Space to submit. 10 correct words = next level.</p>
    </div>
  </GameShell>;
}

function TypingBlitz() {
  const [target, setTarget] = useState(randomWord);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [time, setTime] = useState(60);
  const [running, setRunning] = useState(false);
  const started = useRef(false);

  const reset = useCallback(() => { setTarget(randomWord()); setInput(''); setScore(0); setCorrect(0); setTime(60); setRunning(false); started.current = false; }, []);
  useEffect(() => {
    if (!running) return;
    if (time <= 0) { setRunning(false); return; }
    const t = setInterval(() => setTime(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [running, time]);

  const onChange = (value: string) => {
    if (!running && time > 0) setRunning(true);
    setInput(value.toLowerCase());
    if (value.toLowerCase().trim() === target && target) {
      setScore(s => s + target.length * 10); setCorrect(c => c + 1); setTarget(randomWord()); setInput('');
    }
  };

  return <GameShell title="Typing Blitz" subtitle="60 seconds. Type as many words as you can." onReset={reset}>
    <div className="p-8 text-center">
      <div className="flex justify-center gap-10 mb-10"><Stat label="Time" value={`${time}s`} /><Stat label="Words" value={correct} /><Stat label="Score" value={score} /></div>
      {time === 0 ? <div className="py-10"><h3 className="text-4xl font-black text-white">Time's Up!</h3><p className="text-slate-400 mt-2">{correct} words typed • {score} points</p><button onClick={reset} className="mt-6 bg-yellow-500 text-slate-900 font-bold px-6 py-3 rounded-xl">Play Again</button></div> :
      <><div className="text-5xl md:text-6xl font-black text-yellow-400 tracking-wide mb-8">{target}</div>
      <input autoFocus value={input} onChange={e => onChange(e.target.value)} disabled={time === 0} placeholder="Start typing..."
        className="w-full max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl px-6 py-5 text-2xl text-center text-white outline-none focus:border-yellow-500" />
      <p className="text-slate-500 text-sm mt-4">Timer starts with your first keystroke.</p></>}
    </div>
  </GameShell>;
}

function WordRace() {
  const sequence = useMemo(() => Array.from({length: 12}, randomWord), []);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const reset = () => { setIndex(0); setInput(''); setTime(30); setRunning(false); setFinished(false); };

  useEffect(() => {
    if (!running || finished) return;
    if (time <= 0) { setFinished(true); setRunning(false); return; }
    const t = setInterval(() => setTime(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [running, finished, time]);

  const change = (v: string) => {
    if (!running) setRunning(true);
    setInput(v.toLowerCase());
    if (v.trim().toLowerCase() === sequence[index]) {
      if (index === sequence.length - 1) { setFinished(true); setRunning(false); }
      else { setIndex(i => i + 1); setInput(''); }
    }
  };
  const progress = Math.round((index / sequence.length) * 100);

  return <GameShell title="Word Race" subtitle="Finish the word chain before 30 seconds runs out." onReset={reset}>
    <div className="p-8 max-w-4xl mx-auto">
      {finished ? <div className="text-center py-14"><Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-5"/><h3 className="text-4xl font-black text-white">{index >= sequence.length - 1 ? 'Race Complete!' : "Time's Up!"}</h3><p className="text-slate-400 mt-2">{Math.min(index + (index >= sequence.length - 1 ? 1 : 0), sequence.length)} / {sequence.length} words completed</p><button onClick={reset} className="mt-6 bg-yellow-500 text-slate-900 font-bold px-6 py-3 rounded-xl">Race Again</button></div> :
      <><div className="flex justify-between mb-3 text-sm font-semibold"><span className="text-yellow-400">Word {index + 1} / {sequence.length}</span><span className="text-cyan-400">{time}s</span></div>
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-10"><div className="h-full bg-yellow-500 transition-all" style={{width: `${progress}%`}} /></div>
      <div className="flex flex-wrap gap-2 justify-center mb-10">{sequence.map((w,i) => <span key={i} className={`px-3 py-2 rounded-lg text-sm ${i < index ? 'bg-green-500/20 text-green-400' : i === index ? 'bg-yellow-500 text-slate-900 font-bold' : 'bg-slate-800 text-slate-500'}`}>{w}</span>)}</div>
      <input autoFocus value={input} onChange={e => change(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-5 text-xl text-white text-center outline-none focus:border-yellow-500" placeholder="Type the highlighted word..." />
      <p className="text-center text-slate-500 text-sm mt-4">Timer starts when you begin typing.</p></>}
    </div>
  </GameShell>;
}

function Stat({label,value}:{label:string;value:React.ReactNode}) {
  return <div><div className="text-xs uppercase tracking-widest text-slate-500">{label}</div><div className="text-3xl font-black text-white mt-1">{value}</div></div>;
}
