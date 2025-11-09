import { Router } from "express"
import {
	getReportOrdersToDay,
	getReportOrdersToMonth,
	getReportOrdersTopClients,
	getReportOrdersTopProducts
} from "../controllers/report.controller"
import { schemaBodyValidator } from "../middlewares/schema-validator"
import { orderSelectReportDayBodySchema, orderSelectReportMonthBodySchema } from "../schemas/report.schema"

const router = Router()

router.get("/month", schemaBodyValidator(orderSelectReportMonthBodySchema), getReportOrdersToMonth)
router.get("/day", schemaBodyValidator(orderSelectReportDayBodySchema), getReportOrdersToDay)
router.get("/clients", getReportOrdersTopClients)
router.get("/products", getReportOrdersTopProducts)

export default router
