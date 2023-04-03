const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
    required: true,
  },
  networking: {
    q: {
      type: String,
    },
    q_answer: {
      type: String,
    },
    q_correct: {
      type: Boolean,
    },
  },
  programming: {
    q: {
      type: String,
    },
    q_answer: {
      type: String,
    },
    q_correct: {
      type: Boolean,
    },
  },
  databases: {
    q: {
      type: String,
    },
    q_answer: {
      type: String,
    },
    q_correct: {
      type: Boolean,
    },
  },
});

const quiz = mongoose.model("quiz", QuizSchema);

module.exports = quiz;
