export interface Checker {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export const checkers: Checker[] = [
  { id: "nonchalant", emoji: "🧊", title: "Nonchalant Checker", description: "How unbothered are you really? No cap." },
  { id: "brainrot", emoji: "🧠", title: "Brainrot Checker", description: "How deep is the brainrot? We'll find out." },
  { id: "aura", emoji: "✨", title: "Aura Checker", description: "Do you radiate aura or are you aura-negative?" },
  { id: "delulu", emoji: "💀", title: "Delulu Checker", description: "Are you the main character or fully delusional?" },
  { id: "cooked", emoji: "🔥", title: "Cooked Checker", description: "Are you functioning or fully cooked?" },
];