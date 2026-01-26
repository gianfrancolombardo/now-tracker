export const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#84cc16', // Lime
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#64748b', // Slate
  '#71717a', // Zinc
  '#a1a1aa', // Gray
];

// Rich library for search functionality
export const EMOJI_LIBRARY = [
  // Productivity & Work
  { char: '💻', tags: ['work', 'computer', 'code', 'laptop', 'dev'] },
  { char: '💼', tags: ['work', 'business', 'office', 'job'] },
  { char: '📝', tags: ['write', 'note', 'study', 'journal'] },
  { char: '🧠', tags: ['focus', 'think', 'brain', 'learn'] },
  { char: '📊', tags: ['analytics', 'chart', 'data', 'stats'] },
  { char: '📅', tags: ['plan', 'schedule', 'calendar', 'date'] },
  { char: '📞', tags: ['call', 'phone', 'meeting', 'talk'] },
  { char: '📧', tags: ['email', 'mail', 'message'] },
  { char: '🛠️', tags: ['fix', 'tool', 'build', 'maintenance'] },
  { char: '💰', tags: ['finance', 'money', 'budget', 'cost'] },
  { char: '🚀', tags: ['ship', 'launch', 'startup', 'fast'] },

  // Lifestyle & Health
  { char: '🏋️', tags: ['gym', 'workout', 'exercise', 'weight'] },
  { char: '🏃', tags: ['run', 'cardio', 'jog'] },
  { char: '🧘', tags: ['meditate', 'yoga', 'mindfulness'] },
  { char: '💤', tags: ['sleep', 'nap', 'rest'] },
  { char: '💊', tags: ['health', 'medicine', 'vitamin'] },
  { char: '🩺', tags: ['doctor', 'medical', 'checkup'] },
  
  // Creative & Hobbies
  { char: '🎨', tags: ['art', 'design', 'paint', 'draw'] },
  { char: '🎧', tags: ['music', 'listen', 'podcast'] },
  { char: '📷', tags: ['photo', 'camera', 'shoot'] },
  { char: '🎮', tags: ['game', 'play', 'console'] },
  { char: '📚', tags: ['read', 'book', 'learn'] },
  { char: '🎸', tags: ['guitar', 'music', 'instrument'] },
  { char: '✍️', tags: ['write', 'author', 'pen'] },

  // Chores & Food
  { char: '🧹', tags: ['clean', 'chore', 'house'] },
  { char: '🧺', tags: ['laundry', 'clothes', 'wash'] },
  { char: '🛒', tags: ['shop', 'buy', 'groceries'] },
  { char: '🍳', tags: ['cook', 'food', 'kitchen'] },
  { char: '🍽️', tags: ['eat', 'dinner', 'lunch'] },
  { char: '☕', tags: ['coffee', 'break', 'drink'] },
  
  // Misc
  { char: '🚗', tags: ['drive', 'car', 'travel', 'commute'] },
  { char: '✈️', tags: ['fly', 'plane', 'travel', 'trip'] },
  { char: '🏠', tags: ['home', 'house', 'family'] },
  { char: '🎓', tags: ['school', 'university', 'study'] },
  { char: '🐾', tags: ['pet', 'dog', 'cat', 'walk'] },
  { char: '🌱', tags: ['garden', 'plant', 'nature'] },
  { char: '⚡', tags: ['energy', 'power', 'charge'] },
  { char: '💡', tags: ['idea', 'light', 'create'] },
];

export const PRESET_EMOJIS = EMOJI_LIBRARY.map(e => e.char);