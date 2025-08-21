import { Meal, MealLog } from '../types/meals'

const MEALS_KEY = 'meals_v1'
const LOGS_KEY = 'meal_logs_v1'

export const storage = {
  getMeals(): Meal[] {
    const raw = localStorage.getItem(MEALS_KEY)
    return raw ? (JSON.parse(raw) as Meal[]) : []
  },
  saveMeals(meals: Meal[]) {
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals))
  },
  getLogs(): MealLog[] {
    const raw = localStorage.getItem(LOGS_KEY)
    return raw ? (JSON.parse(raw) as MealLog[]) : []
  },
  saveLogs(logs: MealLog[]) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs))
  },
}

export function upsertMeal(meal: Meal): Meal[] {
  const meals = storage.getMeals()
  const idx = meals.findIndex((m) => m.id === meal.id)
  if (idx >= 0) meals[idx] = meal
  else meals.unshift(meal)
  storage.saveMeals(meals)
  return meals
}

export function deleteMeal(mealId: string): Meal[] {
  const meals = storage.getMeals().filter((m) => m.id !== mealId)
  storage.saveMeals(meals)
  return meals
}

export function logMeal(entry: MealLog): MealLog[] {
  const logs = storage.getLogs()
  logs.unshift(entry)
  storage.saveLogs(logs)
  return logs
}

export function logsForDate(dateStr: string): MealLog[] {
  const ymd = dateStr.slice(0, 10)
  return storage.getLogs().filter((l) => l.when.slice(0, 10) === ymd)
}

