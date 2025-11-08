import { Router } from "express"
import { getReportOrdersToDay, getReportOrdersToMonth } from "../controllers/report.controller"
import { schemaBodyValidator } from "../middlewares/schema-validator"
import { orderSelectReportDaySchema, orderSelectReportMonthSchema } from "../schemas/report.schema"

const router = Router()

router.get("/month", schemaBodyValidator(orderSelectReportMonthSchema), getReportOrdersToMonth)
router.get("/day", schemaBodyValidator(orderSelectReportDaySchema), getReportOrdersToDay)

export default router
