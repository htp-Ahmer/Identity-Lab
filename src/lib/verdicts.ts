export const verdictSystems: Record<string, { min: number; max: number; title: string; description: string }[]> = {
  nonchalant: [
    { min: 0, max: 29, title: "Lowkey Sensitive", description: "You care more than you let on. That's not a bad thing." },
    { min: 30, max: 49, title: "Selective Chill", description: "Unbothered about some things, deeply bothered by others." },
    { min: 50, max: 69, title: "Balanced", description: "You handle it well — most of the time, anyway." },
    { min: 70, max: 84, title: "Ice Energy", description: "Things barely touch you. You've got a natural force field." },
    { min: 85, max: 100, title: "Untouchable", description: "Certified nonchalant. Completely unbothered at all times." }
  ],
  brainrot: [
    { min: 0, max: 29, title: "Touch Grass Award", description: "You're somehow still connected to reality. Rare." },
    { min: 30, max: 49, title: "Mild Corruption", description: "The brainrot has started but you can still be saved." },
    { min: 50, max: 69, title: "Mid-Level Rotten", description: "You're fluent in internet but you still function in real life." },
    { min: 70, max: 84, title: "Advanced Brainrot", description: "You think in memes and speak in references. It's impressive." },
    { min: 85, max: 100, title: "Full Brainrot", description: "You are the internet. The internet is you. No cure possible." }
  ],
  aura: [
    { min: 0, max: 29, title: "Aura-Negative", description: "Your aura is in debt. Time to start accumulating." },
    { min: 30, max: 49, title: "Background Character", description: "You have aura but it's shy. Bring it forward." },
    { min: 50, max: 69, title: "Aura Present", description: "You radiate something. People notice when you enter." },
    { min: 70, max: 84, title: "High Aura", description: "Your presence shifts the energy in any room." },
    { min: 85, max: 100, title: "Aura Maxed Out", description: "Your aura arrives before you do. Legendary." }
  ],
  delulu: [
    { min: 0, max: 29, title: "Painfully Realistic", description: "You see things as they are. Refreshing but sad." },
    { min: 30, max: 49, title: "Grounded Dreamer", description: "You have hopes but still live in the real world." },
    { min: 50, max: 69, title: "Selectively Delulu", description: "Delulu when you need to be. The strategy is working." },
    { min: 70, max: 84, title: "Certified Delulu", description: "Your delusion is a coping mechanism and it's effective." },
    { min: 85, max: 100, title: "Peak Main Character", description: "Reality doesn't apply to you. You live in your own movie." }
  ],
  cooked: [
    { min: 0, max: 29, title: "Surprisingly Functioning", description: "You have it more together than most. Don't ruin it." },
    { min: 30, max: 49, title: "Medium Rare", description: "Things are chaotic but you're still technically standing." },
    { min: 50, max: 69, title: "Well Done", description: "You're cooked but somehow still showing up." },
    { min: 70, max: 84, title: "Fully Cooked", description: "Your life is on fire and you're debating playlists." },
    { min: 85, max: 100, title: "Absolutely Destroyed", description: "You are the chaos. Chaos is not managing itself." }
  ]
};