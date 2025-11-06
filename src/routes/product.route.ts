import { Router } from "express"
import { createProduct, selectIdProduct, selectProducts } from "../controllers/product.controller"
import { authUser } from "../middlewares/auth-user"
import { schemaBodyValidator } from "../middlewares/schema-validator"
import { verifySession } from "../middlewares/verify-session"
import { productCreateSchema } from "../schemas/product.schema"

const router = Router()

router.get("/", verifySession, authUser, selectProducts)
router.get("/:id", selectIdProduct)
router.post("/new", schemaBodyValidator(productCreateSchema), createProduct)
// router.put("/:id/disabled", disableProduct)
// router.put("/:id", updateProduct)
// router.delete("/:id", deleteProduct)

export default router
