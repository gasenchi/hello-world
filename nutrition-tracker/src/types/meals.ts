export type Macro = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type Meal = {
  id: string
  name: string
  description?: string
  macros: Macro
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export type MealLog = {
  id: string
  mealId: string
  quantity: number
  when: string
  macros: Macro
}

export function multiplyMacros(macros: Macro, factor: number): Macro {
  return {
    calories: Math.round(macros.calories * factor),
    protein: Math.round(macros.protein * factor),
    carbs: Math.round(macros.carbs * factor),
    fat: Math.round(macros.fat * factor),
  }
}

