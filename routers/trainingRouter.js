const Router = require("express");
const router = new Router();
const controller = require("../controllers/trainingController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, controller.getAllTraining);
router.get("/relevant", authMiddleware, controller.getAllRelevantTraining);
router.post("/:wordId", authMiddleware, controller.createTraining);
router.patch("/:id", authMiddleware, controller.updateTraining);
router.delete("/all", authMiddleware, controller.deleteAllMyTraining);
router.delete("/:id", authMiddleware, controller.deleteTraining);

module.exports = router;
