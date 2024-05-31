const { Schema, model } = require("mongoose");

const partOfSpeechEnum = [
  "Noun",
  "Verb",
  "Adjective",
  "Adverb",
  "Preposition",
  "Conjunction",
  "Interjection",
  "Phrase",
];

const knowledgeEnum = ["perfect", "good", "forgeting", "bad"];

const auxiliaryVerbEnum = ["sein", "haben"];

const levelEnum = ["A1", "A2", "B1", "B2", "C1", "C2"];

const articleEnum = ["der", "die", "das"];

const wordSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updadedAt: { type: Date, default: Date.now },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  titleRu: [{ type: String }],
  titleDe: { type: String, required: true },
  partOfSpeech: { type: String, enum: partOfSpeechEnum, required: true },
  exampleUsage: [{ type: String }],
  knowledge: { type: String, enum: knowledgeEnum, default: "bad" },
  level: { type: String, enum: levelEnum, default: "A1" },
  audio: { type: Buffer },
  isInTraining: { type: Boolean, default: false },
  isKnown: { type: Boolean, default: false },
  // Noun
  article: { type: String, enum: articleEnum },
  titleDePl: { type: String },
  feminin: { type: String },
  // Adjektiv 
  comparison: [{ type: String }], // степени сравнения
  // Verb
  isTrennbareVerben: { type: Boolean, default: false }, // отделяемый?
  isReflexivVerb: { type: Boolean, default: false }, // возвратный с sich
  isIrregular: { type: Boolean, default: false }, // регулярный?
  prefix: { type: String },
  auxiliaryVerb: { type: String, enum: auxiliaryVerbEnum }, // вспомогательный глагол
  perfektForm: { type: String },
  präteritumFormIch: { type: String },
  präteritumFormDu: { type: String },
  präteritumFormEr: { type: String },
  präteritumFormWir: { type: String },
  präteritumFormIhr: { type: String },
  konjunktiv2FormIch: { type: String },
  konjunktiv2FormDu: { type: String },
  konjunktiv2FormEr: { type: String },
  konjunktiv2FormWir: { type: String },
  konjunktiv2FormIhr: { type: String },
});

module.exports = model("Word", wordSchema);
