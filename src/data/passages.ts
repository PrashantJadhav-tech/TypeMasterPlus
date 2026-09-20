export const passages = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet, which makes it a pangram.",
  "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages.",
  "TypeMasterPlus is designed to help you improve your typing speed and accuracy. Practice makes perfect, so keep typing to see your WPM grow over time.",
  "A journey of a thousand miles begins with a single step. Start small, stay consistent, and soon you will achieve the goals you have set for yourself.",
  "In computer science, functional programming is a programming paradigm where programs are constructed by applying and composing functions.",
  "The most important property of a program is whether it accomplishes the intention of its user.",
  "Simplicity is prerequisite for reliability. Complex systems are harder to maintain, debug, and scale.",
];

export function getRandomPassage() {
  const index = Math.floor(Math.random() * passages.length);
  return passages[index];
}
