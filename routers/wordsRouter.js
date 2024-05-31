const Router = require("express");
const router = new Router();
const controller = require("../controllers/wordsController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", authMiddleware, controller.getAllWords);
router.get("/:id", authMiddleware, controller.getWordById);
router.post("/", adminMiddleware, controller.createWord);
router.patch("/update/:id", adminMiddleware, controller.updateWord);
router.patch("/known/:id", authMiddleware, controller.addWordToKnown);
router.patch("/unknown/:id", authMiddleware, controller.removeWordToKnown);
router.delete("/:id", adminMiddleware, controller.deleteWord);

module.exports = router;
