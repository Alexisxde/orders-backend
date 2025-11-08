import { Router } from "express"
import { createOrder, getOrders } from "../controllers/order.controller"
import { schemaBodyValidator, schemaQueryValidator } from "../middlewares/schema-validator"
import { orderCreateBodySchema, orderSelectBodySchema } from "../schemas/order.schema"

const router = Router()

router.get("/", schemaQueryValidator(orderSelectBodySchema), getOrders)
router.post("/new", schemaBodyValidator(orderCreateBodySchema), createOrder)
// router.put("/:id", updateOrder)

export default router
