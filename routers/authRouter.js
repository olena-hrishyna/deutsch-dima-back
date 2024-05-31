const Router = require("express");
const router = new Router();
const controller = require("../controllers/authController");
const authMiddleware = require('../middleware/authMiddleware');

router.post("/registr", controller.registr);
router.post("/login", controller.login);
router.post("/visit", authMiddleware, controller.visit);
router.get("/", authMiddleware, controller.getMyAccount);
router.patch("/", authMiddleware, controller.updateMyAccount);
router.delete("/", authMiddleware, controller.deleteMyAccount);

module.exports = router;
