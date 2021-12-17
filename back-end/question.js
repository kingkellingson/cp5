const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();
//const answer = require("./answer.js");
//const Answer = answer.model; 

const question = {
  questionContent: String,
  answerA: {
    answerContent: String,
    points: Number,
  },
  answerB: {
    answerContent: String,
    points: Number,
  },
  answerC: {
    answerContent: String,
    points: Number,
  },
  answerD: {
    answerContent: String,
    points: Number,
  },
};



const Question = mongoose.model('Question', question);

module.exports = {
    routes: router,
    model: Question,
  };
  