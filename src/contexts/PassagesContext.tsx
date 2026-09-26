import React, { createContext, useContext, useState, useEffect } from 'react';

export type Passage = {
  id: string;
  title: string;
  text: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: 'english' | 'marathi'; // language field add kela
};

const defaultPassages: Passage[] = [
  // --- English Passages ---
  { 
    id: '1', 
    title: 'The Fox', 
    text: "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet, which makes it a pangram.", 
    category: 'General', 
    difficulty: 'Easy',
    language: 'english' 
  },
  { 
    id: '2', 
    title: 'Programming', 
    text: "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages.", 
    category: 'Coding', 
    difficulty: 'Medium',
    language: 'english' 
  },
  { 
    id: '3', 
    title: 'TypeMaster', 
    text: "TypeMasterPlus is designed to help you improve your typing speed and accuracy. Practice makes perfect, so keep typing to see your WPM grow over time.", 
    category: 'General', 
    difficulty: 'Easy',
    language: 'english' 
  },
  { 
    id: '4', 
    title: 'Journey', 
    text: "A journey of a thousand miles begins with a single step. Start small, stay consistent, and soon you will achieve the goals you have set for yourself.", 
    category: 'Motivational', 
    difficulty: 'Easy',
    language: 'english' 
  },
  { 
    id: '5', 
    title: 'Functional Programming', 
    text: "In computer science, functional programming is a programming paradigm where programs are constructed by applying and composing functions.", 
    category: 'Coding', 
    difficulty: 'Medium',
    language: 'english' 
  },
  { 
    id: '6', 
    title: 'Program Property', 
    text: "The most important property of a program is whether it accomplishes the intention of its user.", 
    category: 'Coding', 
    difficulty: 'Medium',
    language: 'english' 
  },
  { 
    id: '7', 
    title: 'Simplicity', 
    text: "Simplicity is prerequisite for reliability. Complex systems are harder to maintain, debug, and scale.", 
    category: 'Coding', 
    difficulty: 'Hard',
    language: 'english' 
  },

  // --- Marathi Passages ---
  { 
    id: 'mr-1', 
    title: 'छत्रपती शिवाजी महाराज', 
    text: "छत्रपती शिवाजी महाराज हे एक महान आणि पराक्रमी राजे होते. त्यांनी रयतेच्या कल्याणासाठी स्वराज्य स्थापन केले. त्यांची युद्धनीती आणि नेतृत्व आजही प्रेरणादायी आहे.", 
    category: 'इतिहास', 
    difficulty: 'Easy',
    language: 'marathi' 
  },
  { 
    id: 'mr-2', 
    title: 'आपला भारत देश', 
    text: "भारत हा एक विविधतेने नटलेला महान देश आहे. येथे विविध भाषा, धर्म आणि संस्कृतीचे लोक गुण्यागोविंदाने राहतात. भारताचा इतिहास आणि संस्कृती अत्यंत समृद्ध आहे.", 
    category: 'सामान्य ज्ञान', 
    difficulty: 'Easy',
    language: 'marathi' 
  },
  { 
    id: 'mr-3', 
    title: 'तंत्रज्ञानाचे महत्त्व', 
    text: "आजच्या युगात संगणक आणि तंत्रज्ञान आपल्या जीवनाचा अविभाज्य भाग बनले आहेत. संगणकामुळे अनेक कठीण कामे जलद गतीने आणि अचूकपणे पूर्ण करता येतात.", 
    category: 'तंत्रज्ञान', 
    difficulty: 'Medium',
    language: 'marathi' 
  },
  { 
    id: 'mr-4', 
    title: 'परिश्रमाचे फळ', 
    text: "यशाची खरी गुरुकिल्ली म्हणजे सातत्य आणि कठोर परिश्रम होय. आयुष्यात कोणतेही ध्येय साध्य करण्यासाठी मनापासून प्रयत्न करणे आणि सकारात्मक राहणे अत्यंत आवश्यक असते.", 
    category: 'प्रेरणादायी', 
    difficulty: 'Medium',
    language: 'marathi' 
  }
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
    // Versioned key vaparli ahe jyamule Marathi passages laglyach reload hotil
    const stored = localStorage.getItem('typemaster_passages_v2');
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
    localStorage.setItem('typemaster_passages_v2', JSON.stringify(passages));
  }, [passages]);

  const addPassage = (passage: Omit<Passage, 'id'>) => {
    const newPassage: Passage = { ...passage, id: crypto.randomUUID() };
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