const Router = require("express");
const router = new Router();
const multer = require('multer');
const controller = require("../controllers/audioController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", controller.getAllAudio);
router.get("/:id", controller.getAudioById);
router.post("/:id", upload.single('audio'), controller.uploadAudio);
router.delete("/:id", controller.deleteAudio);

module.exports = router;