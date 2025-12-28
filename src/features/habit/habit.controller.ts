import type { NextFunction, Request, Response } from "express"
import type { UserJWT } from "../../features/auth/auth.type"
import HabitService from "./habit.service"
import type { CreateHabit, CreateHabitLog, UpdateHabit } from "./habit.type"

async function create(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT
	const { title, description } = req.body as CreateHabit

	try {
		const data = await HabitService.create(userId, { title, description })
		res.status(201).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

async function getAll(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT

	try {
		const data = await HabitService.getAll(userId)
		res.status(200).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

async function getById(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT
	const { id: habitId } = req.params as { id: string }
	const { date } = req.query as { date?: string }

	try {
		const data = await HabitService.getById(userId, habitId, date)
		res.status(200).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

async function update(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT
	const { id: habitId } = req.params as { id: string }
	const { title, description } = req.body as UpdateHabit

	try {
		const data = await HabitService.update(userId, habitId, { title, description })
		res.status(200).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

async function remove(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT
	const { id: habitId } = req.params as { id: string }

	try {
		const data = await HabitService.remove(userId, habitId)
		res.status(200).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

async function createLogById(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT
	const { id: habitId } = req.params as { id: string }
	const { completed, date } = req.body as CreateHabitLog

	try {
		const data = await HabitService.createLogById(userId, habitId, { completed, date })
		res.status(200).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

async function getTop(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT

	try {
		const data = await HabitService.getTop(userId)
		res.status(200).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

export default { create, getAll, getById, update, remove, getTop, createLogById }
