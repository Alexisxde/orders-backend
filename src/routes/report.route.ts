import { Router } from "express"
import { getReportOrdersToClient, getReportOrdersToDay, getReportOrdersToMonth } from "../controllers/report.controller"
import { schemaBodyValidator } from "../middlewares/schema-validator"
import { orderSelectReportDayBodySchema, orderSelectReportMonthBodySchema } from "../schemas/report.schema"

const router = Router()

router.get("/month", schemaBodyValidator(orderSelectReportMonthBodySchema), getReportOrdersToMonth)
router.get("/day", schemaBodyValidator(orderSelectReportDayBodySchema), getReportOrdersToDay)
router.get("/clients", getReportOrdersToClient)

export default router
