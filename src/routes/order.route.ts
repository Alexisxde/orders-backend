import { Router } from "express"
import { createOrder, getOrders } from "../controllers/order.controller"
import { schemaBodyValidator, schemaQueryValidator } from "../middlewares/schema-validator"
import { verifySession } from "../middlewares/verify-session"
import { orderCreateSchema, orderSelectSchema } from "../schemas/order.schema"

const router = Router()

router.get("/", schemaQueryValidator(orderSelectSchema), verifySession, getOrders)
router.post("/new", schemaBodyValidator(orderCreateSchema), verifySession, createOrder)
// router.put("/:id", updateOrder)

export default router
