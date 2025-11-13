import { Router } from "express"
import { createOrder, getOrders } from "../controllers/order.controller"
import { schemaBodyValidator, schemaQuerysValidator } from "../middlewares/schema-validator"
import { orderCreateBodySchema, orderSelectQuerySchema } from "../schemas/order.schema"

const router = Router()

router.get("/", schemaQuerysValidator(orderSelectQuerySchema), getOrders)
router.post("/new", schemaBodyValidator(orderCreateBodySchema), createOrder)
// router.put("/:id", schemaBodyValidator(orderUpdateBodySchema), updateOrder)
// router.delete("/:id", schemaBodyValidator(orderUpdateBodySchema), deleteOrder)

export default router
