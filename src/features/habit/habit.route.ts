import { Router } from "express"
import Validator from "../../middlewares/schema.middleware"
import HabitController from "./habit.controller"
import HabitSchema from "./habit.schema"

const router = Router()

router.post("/", Validator.body(HabitSchema.create), HabitController.create)
router.get("/", HabitController.getAll)
router.get("/:id", Validator.query(HabitSchema.select), HabitController.getById)
router.patch("/:id", Validator.body(HabitSchema.update), HabitController.update)
router.delete("/:id", HabitController.remove)
router.get("/report/top", HabitController.getTop)

router.post("/:id", Validator.body(HabitSchema.createLog), HabitController.createLogById)

export default router
