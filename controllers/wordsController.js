const Word = require("../models/Word");
const Training = require("../models/Training");
const User = require("../models/User");

const { errHandlerResponse } = require("../helpers/errorResponses");

class wordsController {
  async createWord(req, res) {
    try {
      const createdBy = req.userId;

      const {
        partOfSpeech,
        prefix,
        titleDe,
        isReflexivVerb,
        article,
        auxiliaryVerb,
      } = req.body;

      const existingWord = await Word.findOne({
        ...(article && { article }),
        ...(partOfSpeech === "Verb" && {
          prefix,
          isReflexivVerb,
          auxiliaryVerb,
        }),
        partOfSpeech,
        titleDe,
      });
      if (existingWord) {
        return res.status(400).json({ error: "Это слово уже добавленно" });
      }

      const newWord = await new Word({
        ...req.body,
        createdBy,
      }).save();

      return res.status(200).json({ newWord });
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка создания слова", err);
    }
  }

  async updateWord(req, res) {
    try {
      const wordId = req.params.id;
      const updatedWord = await Word.findOneAndUpdate(
        { _id: wordId },
        {
          $set: {
            ...req.body,
            updadedAt: Date(),
          },
        },
        { new: true }
      );

      return res.status(200).json({ updatedWord });
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка обновления слова", err);
    }
  }

  async deleteWord(req, res) {
    try {
      const wordId = req.params.id;
      await Training.deleteMany({ word: wordId });
      await Word.findOneAndDelete({
        _id: wordId,
      });

      return res.status(200).json(wordId);
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка удаления слова", err);
    }
  }

  async getAllWords(req, res) {
    try {
      const userId = req.userId;
      const trainingList = await Training.find({ user: userId });
      const user = await User.findById(userId);
      const inTrainingIds = trainingList.map((el) => el.word.toString());
      const inTrainingCount = inTrainingIds?.length;
      const inKnownIds = user?.knownWords || [];
      const inKnownCount = inKnownIds?.length;
      const {
        offset,
        limit,
        partOfSpeech,
        searchDe,
        searchRu,
        level,
        sort,
        isHideInTraning,
        isHideKnown,
      } = req.query;

      const params = {
        ...((isHideKnown || isHideInTraning) && {
          _id: {
            $nin: [
              ...(isHideKnown ? inKnownIds : []),
              ...(isHideInTraning ? inTrainingIds : []),
            ],
          },
        }),
        ...(partOfSpeech !== "all" && { partOfSpeech }),
        ...(level && { level }),
        ...(searchRu && { titleRu: { $regex: new RegExp(searchRu, "i") } }),
        $or: [
          { titleDe: { $regex: new RegExp(searchDe, "i") } },
          { prefix: { $regex: new RegExp(searchDe, "i") } },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$prefix", "$titleDe"] },
                regex: new RegExp(searchDe, "i"),
              },
            },
          },
        ],
      };
      const list = await Word.find(params)
        .sort(JSON.parse(sort))
        .collation({ locale: "de", strength: 2 }) // чтобы сортировка была без учета регистра
        .skip(+offset * limit)
        .limit(+limit);

      const totalCount = await Word.countDocuments(params);
      const allCount = await Word.countDocuments()

      const wordList = list.map((el) => {
        const word = el._doc;
        const id = word._id.toString();
        return {
          ...word,
          isKnown: !!inKnownIds.includes(id),
          isInTraining: !!inTrainingIds.includes(id),
        };
      });

      return res
        .status(200)
        .json({ wordList, totalCount, inTrainingCount, inKnownCount, allCount });
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка получения слов", err);
    }
  }

  async getWordById(req, res) {
    try {
      const wordId = req.params.id;
      const word = await Word.findById(wordId);

      return res.status(200).json({ word });
    } catch (err) {
      errHandlerResponse(res, 400, "Ошибка получения слова", err);
    }
  }

  async removeWordToKnown(req, res) {
    try {
      const userId = req.userId;
      const wordId = req.params.id;
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { knownWords: wordId } },
        { new: true }
      );

      return res.status(200).json({
        message: "Слово удалено известных",
        user,
      });
    } catch (err) {
      res.status(401).json({
        message: "Ошибка удаления слова из известных",
        err,
      });
    }
  }

  async addWordToKnown(req, res) {
    try {
      const userId = req.userId;
      const wordId = req.params.id;
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { knownWords: wordId } },
        { new: true }
      );

      return res.status(200).json({
        message: "Слово добавленно в известные",
        user,
      });
    } catch (err) {
      res.status(401).json({
        message: "Ошибка добавления слова в известные",
        err,
      });
    }
  }
}

module.exports = new wordsController();
