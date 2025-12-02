import { Router } from "express"
import ProductController from "../controllers/product.controller"
import { schemaBodyValidator } from "../middlewares/schema-validator"
import { verifySession } from "../middlewares/verify-session"
import { productCreateBodySchema } from "../schemas/product.schema"

const router = Router()

router.get("/", ProductController.get)
router.get("/:id", ProductController.getById)
router.post("/new", verifySession, schemaBodyValidator(productCreateBodySchema), ProductController.create)
// router.put("/:id", schemaBodyValidator(productUpdateBodySchema), updateProduct)
// router.delete("/:id", schemaBodyValidator(productDeletedBodySchema), deleteProduct)
// router.put("/:id/disabled", disableProduct)

export default router
