import { Router } from "express"
import ProductController from "../controllers/product.controller"
import { schemaBodyValidator } from "../middlewares/schema-validator"
import ProductSchema from "../schemas/product.schema"

const router = Router()

router.get("/", ProductController.get)
router.get("/:id", ProductController.getById)
router.post("/new", schemaBodyValidator(ProductSchema.create), ProductController.create)
router.put("/:id", schemaBodyValidator(ProductSchema.update), ProductController.update)
// router.delete("/:id", schemaBodyValidator(productDeletedBodySchema), deleteProduct)

export default router
