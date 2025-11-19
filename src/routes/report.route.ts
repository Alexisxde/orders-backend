import { Router } from "express"
import {
	getReportOrdersSales,
	getReportOrdersToDay,
	getReportOrdersToMonth,
	getReportOrdersTopClients,
	getReportOrdersTopProducts
} from "../controllers/report.controller"
import { schemaQuerysValidator } from "../middlewares/schema-validator"
import {
	orderSelectReportDayQuerysSchema,
	orderSelectReportMonthQuerysSchema,
	orderSelectReportSalesSchema
} from "../schemas/report.schema"

const router = Router()

router.get("/month", schemaQuerysValidator(orderSelectReportMonthQuerysSchema), getReportOrdersToMonth)
router.get("/day", schemaQuerysValidator(orderSelectReportDayQuerysSchema), getReportOrdersToDay)
router.get("/clients", getReportOrdersTopClients)
router.get("/products", getReportOrdersTopProducts)
router.get("/sales", schemaQuerysValidator(orderSelectReportSalesSchema), getReportOrdersSales)

export default router
