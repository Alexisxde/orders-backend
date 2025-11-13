import { Router } from "express"
import { createProduct, selectIdProduct, selectProducts } from "../controllers/product.controller"
import { schemaBodyValidator } from "../middlewares/schema-validator"
import { productCreateBodySchema } from "../schemas/product.schema"

const router = Router()

router.get("/", selectProducts)
router.get("/:id", selectIdProduct)
router.post("/new", schemaBodyValidator(productCreateBodySchema), createProduct)
// router.put("/:id", schemaBodyValidator(productUpdateBodySchema), updateProduct)
// router.delete("/:id", schemaBodyValidator(productDeletedBodySchema), deleteProduct)
// router.put("/:id/disabled", disableProduct)

export default router
