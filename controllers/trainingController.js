const Training = require("../models/Training");
const User = require("../models/User");
const moment = require("moment");
const { errHandlerResponse } = require("../helpers/errorResponses");

class trainingController {
  async createTraining(req, res) {
    try {
      const user = req.userId;
      const word = req.params.wordId;
      const existingTraining = await Training.findOne({ word, user });

      if (existingTraining) {
        return res.status(400).json({
          message: "Это слово уже было добавленно к тренировкам",
        });
      }

      const newTraining = await new Training({
        word,
        user,
      }).save();

      return res.status(200).json({ newTraining });
    } catch (err) {
      errHandlerResponse(res, 404, "Ошибка создания тренинга", err);
    }
  }

  async updateTraining(req, res) {
    try {
      const { repeatLevel, nextRepeatDate } = req.body;
      const trainingId = req.params.id;

      if (+repeatLevel > 9) {
        const userId = req.userId;
        const deletedTraining = await Training.findOneAndDelete({
          _id: trainingId,
        });
        const wordId = deletedTraining.word;

        await User.findOneAndUpdate(
          { _id: userId },
          { $push: { knownWords: wordId } }
        );
      }
      const dayOffsets = [0, 1, 3, 7, 14, 30, 60, 90, 180, 360];
      const daysToAdd = dayOffsets[repeatLevel];

      const filter = { _id: trainingId };
      const update = {
        ...(typeof repeatLevel === "number" && { repeatLevel }),
        nextRepeatDate:
          nextRepeatDate ||
          (daysToAdd !== undefined
            ? moment().add(daysToAdd, "days").toDate()
            : null),
      };

      const updatedTraining = await Training.findOneAndUpdate(filter, update, {
        new: true,
      }).populate(["word"]);

      return res.status(200).json({ updatedTraining });
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка обновления тренировки", err);
    }
  }

  async deleteTraining(req, res) {
    try {
      const trainingId = req.params.id;
      await Training.findOneAndDelete({
        _id: trainingId,
      });

      return res.status(200).json(trainingId);
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка удаления тренировки", err);
    }
  }

  async deleteAllMyTraining(req, res) {
    try {
      const userId = req.userId;
      const deletedItems = await Training.deleteMany({
        user: userId,
      });

      return res
        .status(200)
        .json({ message: "Все тренировки успешно удалены", deletedItems });
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка удаления всех тренировок", err);
    }
  }

  async getAllTraining(req, res) {
    try {
      const user = req.userId;
      const { offset, limit } = req.query;

      const params = {
        user,
      };

      const trainingList = await Training.find(params)
        .populate(["word"])
        .sort({ nextRepeatDate: 1 })
        .skip(+offset * +limit)
        .limit(+limit);

      const totalCount = await Training.countDocuments(params);

      return res.status(200).json({ trainingList, totalCount });
    } catch (err) {
      errHandlerResponse(res, 404, "Ошибка получения тренировок", err);
    }
  }

  async getAllRelevantTraining(req, res) {
    try {
      const user = req.userId;
      const { offset, limit } = req.query;
      const currentDate = new Date().toISOString();
      const params = { nextRepeatDate: { $lte: currentDate }, user };
      const totalCount = await Training.countDocuments(params);
      const trainingList = await Training.find(params)
        .populate(["word"])
        .sort({ nextRepeatDate: 1 })
        .skip(+offset * +limit)
        .limit(+limit);

      return res.status(200).json({ trainingList, totalCount });
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка получения тренировок", err);
    }
  }
}

module.exports = new trainingController();
