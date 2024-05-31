const Word = require("../models/Word");

const { errHandlerResponse } = require("../helpers/errorResponses");

class wordsController {
  async uploadAudio(req, res) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "Аудиофайл не обнаружен" });
      }

      const wordId = req.params.id;
      const updatedWord = await Word.findOneAndUpdate(
        { _id: wordId },
        {
          $set: {
            audio: file.buffer,
            updadedAt: Date(),
          },
        },
        { new: true }
      );

      if (!updatedWord) {
        return res.status(404).json({ message: "Слово не найдено" });
      }

      res.status(201).json({ updatedWord });
    } catch (err) {
      errHandlerResponse(res, 500, "Ошибка загрузки аудио файла", err);
    }
  }

  async deleteAudio(req, res) {
    try {
      const wordId = req.params.id;
      const updatedWord = await Word.findOneAndUpdate(
        { _id: wordId },
        { $unset: { audio: 1 } }, // удаляет поле audio
        { new: true }
      );

      return res.status(200).json({ updatedWord });
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка удаления аудио", err);
    }
  }

  async getAllAudio(req, res) {
    try {
      const words = await Word.find().sort({ titleDe: 1 });

      return res.status(200).json({ words });
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка получения аудио", err);
    }
  }

  async getAudioById(req, res) {
    try {
      const wordId = req.params.id;
      const word = await Word.findById(wordId);

      return res.status(200).json({ word });
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка получения аудио", err);
    }
  }
}

module.exports = new wordsController();
