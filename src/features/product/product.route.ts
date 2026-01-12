import { Router } from "express"
import SchemaMiddleware from "../../middlewares/schema.middleware"
import ProductController from "./product.controller"
import ProductSchema from "./product.schema"

const router = Router()

router.get("/", ProductController.getAll)
router.get("/:id", ProductController.getById)
router.post("/", SchemaMiddleware.body(ProductSchema.create), ProductController.create)
router.patch("/:id", SchemaMiddleware.body(ProductSchema.update), ProductController.update)
// router.delete("/:id", SchemaMiddleware.body(productDeletedBodySchema), deleteProduct)

export default router
