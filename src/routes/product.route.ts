import { Router } from "express"
import { createProduct, selectIdProduct, selectProducts } from "../controllers/product.controller"

const router = Router()

router.get("/", selectProducts)
router.get("/:id", selectIdProduct)
router.post("/new", createProduct)

export default router
