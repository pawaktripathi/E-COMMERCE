const express = require('express')
let router = express.Router()
const controller = require("../controller/index");

router.get("/", controller.productController.fetch);
router.post("/", controller.productController.create);
router.put("/:productId", controller.productController.update);
router.get("/list", controller.productController.getAll);
router.delete("/:productId", controller.productController.delete);

module.exports = router;