import { Router } from "express"
import OrderController from "../controllers/order.controller"
import { schemaBodyValidator, schemaQuerysValidator } from "../middlewares/schema-validator"
import OrderSchema from "../schemas/order.schema"

const router = Router()

router.get("/", schemaQuerysValidator(OrderSchema.select), OrderController.get)
router.post("/new", schemaBodyValidator(OrderSchema.create), OrderController.create)
router.get("/:id", OrderController.getById)
router.put("/:id", schemaBodyValidator(OrderSchema.update), OrderController.update)
// router.delete("/:id", OrderController.delete)

export default router
