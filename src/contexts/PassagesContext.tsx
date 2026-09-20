import React, { createContext, useContext, useState, useEffect } from 'react';

export type Passage = {
  id: string;
  title: string;
  text: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

const defaultPassages: Passage[] = [
  { id: '1', title: 'The Fox', text: "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet, which makes it a pangram.", category: 'General', difficulty: 'Easy' },
  { id: '2', title: 'Programming', text: "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages.", category: 'Coding', difficulty: 'Medium' },
  { id: '3', title: 'TypeMaster', text: "TypeMasterPlus is designed to help you improve your typing speed and accuracy. Practice makes perfect, so keep typing to see your WPM grow over time.", category: 'General', difficulty: 'Easy' },
  { id: '4', title: 'Journey', text: "A journey of a thousand miles begins with a single step. Start small, stay consistent, and soon you will achieve the goals you have set for yourself.", category: 'Motivational', difficulty: 'Easy' },
  { id: '5', title: 'Functional Programming', text: "In computer science, functional programming is a programming paradigm where programs are constructed by applying and composing functions.", category: 'Coding', difficulty: 'Medium' },
  { id: '6', title: 'Program Property', text: "The most important property of a program is whether it accomplishes the intention of its user.", category: 'Coding', difficulty: 'Medium' },
  { id: '7', title: 'Simplicity', text: "Simplicity is prerequisite for reliability. Complex systems are harder to maintain, debug, and scale.", category: 'Coding', difficulty: 'Hard' },
];

type PassagesContextType = {
  passages: Passage[];
  addPassage: (passage: Omit<Passage, 'id'>) => void;
  updatePassage: (id: string, passage: Omit<Passage, 'id'>) => void;
  deletePassage: (id: string) => void;
  getRandomPassage: () => Passage;
  setCurrentPassageId: (id: string | null) => void;
  currentPassageId: string | null;
};

const PassagesContext = createContext<PassagesContextType | undefined>(undefined);

export function PassagesProvider({ children }: { children: React.ReactNode }) {
  const [passages, setPassages] = useState<Passage[]>(() => {
    const stored = localStorage.getItem('typemaster_passages');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return defaultPassages;
      }
    }
    return defaultPassages;
  });

  const [currentPassageId, setCurrentPassageId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('typemaster_passages', JSON.stringify(passages));
  }, [passages]);

  const addPassage = (passage: Omit<Passage, 'id'>) => {
    const newPassage = { ...passage, id: crypto.randomUUID() };
    setPassages(prev => [...prev, newPassage]);
  };

  const updatePassage = (id: string, updated: Omit<Passage, 'id'>) => {
    setPassages(prev => prev.map(p => p.id === id ? { ...updated, id } : p));
  };

  const deletePassage = (id: string) => {
    setPassages(prev => prev.filter(p => p.id !== id));
    if (currentPassageId === id) {
      setCurrentPassageId(null);
    }
  };

  const getRandomPassage = () => {
    if (passages.length === 0) return defaultPassages[0];
    const index = Math.floor(Math.random() * passages.length);
    return passages[index];
  };

  return (
    <PassagesContext.Provider value={{ 
      passages, addPassage, updatePassage, deletePassage, 
      getRandomPassage, currentPassageId, setCurrentPassageId 
    }}>
      {children}
    </PassagesContext.Provider>
  );
}

export function usePassages() {
  const context = useContext(PassagesContext);
  if (context === undefined) {
    throw new Error('usePassages must be used within a PassagesProvider');
  }
  return context;
}
