import prisma from "../../modules/prisma"
import type { CreateHabit, CreateHabitLog } from "./habit.type"

async function create(userId: string, data: CreateHabit) {
	const { title, description } = data
	const habit = await prisma.habit.create({
		data: { title, description, userId },
		select: { id: true, title: true, description: true, createdAt: true, updatedAt: true }
	})
	return habit
}

async function getAll(userId: string) {
	const habits = await prisma.habit.findMany({
		where: { userId },
		select: { id: true, title: true, description: true, createdAt: true, updatedAt: true }
	})
	return habits
}

async function getById(userId: string, habitId: string, date?: string) {
	let conditions = {}
	const isDate = date ? !Number.isNaN(new Date(date).getTime()) : true
	if (!isDate) throw { status: 400, error: "La fecha proporcionada no es válida." }

	if (date) {
		const startOfDay = new Date(date)
		startOfDay.setHours(0, 0, 0, 0)
		const endOfDay = new Date(date)
		endOfDay.setHours(23, 59, 59, 999)
		conditions = { date: { gte: startOfDay, lte: endOfDay } }
	} else conditions = { completed: true }

	const habit = await prisma.habit.findFirst({
		where: { id: habitId, userId },
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
			updatedAt: true,
			logs: {
				where: conditions,
				select: { id: true, completed: true, date: true },
				orderBy: { date: "desc" }
			}
		}
	})

	if (!habit) throw { status: 404, error: "No se encontró el hábito díario." }
	return habit
}

async function update(userId: string, habitId: string, data: Partial<CreateHabit>) {
	const { title, description } = data

	await getById(userId, habitId)
	const habit = await prisma.habit.update({
		where: { id: habitId, userId },
		data: { title, description, updatedAt: new Date() },
		select: { id: true, title: true, description: true, createdAt: true, updatedAt: true }
	})

	return habit
}

async function remove(userId: string, habitId: string) {
	await getById(userId, habitId)

	const habit = await prisma.habit.delete({
		where: { id: habitId, userId },
		select: { id: true, title: true, description: true }
	})
	return habit
}

async function createLogById(userId: string, habitId: string, data: CreateHabitLog) {
	const { completed, date } = data
	await getById(userId, habitId)

	const today = new Date()
	const logDate = new Date(date)

	const todayDay = new Date(today)
	todayDay.setHours(0, 0, 0, 0)
	const logDay = new Date(logDate)
	logDay.setHours(0, 0, 0, 0)

	if (logDay.getTime() !== todayDay.getTime())
		throw { status: 400, error: "No se puede añadir el habíto de un dia que no es hoy. Esperá que sea ese día." }

	const lastLog = await prisma.habitLog.findFirst({
		where: { habitId },
		orderBy: { date: "desc" },
		select: { id: true, completed: true, date: true }
	})

	if (lastLog && lastLog.completed === completed) return lastLog

	const habit = await prisma.habitLog.create({
		data: { completed, habitId, date: logDate },
		select: { id: true, completed: true, date: true }
	})

	return habit
}

async function getTop(userId: string) {
	const habits = await prisma.habit.findMany({
		where: { userId },
		take: 10,
		orderBy: { createdAt: "desc" },
		select: { id: true, title: true, description: true, createdAt: true }
	})
	return habits
}

export default { create, getAll, getById, update, remove, getTop, createLogById }
