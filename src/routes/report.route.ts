import { Router } from "express"
import {
	getReportOrders6Month,
	getReportOrdersToDay,
	getReportOrdersToMonth,
	getReportOrdersTopClients,
	getReportOrdersTopProducts
} from "../controllers/report.controller"
import { schemaQuerysValidator } from "../middlewares/schema-validator"
import {
	orderSelectReportDayQuerysSchema,
	orderSelectReportMonthQuerysSchema,
	orderSelectReportToMonthQuerysSchema
} from "../schemas/report.schema"

const router = Router()

router.get("/6month", schemaQuerysValidator(orderSelectReportMonthQuerysSchema), getReportOrders6Month)
router.get("/month", schemaQuerysValidator(orderSelectReportToMonthQuerysSchema), getReportOrdersToMonth)
router.get("/day", schemaQuerysValidator(orderSelectReportDayQuerysSchema), getReportOrdersToDay)
router.get("/clients", getReportOrdersTopClients)
router.get("/products", getReportOrdersTopProducts)

export default router
