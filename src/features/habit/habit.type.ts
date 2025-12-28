import type { Habit as HabitPrisma } from "@prisma/client"
import type { z } from "zod"
import type HabitSchema from "./habit.schema"

export type Habit = HabitPrisma
export type CreateHabit = z.infer<typeof HabitSchema.create>
export type UpdateHabit = z.infer<typeof HabitSchema.update>

export type CreateHabitLog = z.infer<typeof HabitSchema.createLog>
