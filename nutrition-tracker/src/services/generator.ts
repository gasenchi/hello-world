import type { Meal } from '../types/meals'

const sampleMeals: Array<Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>> = [
  { name: 'Chicken Rice Bowl', description: 'Grilled chicken, jasmine rice, broccoli', macros: { calories: 620, protein: 45, carbs: 68, fat: 17 }, tags: ['lunch','high-protein'] },
  { name: 'Oats + Berries', description: 'Rolled oats, almond milk, blueberries', macros: { calories: 380, protein: 12, carbs: 62, fat: 9 }, tags: ['breakfast'] },
  { name: 'Salmon + Veg', description: 'Baked salmon, asparagus, quinoa', macros: { calories: 580, protein: 40, carbs: 40, fat: 24 }, tags: ['dinner','omega-3'] },
  { name: 'Greek Yogurt Bowl', description: 'Yogurt, granola, honey', macros: { calories: 320, protein: 20, carbs: 40, fat: 8 }, tags: ['snack'] },
]

export function mockGenerateMeals(goal: 'weight_loss'|'muscle_gain'|'fitness', count = 3): Meal[] {
  const now = new Date().toISOString()
  const mod = goal === 'weight_loss' ? 0.9 : goal === 'muscle_gain' ? 1.1 : 1
  const pick = [...sampleMeals]
  const out: Meal[] = []
  for (let i = 0; i < count; i++) {
    const base = pick[i % pick.length]
    out.push({
      id: crypto.randomUUID(),
      name: base.name,
      description: base.description,
      macros: {
        calories: Math.round(base.macros.calories * mod),
        protein: Math.round(base.macros.protein * mod),
        carbs: Math.round(base.macros.carbs * mod),
        fat: Math.round(base.macros.fat * mod),
      },
      tags: base.tags,
      createdAt: now,
      updatedAt: now,
    })
  }
  return out
}

