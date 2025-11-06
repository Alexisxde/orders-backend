import { Router } from "express"
import { createProduct, selectIdProduct, selectProducts } from "../controllers/product.controller"
import { schemaBodyValidator } from "../middlewares/schema-validator"
import { productCreateSchema } from "../schemas/product.schema"

const router = Router()

router.get("/", selectProducts)
router.get("/:id", selectIdProduct)
router.post("/new", schemaBodyValidator(productCreateSchema), createProduct)
// router.put("/:id/disabled", disableProduct)
// router.put("/:id", updateProduct)
// router.delete("/:id", deleteProduct)

export default router
