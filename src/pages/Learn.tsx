import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Keyboard,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Zap,
  Clock3,
  GraduationCap,
  Flame,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Lesson = {
  id: number;
  level: string;
  title: string;
  subtitle: string;
  exercises: string[];
  tips: string[];
  focus: string;
};

const lessons: Lesson[] = [
  {
    id: 1,
    level: 'Beginner',
    title: 'Home Row Fundamentals',
    subtitle:
      'Build strong finger placement with ASDF and JKL; before moving ahead.',
    focus: 'ASDF + JKL;',
    tips: [
      'Keep the left hand on A S D F and right hand on J K L ;.',
      'Both thumbs should rest naturally near the spacebar.',
      'Accuracy and relaxed fingers are more important than speed.',
      'Complete all 3 practice rounds before marking the lesson complete.',
    ],
    exercises: [
      'asdf jkl; asdf jkl; fdsa ;lkj asdf jkl; aaaa ssss dddd ffff jjjj kkkk llll ;;;; asdf asdf jkl; jkl; fdsa lk j; asdf jkl; fds a jkl; a s d f j k l ; asdf jkl; asdf jkl; fdsa ;lkj. Repeat the home row groups slowly and keep every finger close to its starting position. Do not look down at the keyboard. Return each finger to the home row after every movement.',
      'asdf jkl; jkl; asdf fdsa ;lkj fads jkl; asdf jkl; aaaa ssss dddd ffff jjjj kkkk llll ;;;; aa ss dd ff jj kk ll ;; asdf fdsa jkl; ;lkj asdf jkl; fdsa lk j; sad fads jkl; ask lad fall; dad sad; all fall; flask; ask; add; lad; salad; Practice these groups at a calm pace. If one finger becomes confused, stop, place both hands correctly, and start the group again.',
      'a s d f   j k l ;   asdf jkl;   fdsa ;lkj   asdf asdf jkl; jkl;   fads lad ask fall salad;   all dads ask;   sad lad;   flask falls;   a lad asks;   all fall;   Repeat this complete drill several times. Your goal is not a high WPM. Your goal is to make the home-row movement feel natural so that your fingers can find the keys without looking.',
    ],
  },
  {
    id: 2,
    level: 'Beginner',
    title: 'Top Row & Home Row Reach',
    subtitle:
      'Learn QWERTY top-row movement while returning to the home position.',
    focus: 'Q W E R T + Y U I O P',
    tips: [
      'Reach from the home row; do not lift the whole hand.',
      'Return to the home row after each reach.',
      'Keep your eyes on the text instead of your fingers.',
      'Repeat difficult key combinations until they feel automatic.',
    ],
    exercises: [
      'qwer tyui op qwer tyui qwer asdf tyui jkl; we er rt yu ui io op qw we er rt ty yu ui io op. Move slowly from the home row to the top row and back. Keep your wrist steady and let the fingers do the work. qwer qwer tyui tyui asdf asdf jkl; jkl; qwer asdf tyui jkl; qwer asdf tyui jkl; Practice the same patterns again without looking down.',
      'we were write water word work world tree three true quiet quite quick queen question type typing top stop step open people power. qwer tyui op; qwer asdf tyui jkl; The quick brown fox jumps over the lazy dog. Practice common words slowly, then repeat them with a smoother rhythm. If you miss a key, reduce speed and focus on the correct finger.',
      'qwerty qwerty uiop uiop qwer tyui asdf jkl; quiet quick quality water write worker computer keyboard student project practice. Every word is a combination of familiar finger movements. Read a few words ahead, keep your shoulders relaxed, and return your fingers to the home row after each reach. Repeat this round until the top-row keys feel comfortable.',
    ],
  },
  {
    id: 3,
    level: 'Beginner',
    title: 'Bottom Row & Full Alphabet',
    subtitle:
      'Add Z X C V B N M and combine all three letter rows.',
    focus: 'Z X C V B N M',
    tips: [
      'Use the correct finger for each bottom-row key.',
      'Keep your palms still and move only the needed fingers.',
      'Slow down on unfamiliar combinations.',
      'Mix all three rows so your hands learn real movement.',
    ],
    exercises: [
      'zxcv bnm, zxcv bnm, zxcv asdf bnm, jkl; cvcv vbbn nmnm mmmm zzzz xxxx cccc vvvv bbbb nnnn mmmm. Reach down from the home row and immediately return. Do not look at your hands. Practice the bottom row in small groups and keep the movement relaxed.',
      'zoo box mix wax quiz jump zebra cabin brown black calm move brave amazing maximum minimum example problem quick fox van can man name home some time come. Combine top, middle, and bottom rows into real words. Type each word carefully and use one clean space between words. Repeat the word groups until you can type them without hesitation.',
      'quick brown fox jumps over the lazy dog; every letter can be found with correct finger movement. The keyboard has three main letter rows, and strong typists move between them without thinking about every individual key. Practice alphabet patterns, short words, and full sentences. Stay accurate and let speed develop naturally.',
    ],
  },
  {
    id: 4,
    level: 'Easy',
    title: 'Words, Spaces & Rhythm',
    subtitle:
      'Turn individual keys into smooth words and consistent typing rhythm.',
    focus: 'Words + spacing',
    tips: [
      'Use one space between words.',
      'Read one or two words ahead when possible.',
      'Do not rush the first few words of a sentence.',
      'Keep the same comfortable rhythm for longer passages.',
    ],
    exercises: [
      'the and you are for with this that have from they will your what there about which their would these other words typing learn practice skill speed accuracy good work fast hands calm mind daily practice makes typing easier. Type each word as a complete unit and keep your spaces consistent. Try not to pause after every word.',
      'computer keyboard student college future project website coding practice progress accuracy speed lesson learning morning evening simple useful important regular comfortable confident. Good typing comes from regular practice. A calm typist keeps the eyes on the text and lets the fingers move naturally. Repeat this paragraph while keeping your rhythm steady.',
      'Learning to type well takes patience and practice. Small improvements repeated every day can become strong habits. Keep your hands relaxed, look at the screen, and avoid checking the keyboard. If you make a mistake, stay calm and continue. Your goal is smooth, accurate typing from the beginning of the sentence to the end.',
    ],
  },
  {
    id: 5,
    level: 'Easy',
    title: 'Capital Letters & Punctuation',
    subtitle:
      'Use Shift and common punctuation confidently in real sentences.',
    focus: 'Shift + punctuation',
    tips: [
      'Use the opposite hand for Shift when possible.',
      'Release Shift after the capital letter.',
      'Watch commas, full stops, apostrophes and question marks.',
      'Keep spacing consistent around punctuation.',
    ],
    exercises: [
      'Typing is a skill, and every skill improves with practice. Can you type this sentence correctly? Yes, you can! Keep learning, keep practicing, and stay accurate. A calm typist makes fewer mistakes. Today, we will practice English sentences, capital letters, and punctuation. Remember: accuracy comes first.',
      'My goal is to improve slowly. What should I do when I make a mistake? Stay calm and continue. "Practice" builds confidence; accuracy builds speed. Do not rush, and do not look down at the keyboard. Use Shift with the opposite hand when possible, then return to the home row.',
      'Typing is useful for college work, coding, applications, reports, emails, and everyday communication. In 2026, digital skills are important for students and professionals. Practice commas, full stops, question marks, apostrophes, colons, and semicolons carefully. Read the sentence first, then type it with a steady rhythm.',
    ],
  },
  {
    id: 6,
    level: 'Intermediate',
    title: 'Numbers & Special Characters',
    subtitle:
      'Build confidence with numbers, symbols, email, code and data-entry patterns.',
    focus: 'Numbers + symbols',
    tips: [
      'Learn the number row gradually instead of rushing.',
      'Keep your eyes on the screen.',
      'Treat every digit as important in data-entry practice.',
      'Practice common symbols until they stop interrupting your rhythm.',
    ],
    exercises: [
      '2026 12345 67890 10 20 30 40 50 100 250 500 1000 2026 123 456 789. Practice number groups slowly and keep the fingers controlled. Repeat the groups several times. 12 34 56 78 90; 111 222 333 444 555; 101 202 303 404 505.',
      'email@example.com user123@example.com total = 250 + 50 score: 98% speed: 40 WPM code_101 price $499 discount 20% room 7 floor 3 date 18/09/2026 marks 42/50 8GB RAM i5-6500 HTML/CSS/JS Python 3.12. Type every symbol carefully and keep the spacing readable.',
      'Numbers and symbols are important in modern typing. Students use them in assignments, programmers use them in code, and office workers use them in reports and spreadsheets. One wrong digit can change a result. Practice 10 + 20 = 30, 50 - 15 = 35, 5 * 5 = 25, and 100 / 4 = 25. Stay relaxed and accurate.',
    ],
  },
  {
    id: 7,
    level: 'Intermediate',
    title: 'Sentence & Paragraph Flow',
    subtitle:
      'Move from drills to continuous paragraphs without losing rhythm.',
    focus: 'Continuous typing',
    tips: [
      'Read several words ahead before typing them.',
      'Keep punctuation from breaking your rhythm.',
      'Relax shoulders and wrists during long passages.',
      'If you make an error, recover calmly and continue.',
    ],
    exercises: [
      'Typing practice becomes easier when your hands learn a natural rhythm. A good typist keeps the eyes on the text and the fingers on the keyboard. Regular practice improves accuracy, confidence, and speed. Do not rush every sentence; instead, build a smooth and reliable typing flow. With patience, difficult words become familiar and common patterns become automatic.',
      'Before you begin, sit comfortably and place your fingers correctly. Read several words ahead, then type without unnecessary pauses. If you make a mistake, stay calm and continue. Keep your shoulders relaxed and avoid pressing the keys too hard. Long passages are useful because they teach you to maintain the same pace for several minutes.',
      'Typing can become a valuable everyday skill. It helps with college work, coding projects, applications, office tasks, online forms, and communication. The more you practice correctly, the more automatic your finger movements become. Focus on control first, consistency second, and speed later. Repeat this lesson until the paragraph flow feels natural.',
    ],
  },
  {
    id: 8,
    level: 'Hard',
    title: 'Speed Building & Accuracy',
    subtitle:
      'Increase pace through controlled repetition instead of sacrificing accuracy.',
    focus: 'Speed + accuracy',
    tips: [
      'Start at a comfortable speed and increase gradually.',
      'If errors increase sharply, slow down and rebuild control.',
      'Relax your shoulders and wrists during speed work.',
      'Use repeated rounds to make common patterns automatic.',
    ],
    exercises: [
      'Fast typing is built through accurate repetition. Start slowly, find a comfortable rhythm, and then increase your pace. Keep your fingers close to the keyboard and avoid unnecessary movement. When you feel tension, slow down, relax your shoulders, and continue. Consistent daily practice is more valuable than one very fast session.',
      'Round one: type slowly and aim for clean accuracy. Round two: increase your pace slightly while keeping mistakes low. Round three: type the same passage at a comfortable challenge speed. Round four: return to a controlled pace and focus on smoothness. Speed should feel natural, not forced.',
      'A focused student can improve typing through regular practice. Every session should have a clear purpose. Sometimes you train accuracy, sometimes rhythm, and sometimes speed. Small improvements repeated every day can produce strong results over time. Stay patient, stay relaxed, and keep your fingers moving with confidence.',
    ],
  },
  {
    id: 9,
    level: 'Hard',
    title: 'Exam-Style Practice',
    subtitle:
      'Prepare for longer typing tests with stable pace and clean accuracy.',
    focus: 'Exam technique',
    tips: [
      'Do not race during the first minute of a test.',
      'Maintain a pace you can hold until the end.',
      'Watch spacing and punctuation carefully.',
      'If an error happens, stay calm and continue.',
    ],
    exercises: [
      'Typing tests require concentration, consistency, and patience. Before starting, sit comfortably and place your fingers correctly. Read the passage carefully and begin at a pace you can maintain. Keep your eyes on the text, use the correct fingers, and avoid looking down at the keyboard. Your goal is accurate, steady performance from beginning to end.',
      'In a real test, the first minute should not be a race. Find your rhythm and settle into a comfortable pace. During the middle of the test, maintain that pace and watch your spacing. Near the end, do not panic or suddenly type much faster. Finish carefully and protect your accuracy.',
      'Computer skills are increasingly important for students and professionals. Good typing helps people write assignments, create reports, enter data, communicate online, and work with software efficiently. A trained typist does not need to search for every key. Instead, the fingers move naturally while the eyes stay focused on the words. Treat this round like a mini exam.',
    ],
  },
  {
    id: 10,
    level: 'Advanced',
    title: 'Typing Academy Final Challenge',
    subtitle:
      'Combine everything: letters, capitals, punctuation, numbers and long-form typing.',
    focus: 'Mastery',
    tips: [
      'Accuracy remains the foundation of advanced typing.',
      'Read ahead and keep a stable rhythm.',
      'Do not look down at the keyboard.',
      'Compare your accuracy and comfortable speed with earlier lessons.',
      'After finishing, keep practicing regularly to maintain the skill.',
    ],
    exercises: [
      'Technology changes quickly, but strong typing remains a valuable skill. A confident typist can focus more on ideas and less on finding keys. Continue practicing every day, challenge yourself with longer passages, and gradually increase your target speed. Accuracy should remain your foundation. When your hands know the keyboard, writing becomes smoother, faster, and more comfortable.',
      'In 2026, students can use typing skills for college projects, coding, online applications, reports, emails, spreadsheets, and many other tasks. A reliable typing speed of 30 WPM, 40 WPM, or 50 WPM is useful only when accuracy is strong. Try to maintain clean spacing, correct capitalization, and punctuation throughout the entire passage. If a mistake happens, recover calmly and continue.',
      'Final challenge: Build your own rhythm. Read ahead. Keep your fingers relaxed. Do not look down. If you make a mistake, recover calmly. Continue typing until the passage is complete. Review your result and compare it with your earlier lessons. Your progress is the result of consistent practice, not one perfect attempt. Keep learning, keep improving, and use your typing skills in study, work, coding, and everyday life. Congratulations on reaching the final lesson!',
    ],
  },
];

const STORAGE_KEY = 'typemasterplus_learn_progress_v2';

export function Learn() {
  const [completed, setCompleted] = useState<number[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
    } catch {
      return [];
    }
  });

  const [selected, setSelected] = useState(0);
  const [stage, setStage] = useState(0);
  const [input, setInput] = useState('');
  const [lastKey, setLastKey] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const lesson = lessons[selected];
  const exercise = lesson.exercises[stage];

  const exerciseDone = input === exercise;
  const isComplete = completed.includes(lesson.id);

  const progress = Math.round(
    (completed.length / lessons.length) * 100
  );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(completed)
    );
  }, [completed]);

  useEffect(() => {
    setInput('');
    setStage(0);
    setLastKey('');

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 60);

    return () => clearTimeout(timer);
  }, [selected]);

  const currentKey =
    input.length < exercise.length
      ? exercise[input.length]
      : '';

  const keys = useMemo(
    () => [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
      ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
      ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
      ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl'],
    ],
    []
  );

  const completeLesson = () => {
    if (
      stage === 2 &&
      exerciseDone &&
      !completed.includes(lesson.id)
    ) {
      setCompleted((prev) => [...prev, lesson.id]);
    }
  };

  const nextStage = () => {
    if (!exerciseDone) return;

    if (stage < 2) {
      setStage((prev) => prev + 1);
      setInput('');
      setLastKey('');

      setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
    } else {
      completeLesson();
    }
  };

  const selectLesson = (index: number) => {
    setSelected(index);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const resetRound = () => {
    setInput('');
    setLastKey('');

    setTimeout(() => {
      inputRef.current?.focus();
    }, 60);
  };

  const completedCount = completed.length;
  const remainingCount = lessons.length - completedCount;

  return (
    <div className="w-full">

      {/* ========================================
          HEADER
      ======================================== */}

      <section className="relative overflow-hidden pb-8 pt-4 sm:pb-10 sm:pt-6">

        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="text-center">

          <div className="pro-badge mb-4 inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Typing Academy
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Learn Typing from{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Basic to Advanced
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            10 structured lessons, 3 practice rounds per lesson,
            live keyboard guidance, useful tips and progress tracking.
          </p>

        </div>

      </section>


      {/* ========================================
          PROGRESS OVERVIEW
      ======================================== */}

      <section className="pro-card mb-6 p-5 sm:p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="font-bold text-white">
                Your Learning Progress
              </p>

              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                {completedCount} of {lessons.length} lessons completed
                {remainingCount > 0
                  ? ` · ${remainingCount} remaining`
                  : ' · Academy completed'}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-5">

            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-500">
                Overall progress
              </p>

              <p className="text-xl font-black text-yellow-400">
                {progress}%
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10 text-sm font-black text-yellow-400 sm:hidden">
              {progress}%
            </div>

          </div>

        </div>

        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />

        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
          <span>Beginner</span>
          <span>Intermediate</span>
          <span>Advanced</span>
        </div>

      </section>


      {/* ========================================
          MAIN LEARNING AREA
      ======================================== */}

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">

        {/* LESSON SIDEBAR */}

        <aside className="pro-card h-fit p-3 lg:sticky lg:top-24">

          <div className="flex items-center justify-between px-3 py-3">

            <div className="flex items-center gap-2 font-bold text-white">
              <BookOpen className="h-5 w-5 text-yellow-400" />
              Lessons
            </div>

            <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-500">
              {completedCount}/{lessons.length}
            </span>

          </div>

          <div className="space-y-1">

            {lessons.map((item, index) => {

              const selectedLesson = index === selected;
              const completedLesson = completed.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectLesson(index)}
                  className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 ${
                    selectedLesson
                      ? 'bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/10'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      selectedLesson
                        ? 'bg-slate-950/10'
                        : completedLesson
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {completedLesson ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      item.id
                    )}
                  </span>

                  <span className="min-w-0 flex-1">

                    <span className="block truncate text-sm font-semibold">
                      {item.title}
                    </span>

                    <span
                      className={`mt-0.5 block text-[11px] ${
                        selectedLesson
                          ? 'text-slate-800/70'
                          : 'text-slate-600'
                      }`}
                    >
                      {item.level}
                    </span>

                  </span>

                  {selectedLesson && (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}

                </button>
              );
            })}

          </div>

        </aside>


        {/* LESSON CONTENT */}

        <main className="min-w-0">

          <section className="pro-card overflow-hidden p-5 sm:p-6 md:p-8">

            {/* Lesson Header */}

            <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-start sm:justify-between">

              <div className="min-w-0">

                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-yellow-400">
                  <Zap className="h-4 w-4" />
                  Lesson {lesson.id} · {lesson.level}
                </div>

                <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {lesson.title}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  {lesson.subtitle}
                </p>

              </div>

              {isComplete && (
                <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                </div>
              )}

            </div>


            {/* Round Progress */}

            <div className="mt-6">

              <div className="mb-3 flex items-center justify-between gap-3">

                <span className="text-sm font-bold text-white">
                  Practice Round {stage + 1} of 3
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" />
                  Long-form practice
                </span>

              </div>

              <div className="flex gap-1.5">

                {[0, 1, 2].map((round) => (
                  <div
                    key={round}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      round <= stage
                        ? 'bg-yellow-500'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}

              </div>

            </div>


            {/* Typing Exercise */}

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-6">

              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <Keyboard className="h-4 w-4 text-yellow-400" />
                  Type this exactly
                </div>

                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Accuracy First
                </span>

              </div>

              <div className="max-h-64 overflow-y-auto rounded-xl bg-slate-900/50 p-4 sm:p-5">

                <div className="font-mono text-sm leading-7 text-slate-300 sm:text-base sm:leading-8 md:text-lg">

                  {exercise.split('').map((char, index) => {

                    const typed = index < input.length;
                    const current = index === input.length;

                    return (
                      <span
                        key={index}
                        className={
                          typed
                            ? input[index] === char
                              ? 'text-emerald-400'
                              : 'rounded bg-red-500/10 text-red-400'
                            : current
                            ? 'text-yellow-300 underline decoration-yellow-400 decoration-2 underline-offset-4'
                            : 'text-slate-400'
                        }
                      >
                        {char}
                      </span>
                    );
                  })}

                </div>

              </div>


              <input
                ref={inputRef}
                value={input}
                onChange={(event) => {
                  const value = event.target.value.slice(
                    0,
                    exercise.length
                  );

                  setInput(value);

                  if (value) {
                    setLastKey(value[value.length - 1]);
                  }
                }}
                onKeyDown={(event) => {
                  setLastKey(event.key);
                }}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/10 sm:text-base"
                placeholder="Start typing here..."
              />

              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-slate-600 sm:text-xs">

                <span>
                  Next key:{' '}
                  <b className="text-yellow-400">
                    {currentKey === ' '
                      ? 'SPACE'
                      : currentKey || '—'}
                  </b>
                </span>

                <span className="hidden sm:inline">•</span>

                <span>
                  {input.length}/{exercise.length} characters
                </span>

                {lastKey && (
                  <>
                    <span className="hidden sm:inline">•</span>

                    <span>
                      Last key:{' '}
                      <b className="text-emerald-400">
                        {lastKey === ' '
                          ? 'SPACE'
                          : lastKey}
                      </b>
                    </span>
                  </>
                )}

              </div>

            </div>


            {/* LIVE KEYBOARD */}

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 sm:p-6">

              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <h3 className="flex items-center gap-2 font-bold text-white">
                  <Keyboard className="h-5 w-5 text-yellow-400" />
                  Live Keyboard
                </h3>

                <span className="text-[11px] text-slate-600 sm:text-xs">
                  The next required key is highlighted
                </span>

              </div>

              <div className="space-y-1.5 overflow-x-auto pb-1">

                {keys.map((row, rowIndex) => (

                  <div
                    key={rowIndex}
                    className={`flex min-w-max justify-center gap-1 ${
                      rowIndex === 4
                        ? 'px-12'
                        : ''
                    }`}
                  >

                    {row.map((key, keyIndex) => {

                      const active =
                        !!currentKey &&
                        (
                          (
                            key.length === 1 &&
                            key.toLowerCase() ===
                              currentKey.toLowerCase()
                          ) ||
                          (
                            key === 'Space' &&
                            currentKey === ' '
                          )
                        );

                      const wideKeys = [
                        'Backspace',
                        'Tab',
                        'Caps',
                        'Enter',
                        'Shift',
                        'Ctrl',
                        'Alt',
                      ];

                      const wide = wideKeys.includes(key);

                      return (
                        <div
                          key={`${rowIndex}-${keyIndex}`}
                          className={`flex h-9 shrink-0 items-center justify-center rounded-lg border text-[9px] font-bold transition-all sm:h-10 sm:text-[10px] md:h-11 md:text-xs ${
                            wide
                              ? 'min-w-[45px] px-2 sm:min-w-[55px] sm:px-3'
                              : key === 'Space'
                              ? 'w-32 sm:w-48 md:w-64'
                              : 'w-8 sm:w-10 md:w-11'
                          } ${
                            active
                              ? 'scale-105 border-yellow-400 bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/20'
                              : 'border-slate-700 bg-slate-800 text-slate-500'
                          }`}
                        >
                          {key}
                        </div>
                      );
                    })}

                  </div>

                ))}

              </div>

            </div>


            {/* TIPS + FOCUS */}

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">

                <h3 className="mb-4 flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                  Lesson Tips
                </h3>

                <ul className="space-y-3">

                  {lesson.tips.map((tip) => (
                    <li
                      key={tip}
                      className="flex gap-2.5 text-sm leading-5 text-slate-500"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                      <span>{tip}</span>
                    </li>
                  ))}

                </ul>

              </div>


              <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">

                <h3 className="mb-4 flex items-center gap-2 font-bold text-white">
                  <Target className="h-5 w-5 text-yellow-400" />
                  Current Focus
                </h3>

                <p className="text-2xl font-black text-yellow-400">
                  {lesson.focus}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Complete all 3 rounds. Each lesson is intentionally
                  designed as longer practice so you build real typing
                  consistency instead of only chasing speed.
                </p>

              </div>

            </div>


            {/* ROUND COMPLETE */}

            {exerciseDone && !isComplete && (
              <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center">

                <Trophy className="mx-auto mb-2 h-8 w-8 text-emerald-400" />

                <h3 className="text-lg font-black text-white">
                  Round {stage + 1} complete 🎉
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {stage < 2
                    ? 'Continue to the next practice round.'
                    : 'All 3 rounds are complete. Finish the lesson to save your progress.'}
                </p>

              </div>
            )}


            {/* LESSON COMPLETE */}

            {isComplete && (
              <div className="mt-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-center">

                <Trophy className="mx-auto mb-2 h-8 w-8 text-yellow-400" />

                <h3 className="text-lg font-black text-white">
                  Congratulations! 🎉
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  You completed Lesson {lesson.id}. Keep going!
                </p>

              </div>
            )}


            {/* CONTROLS */}

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-800/80 pt-5 sm:flex-row sm:items-center sm:justify-between">

              <button
                type="button"
                disabled={selected === 0}
                onClick={() => selectLesson(selected - 1)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="grid grid-cols-2 gap-2 sm:flex">

                <button
                  type="button"
                  onClick={resetRound}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>

                {!isComplete && (
                  <button
                    type="button"
                    disabled={!exerciseDone}
                    onClick={nextStage}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {stage < 2
                      ? 'Next Round'
                      : 'Complete Lesson'}
                  </button>
                )}

                <button
                  type="button"
                  disabled={selected === lessons.length - 1}
                  onClick={() => selectLesson(selected + 1)}
                  className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30 sm:col-span-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>

              </div>

            </div>

          </section>

        </main>

      </div>


      {/* ========================================
          ACADEMY COMPLETED
      ======================================== */}

      {completed.length === lessons.length && (
        <section className="mt-6 overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-emerald-500/10 p-7 text-center sm:p-9">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-400">
            <Trophy className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
            Typing Academy Completed! 🎉
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Congratulations! You finished all 10 detailed lessons.
            Continue practicing to maintain and improve your skills.
          </p>

          <Link
            to="/practice"
            className="pro-btn pro-btn-primary mt-6 inline-flex items-center gap-2 px-6 py-3"
          >
            <Flame className="h-5 w-5" />
            Start Typing Practice
            <ChevronRight className="h-4 w-4" />
          </Link>

        </section>
      )}

    </div>
  );
}