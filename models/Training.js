const { Schema, model } = require("mongoose");

const trainingSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  word: {
    type: Schema.Types.ObjectId,
    ref: "Word",
  },
  repeatLevel: { type: Number, default: 0 }, // from 0 to 9
  nextRepeatDate: { type: Date, default: Date.now },
});

module.exports = model("Training", trainingSchema);

// 0 - первый раз (только созданное)
// 1 - завтра
// 2 - через 3 дня
// 3 - через 7 дней
// 4 - через 14 дней
// 5 - через 30 дней
// 6 - через 60 дней
// 7 - через 90 дней
// 8 - через 180 дней
// 9 - через 360 дней
