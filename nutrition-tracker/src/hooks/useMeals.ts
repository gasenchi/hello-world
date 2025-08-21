import { useEffect, useMemo, useState } from 'react'
import type { Meal, MealLog, Macro } from '../types/meals'
import { storage, upsertMeal as storageUpsertMeal, deleteMeal as storageDeleteMeal, logMeal as storageLogMeal } from '../services/storage'
import { multiplyMacros } from '../types/meals'

export function useMeals() {
	const [meals, setMeals] = useState<Meal[]>([])
	const [logs, setLogs] = useState<MealLog[]>([])

	useEffect(() => {
		setMeals(storage.getMeals())
		setLogs(storage.getLogs())
	}, [])

	const upsertMeal = (meal: Meal) => {
		const updated = storageUpsertMeal(meal)
		setMeals(updated)
	}

	const deleteMeal = (mealId: string) => {
		const updated = storageDeleteMeal(mealId)
		setMeals(updated)
	}

	const logMeal = (meal: Meal, quantity: number, whenISO: string) => {
		const entry: MealLog = {
			id: crypto.randomUUID(),
			mealId: meal.id,
			quantity,
			when: whenISO,
			macros: multiplyMacros(meal.macros, quantity),
		}
		const updated = storageLogMeal(entry)
		setLogs(updated)
		return entry
	}

	const todayTotals: Macro = useMemo(() => {
		const today = new Date().toISOString().slice(0, 10)
		const dayLogs = logs.filter((l) => l.when.slice(0, 10) === today)
		return dayLogs.reduce<Macro>((acc, l) => ({
			calories: acc.calories + l.macros.calories,
			protein: acc.protein + l.macros.protein,
			carbs: acc.carbs + l.macros.carbs,
			fat: acc.fat + l.macros.fat,
		}), { calories: 0, protein: 0, carbs: 0, fat: 0 })
	}, [logs])

	return { meals, logs, setMeals, setLogs, upsertMeal, deleteMeal, logMeal, todayTotals }
}