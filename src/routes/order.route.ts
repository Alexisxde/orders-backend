import { Router } from "express"
import OrderController from "../controllers/order.controller"
import { schemaBodyValidator, schemaQuerysValidator } from "../middlewares/schema-validator"
import { orderCreateBodySchema, orderSelectQuerySchema } from "../schemas/order.schema"

const router = Router()

router.get("/", schemaQuerysValidator(orderSelectQuerySchema), OrderController.get)
router.post("/new", schemaBodyValidator(orderCreateBodySchema), OrderController.create)
// router.put("/:id", schemaBodyValidator(orderUpdateBodySchema), updateOrder)
// router.delete("/:id", schemaBodyValidator(orderUpdateBodySchema), deleteOrder)

export default router
