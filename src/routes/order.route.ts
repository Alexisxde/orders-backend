import { Router } from "express"
import { createOrder, getOrders } from "../controllers/order.controller"
import { schemaBodyValidator, schemaQueryValidator } from "../middlewares/schema-validator"
import { orderCreateSchema, orderSelectSchema } from "../schemas/order.schema"

const router = Router()

router.get("/", schemaQueryValidator(orderSelectSchema), getOrders)
router.post("/new", schemaBodyValidator(orderCreateSchema), createOrder)
// router.put("/:id", updateOrder)

export default router
